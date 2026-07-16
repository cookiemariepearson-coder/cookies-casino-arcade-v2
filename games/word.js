import {reward} from "../js/coins.js";import {sfx} from "../js/audio.js";
const words=["COOKIE","CASINO","ARCADE","JACKPOT","SPADES","BINGO","DOMINO","TREASURE"];let word="",round=1;
export function mount(host){word=words[Math.floor(Math.random()*words.length)];draw(host)}
function draw(host){const mixed=word.split("").sort(()=>Math.random()-.5).join("");host.innerHTML=`<div class="game-shell"><div class="game-hud"><div class="hud-box">Level: <b>${round}</b></div></div>
 <div class="action-feed">Unscramble: <b style="font-size:28px;color:#ffd338">${mixed}</b></div><input id="wordInput" style="width:100%;padding:14px;border-radius:12px;font-size:22px"><div class="button-row"><button id="wordCheck" class="primary">CHECK</button><button id="wordHint" class="secondary">HINT</button></div><div id="wordMsg" class="action-feed"></div></div>`;
 host.querySelector("#wordCheck").onclick=()=>{if(host.querySelector("#wordInput").value.trim().toUpperCase()===word){round++;sfx("win");if(round%3===0)reward("word",120);mount(host)}else{sfx("bad");host.querySelector("#wordMsg").textContent="Try again."}};
 host.querySelector("#wordHint").onclick=()=>host.querySelector("#wordMsg").textContent=`Starts with ${word[0]} and has ${word.length} letters.`
}
export function unmount(){}
