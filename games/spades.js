import {freshDeck,cardHTML} from "./helpers.js";import {reward} from "../js/coins.js";import {sfx} from "../js/audio.js";import {showResult} from "./result.js";
import {getLevel,advanceLevel,applyLoss,lossPenalty,controls,bindControls} from "./economy.js";
let hands=[[],[],[],[]],scores=[0,0],trick=[],leader=0,current=0,spadesBroken=false,locked=false,stopped=false,deckCount=0;
const names=["Cookie","Left Opp","Partner","Right Opp"];
export function mount(host){start(host)}
function start(host){
 const d=freshDeck();deckCount=d.length;hands=[[],[],[],[]];for(let i=0;i<52;i++){hands[i%4].push(d[i]);deckCount--;}hands.forEach(h=>h.sort((a,b)=>a.s.localeCompare(b.s)||a.v-b.v));
 scores=[0,0];trick=[];leader=0;current=0;spadesBroken=false;locked=false;stopped=false;draw(host,"Cookie leads. Follow suit when possible.")
}
function backs(n){return `<div class="hidden-hand">${Array.from({length:n},()=>'<div class="card-back-mini"></div>').join("")}</div>`}
function legalCards(player){
 const hand=hands[player];if(!trick.length){
   const nonSpades=hand.filter(c=>c.s!=="♠");
   return spadesBroken||!nonSpades.length?hand:nonSpades
 }
 const lead=trick[0].card.s,matching=hand.filter(c=>c.s===lead);
 return matching.length?matching:hand
}
function draw(host,msg){
 const level=getLevel("spades");
 host.innerHTML=`<div class="game-shell"><details class="rules-box"><summary>SPADES RULES</summary><p>Use one clean 52-card deck. Follow the suit led whenever you can. Spades cannot lead until broken unless your hand contains only spades. A spade may cut only when you cannot follow suit.</p></details>
 ${controls("spades",{})}<div class="game-hud"><div class="hud-box">Cookie Team: <b>${scores[0]}</b></div><div class="hud-box">Opp Team: <b>${scores[1]}</b></div><div class="hud-box">Level: <b>${level}</b></div><div class="hud-box">Loss: <b>-${lossPenalty("spades")}</b></div></div>
 <div class="deck-area"><div><div class="deck-stack ${deckCount?"":"empty"}">${deckCount?"🂠":"DEALT"}</div><div class="deck-count">${deckCount} cards</div></div></div><div class="turn-banner">${msg}</div><div class="seat-row"><div class="player-seat ${current===1?"active":""}"><h3>Left Opp</h3>${backs(hands[1].length)}</div><div class="player-seat ${current===2?"active":""}"><h3>Partner</h3>${backs(hands[2].length)}</div><div class="player-seat ${current===3?"active":""}"><h3>Right Opp</h3>${backs(hands[3].length)}</div></div>
 <div class="spades-table"><div class="play-sequence">${[0,1,2,3].map(p=>{const x=trick.find(t=>t.player===p);return `<div class="sequence-step ${x?"active":""}"><div class="played-slot"><div>${names[p]}</div>${x?cardHTML(x.card):`<div class="play-card">WAIT</div>`}</div></div>`}).join("")}</div></div>
 <h3>Your Hand</h3><div class="card-row" id="spadesHand"></div></div>`;
 bindControls(host,{onNew:()=>start(host),onStop:()=>forfeit(host)});
 const legal=new Set(legalCards(0).map(c=>c.id)),row=host.querySelector("#spadesHand");
 hands[0].forEach((c,i)=>{const w=document.createElement("button");w.innerHTML=cardHTML(c);w.className="selectable";w.disabled=locked||current!==0||!legal.has(c.id);w.onclick=()=>humanPlay(host,i);row.append(w)})
}
async function forfeit(host){if(stopped)return;stopped=true;const p=await applyLoss("spades","forfeit");showResult(host,{title:"Game Forfeited",message:`-${p} coins`,win:false,onContinue:()=>start(host)})}
function validPlay(player,card){
 return legalCards(player).some(c=>c.id===card.id)
}
async function humanPlay(host,i){
 if(locked||current!==0)return;const card=hands[0][i];if(!validPlay(0,card)){sfx("bad");draw(host,"You must follow suit if you have that suit.");return}
 hands[0].splice(i,1);await addPlay(host,0,card)
}
async function addPlay(host,player,card){
 locked=true;if(card.s==="♠")spadesBroken=true;trick.push({player,card});sfx("card");draw(host,`${names[player]} played ${card.r}${card.s}.`);
 await new Promise(r=>setTimeout(r,1100));
 if(trick.length===4){await resolveTrick(host);return}
 current=(player+1)%4;locked=false;if(current===0){draw(host,"Your turn. Follow suit if possible.")}else aiPlay(host,current)
}
function aiPlay(host,p){
 setTimeout(async()=>{if(stopped)return;const legal=legalCards(p),card=legal[Math.floor(Math.random()*legal.length)],idx=hands[p].findIndex(c=>c.id===card.id);hands[p].splice(idx,1);await addPlay(host,p,card)},950)
}
async function resolveTrick(host){
 const lead=trick[0].card.s;let winner=trick[0];
 for(const x of trick.slice(1)){
   if(x.card.s==="♠"&&winner.card.s!=="♠")winner=x;
   else if(x.card.s===winner.card.s&&x.card.v>winner.card.v)winner=x;
   else if(winner.card.s!=="♠"&&x.card.s===lead&&winner.card.s!==lead)winner=x;
 }
 scores[winner.player%2===0?0:1]++;draw(host,`${names[winner.player]} won the trick. Cards remain visible...`);
 await new Promise(r=>setTimeout(r,1800));trick=[];leader=winner.player;current=leader;locked=false;
 if(!hands[0].length){await finish(host);return}
 if(current===0)draw(host,"Your turn to lead.");else aiPlay(host,current)
}
async function finish(host){
 const win=scores[0]>scores[1],level=getLevel("spades");
 if(win){const coins=180+level*20;await reward("spades",coins);advanceLevel("spades");showResult(host,{title:"Cookie Team Wins!",message:`Final tricks ${scores[0]} to ${scores[1]}.`,coins,onContinue:()=>start(host)})}
 else{const p=await applyLoss("spades","loss");showResult(host,{title:"Opponent Team Wins",message:`Final tricks ${scores[0]} to ${scores[1]}. -${p} coins`,win:false,onContinue:()=>start(host)})}
}
export function unmount(){stopped=true}
