import {deck,cardHTML} from "./helpers.js";import {reward} from "../js/coins.js";import {sfx} from "../js/audio.js";
let hand=[],scores=[0,0],played=[];
export function mount(host){
 hand=deck().slice(0,13).sort((a,b)=>a.v-b.v);played=[];draw(host,"Choose a card. Four cards complete each trick.")
}
function draw(host,msg){
 host.innerHTML=`<div class="game-shell"><div class="game-hud"><div class="hud-box">Cookie Team: <b>${scores[0]}</b></div><div class="hud-box">Opp Team: <b>${scores[1]}</b></div><div class="hud-box">Goal: 10 tricks</div></div>
 <div class="action-feed">${msg}</div><div class="card-row" id="spadesPlayed">${played.map(cardHTML).join("")}</div><h3>Your Hand</h3><div class="card-row" id="spadesHand"></div></div>`;
 const row=host.querySelector("#spadesHand");hand.forEach((c,i)=>{const w=document.createElement("button");w.innerHTML=cardHTML(c);w.className="selectable";w.onclick=()=>play(host,i);row.append(w)})
}
function play(host,i){
 const mine=hand.splice(i,1)[0],d=deck();played=[mine,d[0],d[1],d[2]];sfx("card");
 const highest=Math.max(...played.map(c=>c.v)),won=mine.v===highest;scores[won?0:1]++;
 draw(host,won?"Cookie Team won that trick!":"Opponent Team won that trick.");
 setTimeout(()=>{played=[];if(!hand.length||scores[0]>=10||scores[1]>=10){if(scores[0]>scores[1])reward("spades",300);scores=[0,0];hand=deck().slice(0,13)}draw(host,"Choose the next card.")},1400)
}
export function unmount(){}
