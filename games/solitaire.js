import {freshDeck,cardHTML} from "./helpers.js";import {sfx} from "../js/audio.js";import {reward} from "../js/coins.js";import {showResult} from "./result.js";
import {getLevel,advanceLevel,applyLoss,lossPenalty,controls,bindControls} from "./economy.js";
let stock=[],waste=[],piles=[],found={"♠":[],"♥":[],"♦":[],"♣":[]},selected=null,stopped=false;
export function mount(host){start(host)}
function start(host){
 const d=freshDeck();piles=[];for(let i=0;i<7;i++){const p=[];for(let j=0;j<=i;j++)p.push({...d.pop(),face:j===i});piles.push(p)}
 stock=d;waste=[];found={"♠":[],"♥":[],"♦":[],"♣":[]};selected=null;stopped=false;draw(host,"Build tableau downward in alternating colors. Move Aces upward by suit.")
}
function color(c){return c.s==="♥"||c.s==="♦"?"red":"black"}
function canStack(moving,target){return moving.v===target.v-1&&color(moving)!==color(target)}
function draw(host,msg){
 const level=getLevel("solitaire");
 host.innerHTML=`<div class="game-shell solitaire-felt"><details class="rules-box"><summary>SOLITAIRE RULES</summary><p>Build tableau piles downward in alternating colors. Move Aces through Kings to the four foundations by suit. Only Kings may move into empty tableau columns.</p></details>${controls("solitaire",{})}
 <div class="game-hud"><div class="hud-box">Stock: <b>${stock.length}</b></div><div class="hud-box">Foundation: <b>${Object.values(found).reduce((n,p)=>n+p.length,0)}/52</b></div><div class="hud-box">Level: <b>${level}</b></div><div class="hud-box">Loss: <b>-${lossPenalty("solitaire")}</b></div></div><div class="action-feed">${msg}</div>
 <div class="sol-top-row"><div class="sol-zone"><div><button id="stockBtn" class="deck-stack ${stock.length?"":"empty"}">${stock.length?"🂠":"↻"}</button><div class="deck-count">${stock.length} cards</div></div><button id="wasteBtn" class="sol-slot">${waste.length?cardHTML(waste.at(-1)):"WASTE"}</button></div>
 <div class="sol-zone">${Object.entries(found).map(([s,p])=>`<button class="sol-slot" data-found="${s}">${p.length?cardHTML(p.at(-1)):s}</button>`).join("")}</div></div><div id="solBoard" class="solitaire-board"></div></div>`;
 bindControls(host,{onNew:()=>start(host),onStop:()=>forfeit(host)});
 const b=host.querySelector("#solBoard");piles.forEach((pile,pi)=>{const col=document.createElement("div");col.className="sol-column";col.dataset.col=pi;pile.forEach((c,ci)=>{const w=document.createElement("button");w.className="sol-card-stack";w.innerHTML=c.face?cardHTML(c):'<div class="play-card">🂠</div>';w.disabled=!c.face;w.onclick=(e)=>{e.stopPropagation();selectPile(host,pi,ci)};col.append(w)});col.onclick=e=>{if(e.target===col)moveSelectedToPile(host,pi)};b.append(col)});
 host.querySelector("#stockBtn").onclick=()=>{if(stock.length)waste.push({...stock.pop(),face:true});else{stock=waste.reverse();waste=[]}selected=null;sfx("card");draw(host,"Card drawn.")};
 host.querySelector("#wasteBtn").onclick=()=>{if(waste.length){selected={type:"waste",card:waste.at(-1)};draw(host,"Waste card selected. Choose a tableau column or foundation.")}};
 host.querySelectorAll("[data-found]").forEach(x=>x.onclick=()=>moveToFoundation(host,x.dataset.found))
}
async function forfeit(host){const p=await applyLoss("solitaire","forfeit");showResult(host,{title:"Game Forfeited",message:`-${p} coins`,win:false,onContinue:()=>start(host)})}
function selectPile(host,pi,ci){selected={type:"pile",pi,ci,cards:piles[pi].slice(ci)};draw(host,"Cards selected. Choose another column or foundation.")}
function moveSelectedToPile(host,pi){
 if(!selected)return;const cards=selected.type==="waste"?[selected.card]:selected.cards,target=piles[pi].at(-1);
 if((!target&&cards[0].r==="K")||(target&&canStack(cards[0],target))){
   if(selected.type==="waste")waste.pop();else{piles[selected.pi].splice(selected.ci);if(piles[selected.pi].length)piles[selected.pi].at(-1).face=true}
   piles[pi].push(...cards);selected=null;sfx("card");draw(host,"Move completed.")
 }else{sfx("bad");draw(host,"That move is not allowed.")}
}
async function moveToFoundation(host,s){
 if(!selected)return;const c=selected.type==="waste"?selected.card:selected.cards?.length===1?selected.cards[0]:null;if(!c||c.s!==s)return;
 const expected=found[s].length+2;if(c.v!==expected){sfx("bad");draw(host,"Foundation must build upward by suit.");return}
 if(selected.type==="waste")waste.pop();else{piles[selected.pi].splice(selected.ci,1);if(piles[selected.pi].length)piles[selected.pi].at(-1).face=true}
 found[s].push(c);selected=null;sfx("win");
 if(Object.values(found).every(p=>p.length===13)){const level=getLevel("solitaire"),coins=180+level*20;await reward("solitaire",coins);advanceLevel("solitaire");showResult(host,{title:"Solitaire Win!",message:"All four foundations completed.",coins,onContinue:()=>start(host)})}
 else draw(host,"Card moved to foundation.")
}
export function unmount(){stopped=true}
