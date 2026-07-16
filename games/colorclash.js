import {sfx} from "../js/audio.js";import {reward} from "../js/coins.js";
const colors=["#e93d4c","#287cff","#39b95a","#f0c52c"];let hand=[],top=null,bot=7;
function card(){return {color:colors[Math.floor(Math.random()*4)],n:Math.floor(Math.random()*10)}}
export function mount(host){hand=Array.from({length:7},card);top=card();bot=7;draw(host,"Your turn. Match color or number.")}
function draw(host,msg){
 host.innerHTML=`<div class="game-shell"><div class="game-hud"><div class="hud-box">Opponent Cards: <b>${bot}</b></div><div class="hud-box">Your Cards: <b>${hand.length}</b></div></div><div class="action-feed">${msg}</div>
 <div class="card-row"><div class="play-card" style="background:${top.color};color:white">${top.n}</div></div><h3>Your Hand</h3><div id="clashHand" class="card-row"></div><button id="clashDraw" class="secondary">DRAW CARD</button></div>`;
 const r=host.querySelector("#clashHand");hand.forEach((c,i)=>{const b=document.createElement("button");b.className="play-card selectable";b.style.background=c.color;b.style.color="white";b.textContent=c.n;b.onclick=()=>play(host,i);r.append(b)});
 host.querySelector("#clashDraw").onclick=()=>{hand.push(card());botTurn(host)}
}
function play(host,i){const c=hand[i];if(c.color!==top.color&&c.n!==top.n){draw(host,"That card does not match.");sfx("bad");return}top=c;hand.splice(i,1);sfx("card");if(!hand.length){reward("colorclash",250);mount(host);return}botTurn(host)}
function botTurn(host){draw(host,"Opponent is playing…");setTimeout(()=>{bot=Math.max(0,bot-1);top=card();if(bot===0){bot=7;hand.push(card(),card())}draw(host,"Your turn. Match the new card.")},1600)}
export function unmount(){}
