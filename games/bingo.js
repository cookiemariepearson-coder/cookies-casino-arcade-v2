import {reward} from "../js/coins.js";import {sfx} from "../js/audio.js";
let cards=[],marks=[new Set(["2-2"]),new Set(["2-2"])],called=new Set(),timer=null,seconds=4,running=false;
function make(){const ranges=[[1,15],[16,30],[31,45],[46,60],[61,75]];return ranges.map(([a,b])=>{const x=[];while(x.length<5){const n=a+Math.floor(Math.random()*(b-a+1));if(!x.includes(n))x.push(n)}return x})}
export function mount(host){cards=[make(),make()];marks=[new Set(["2-2"]),new Set(["2-2"])];called=new Set();running=false;clearInterval(timer);draw(host)}
function draw(host){
 host.innerHTML=`<div class="game-shell"><div class="game-hud"><div class="hud-box">Next Call: <b id="bSec">${seconds}</b>s</div><div class="hud-box">Called: <b>${called.size}</b></div><div class="hud-box">Prize: <b>350</b></div></div>
 <div id="bStatus" class="action-feed">Press Start. Numbers call every four seconds. Mark tiles yourself.</div><div class="bingo-grid-wrap" style="display:grid;grid-template-columns:repeat(2,minmax(280px,1fr));gap:16px">
 ${[0,1].map(ci=>`<div><h3>COOKIE CARD ${ci+1}</h3><div class="bingo-grid">${"BINGO".split("").map(x=>`<div class="bingo-cell">${x}</div>`).join("")}${cells(ci)}</div></div>`).join("")}</div>
 <div class="button-row"><button id="bStart" class="primary">${running?"PAUSE":"START SHOWDOWN"}</button><button id="bClaim" class="secondary">BINGO!</button></div></div>`;
 host.querySelectorAll("[data-bcell]").forEach(e=>e.onclick=()=>mark(host,+e.dataset.card,+e.dataset.r,+e.dataset.c));
 host.querySelector("#bStart").onclick=()=>toggle(host);host.querySelector("#bClaim").onclick=()=>claim(host)
}
function cells(ci){let s="";for(let r=0;r<5;r++)for(let c=0;c<5;c++){const key=`${r}-${c}`,n=cards[ci][c][r],free=r===2&&c===2;
 s+=`<button data-bcell data-card="${ci}" data-r="${r}" data-c="${c}" class="bingo-cell ${called.has(n)?"called":""} ${marks[ci].has(key)?"marked":""}">${free?"FREE":n}</button>`}return s}
function mark(host,ci,r,c){if(r===2&&c===2)return;const n=cards[ci][c][r],k=`${r}-${c}`;if(!called.has(n)){sfx("bad");return}marks[ci].has(k)?marks[ci].delete(k):marks[ci].add(k);draw(host)}
function toggle(host){running=!running;clearInterval(timer);if(running){call(host);timer=setInterval(()=>call(host),4000)}draw(host)}
function call(host){let n;do{n=1+Math.floor(Math.random()*75)}while(called.has(n));called.add(n);seconds=4;sfx("coin");draw(host)}
function line(ci){const m=marks[ci];for(let r=0;r<5;r++)if([0,1,2,3,4].every(c=>m.has(`${r}-${c}`)))return true;for(let c=0;c<5;c++)if([0,1,2,3,4].every(r=>m.has(`${r}-${c}`)))return true;return false}
function claim(host){if(line(0)||line(1)){clearInterval(timer);running=false;sfx("win");reward("bingo",350);mount(host)}else{sfx("bad");host.querySelector("#bStatus").textContent="No complete line yet."}}
export function unmount(){clearInterval(timer)}
