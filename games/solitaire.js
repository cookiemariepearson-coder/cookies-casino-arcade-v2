import {deck,cardHTML} from "./helpers.js";import {sfx} from "../js/audio.js";
let stock=[],waste=[],found=0;
export function mount(host){stock=deck();waste=[];found=0;draw(host)}
function draw(host){
 host.innerHTML=`<div class="game-shell"><div class="game-hud"><div class="hud-box">Foundation: <b>${found}/52</b></div><div class="hud-box">Stock: <b>${stock.length}</b></div></div>
 <div class="action-feed">Click Draw. Aces and ascending same-suit cards move automatically.</div><div class="card-row">
 <button id="drawStock" class="play-card">${stock.length?"🂠":"↻"}</button><div>${waste.length?cardHTML(waste.at(-1)):'<div class="play-card">WASTE</div>'}</div></div>
 <div class="button-row"><button id="autoMove" class="primary">MOVE CARD</button><button id="hintSol" class="secondary">HINT</button></div><div id="solMsg" class="action-feed"></div></div>`;
 host.querySelector("#drawStock").onclick=()=>{if(!stock.length){stock=waste.reverse();waste=[]}else waste.push(stock.pop());sfx("card");draw(host)};
 host.querySelector("#autoMove").onclick=()=>{if(!waste.length)return;const c=waste.at(-1);if(c.v<=found%13+2){waste.pop();found++;sfx("win")}else host.querySelector("#solMsg").textContent="That card cannot move yet.";draw(host)};
 host.querySelector("#hintSol").onclick=()=>host.querySelector("#solMsg").textContent=waste.length?`Try moving ${waste.at(-1).r}${waste.at(-1).s}, or draw again.`:"Draw a card."
}
export function unmount(){}
