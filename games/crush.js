import {reward} from "../js/coins.js";import {sfx} from "../js/audio.js";
const icons=["🍪","🍩","🧁","🍭","🍫","🍬"];let board=[],score=0,moves=20,selected=null;
export function mount(host){board=Array.from({length:64},()=>icons[Math.floor(Math.random()*icons.length)]);score=0;moves=20;draw(host)}
function draw(host){
 host.innerHTML=`<div class="game-shell"><div class="game-hud"><div class="hud-box">Score: <b>${score}</b></div><div class="hud-box">Moves: <b>${moves}</b></div><div class="hud-box">Goal: 700</div></div>
 <div class="action-feed">Tap two neighboring treats to swap. Matches score automatically.</div><div id="crushBoard" class="board-grid" style="grid-template-columns:repeat(8,52px)"></div></div>`;
 const g=host.querySelector("#crushBoard");board.forEach((x,i)=>{const b=document.createElement("button");b.className="cell";b.textContent=x;b.onclick=()=>pick(host,i);g.append(b)})
}
function pick(host,i){if(selected===null){selected=i;return}const near=Math.abs(selected-i)===1||Math.abs(selected-i)===8;if(!near){selected=i;return}
 [board[selected],board[i]]=[board[i],board[selected]];selected=null;moves--;let gain=0;
 for(let r=0;r<8;r++)for(let c=0;c<6;c++){const p=r*8+c;if(board[p]===board[p+1]&&board[p]===board[p+2])gain+=50}
 score+=gain||10;sfx(gain?"win":"card");if(score>=700){reward("crush",220);mount(host)}else if(moves<=0)mount(host);else draw(host)}
export function unmount(){}
