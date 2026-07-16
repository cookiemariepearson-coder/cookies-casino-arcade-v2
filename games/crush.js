import {reward} from "../js/coins.js";import {sfx} from "../js/audio.js";import {showResult} from "./result.js";
import {getLevel,advanceLevel,applyLoss,lossPenalty,controls,bindControls} from "./economy.js";
const icons=["🍪","🍩","🧁","🍭","🍫","🍬"];let board=[],score=0,moves=24,selected=null,locked=false,stopped=false;
export function mount(host){start(host)}
function start(host){board=Array.from({length:64},()=>icons[Math.floor(Math.random()*icons.length)]);score=0;moves=24;selected=null;locked=false;stopped=false;stabilize();draw(host)}
function stabilize(){for(let loops=0;loops<10;loops++){for(let r=0;r<8;r++)for(let c=0;c<6;c++){const p=r*8+c;if(board[p]===board[p+1]&&board[p]===board[p+2])board[p+2]=icons[(icons.indexOf(board[p+2])+1)%icons.length]}}}
function matches(){
 const set=new Set();for(let r=0;r<8;r++)for(let c=0;c<6;c++){const p=r*8+c;if(board[p]===board[p+1]&&board[p]===board[p+2])[p,p+1,p+2].forEach(x=>set.add(x))}
 for(let c=0;c<8;c++)for(let r=0;r<6;r++){const p=r*8+c;if(board[p]===board[p+8]&&board[p]===board[p+16])[p,p+8,p+16].forEach(x=>set.add(x))}
 return [...set]
}
function collapse(ms){ms.forEach(i=>board[i]=null);for(let c=0;c<8;c++){const vals=[];for(let r=7;r>=0;r--){const v=board[r*8+c];if(v)vals.push(v)}for(let r=7;r>=0;r--)board[r*8+c]=vals[7-r]||icons[Math.floor(Math.random()*icons.length)]}}
function draw(host){
 const level=getLevel("crush"),goal=900+(level-1)*200;
 host.innerHTML=`<div class="game-shell"><details class="rules-box"><summary>COOKIE CRUSH RULES</summary><p>Swap neighboring treats to form rows or columns of three or more. Matching pieces disappear and new treats fall into place.</p></details>${controls("crush",{})}
 <div class="game-hud"><div class="hud-box">Score: <b>${score}</b></div><div class="hud-box">Moves: <b>${moves}</b></div><div class="hud-box">Goal: <b>${goal}</b></div><div class="hud-box">Level: <b>${level}</b></div><div class="hud-box">Loss: <b>-${lossPenalty("crush")}</b></div></div><div class="action-feed">Tap two neighboring treats to swap.</div><div id="crushBoard" class="crush-board"></div></div>`;
 bindControls(host,{onNew:()=>start(host),onStop:()=>forfeit(host)});
 const g=host.querySelector("#crushBoard");board.forEach((x,i)=>{const b=document.createElement("button");b.className="crush-tile cell";b.textContent=x;b.disabled=locked;b.onclick=()=>pick(host,i);g.append(b)})
}
async function forfeit(host){const p=await applyLoss("crush","forfeit");showResult(host,{title:"Game Forfeited",message:`-${p} coins`,win:false,onContinue:()=>start(host)})}
async function pick(host,i){
 if(locked)return;if(selected===null){selected=i;return}
 const near=(Math.abs(selected-i)===1&&Math.floor(selected/8)===Math.floor(i/8))||Math.abs(selected-i)===8;if(!near){selected=i;return}
 locked=true;const first=selected;[board[first],board[i]]=[board[i],board[first]];const ms=matches();selected=null;moves--;
 if(!ms.length){[board[first],board[i]]=[board[i],board[first]];score+=0;sfx("bad")}else{score+=ms.length*60;collapse(ms);sfx("jackpot")}
 draw(host);setTimeout(async()=>{locked=false;const level=getLevel("crush"),goal=900+(level-1)*200;
 if(score>=goal){const coins=160+level*20;await reward("crush",coins);advanceLevel("crush");showResult(host,{title:"Cookie Crush Win!",message:"Sweet board cleared!",coins,onContinue:()=>start(host)})}
 else if(moves<=0){const p=await applyLoss("crush","out_of_moves");showResult(host,{title:"Out of Moves",message:`-${p} coins`,win:false,onContinue:()=>start(host)})}else draw(host)},700)
}
export function unmount(){locked=true;stopped=true}
