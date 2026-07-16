import {deductLoss} from "../js/coins.js";
export function getLevel(game){
  return Math.max(1,Number(localStorage.getItem(`cookie_level_${game}`)||1))
}
export function setLevel(game,level){
  localStorage.setItem(`cookie_level_${game}`,String(Math.max(1,level)))
}
export function advanceLevel(game){
  const n=getLevel(game)+1;setLevel(game,n);return n
}
export function lossPenalty(game){
  return Math.min(1000,getLevel(game)*100)
}
export async function applyLoss(game,reason){
  const penalty=lossPenalty(game);
  await deductLoss(game,penalty,reason);
  return penalty
}
export function controls(game,{onNew,onStop}){
  return `<div class="game-control-row">
    <button class="secondary" data-game-new>NEW GAME</button>
    <button class="secondary" data-game-stop>STOP / FORFEIT</button>
    <button class="primary" data-buy-coins>BUY COINS</button>
  </div>`
}
export function bindControls(host,{onNew,onStop}){
  host.querySelector("[data-game-new]")?.addEventListener("click",onNew);
  host.querySelector("[data-game-stop]")?.addEventListener("click",onStop);
  host.querySelector("[data-buy-coins]")?.addEventListener("click",()=>window.dispatchEvent(new CustomEvent("casino:store")));
}
