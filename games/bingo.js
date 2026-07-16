import {reward} from "../js/coins.js";import {sfx,bingoCallVoice,clearVoiceQueue} from "../js/audio.js";import {showResult} from "./result.js";
import {getLevel,advanceLevel,applyLoss,lossPenalty,controls,bindControls} from "./economy.js";
let cards=[],marks=[],called=new Set(),history=[],timer=null,seconds=4,running=false,matchedPoints=0,stopped=false,voiceOn=true;
function make(){const ranges=[[1,15],[16,30],[31,45],[46,60],[61,75]];return ranges.map(([a,b])=>{const x=[];while(x.length<5){const n=a+Math.floor(Math.random()*(b-a+1));if(!x.includes(n))x.push(n)}return x})}
function cardCount(){const l=getLevel("bingo");return l>=3?6:l>=2?4:2}
export function mount(host){start(host)}
function start(host){const n=cardCount();cards=Array.from({length:n},make);marks=Array.from({length:n},()=>new Set(["2-2"]));called=new Set();history=[];running=false;matchedPoints=0;seconds=4;stopped=false;clearInterval(timer);draw(host)}
function draw(host){
 const level=getLevel("bingo"),n=cards.length,cls=n>=6?"level-3":n>=4?"level-2":"";
 host.innerHTML=`<div class="game-shell"><details class="rules-box"><summary>BINGO RULES</summary><p>The caller announces one number every four seconds. Players must manually mark matching numbers. Pressing BINGO without a completed row, column, or diagonal costs the current level penalty.</p></details>${controls("bingo",{})}
 <div class="game-hud"><div class="hud-box">Next Call: <b>${seconds}</b>s</div><div class="hud-box">Matched Points: <b>${matchedPoints}</b></div><div class="hud-box">Cards: <b>${n}</b></div><div class="hud-box">Level: <b>${level}</b></div><div class="hud-box">False Bingo: <b>-${lossPenalty("bingo")}</b></div></div>
 <div class="caller-panel"><div class="caller-status">${running?"CALLER ACTIVE":"CALLER READY"}</div><div class="called-number">${history.length?history.at(-1):"--"}</div><button id="voiceToggle" class="voice-toggle">${voiceOn?"🔊 CALLER ON":"🔇 CALLER OFF"}</button></div><div class="bingo-ball-row">${history.slice(-15).map(x=>`<div class="bingo-ball">${x}</div>`).join("")}</div><div id="bStatus" class="action-feed">${running?"Caller running — find and mark your own matches.":"Press Start Showdown."}</div>
 <div class="bingo-card-levels ${cls}">${cards.map((_,ci)=>`<div><h3>CARD ${ci+1}</h3><div class="bingo-grid">${"BINGO".split("").map(x=>`<div class="bingo-cell">${x}</div>`).join("")}${cells(ci)}</div></div>`).join("")}</div>
 <div class="button-row"><button id="bStart" class="primary">${running?"PAUSE":"START CALLER"}</button><button id="bClaim" class="secondary">BINGO!</button></div></div>`;
 bindControls(host,{onNew:()=>start(host),onStop:()=>forfeit(host)});
 host.querySelectorAll("[data-bcell]").forEach(e=>e.onclick=()=>mark(host,+e.dataset.card,+e.dataset.r,+e.dataset.c));
 host.querySelector("#bStart").onclick=()=>toggle(host);host.querySelector("#bClaim").onclick=()=>claim(host);host.querySelector("#voiceToggle").onclick=()=>{voiceOn=!voiceOn;if(!voiceOn)clearVoiceQueue();draw(host)}
}
function cells(ci){let s="";for(let r=0;r<5;r++)for(let c=0;c<5;c++){const k=`${r}-${c}`,n=cards[ci][c][r],free=r===2&&c===2;s+=`<button data-bcell data-card="${ci}" data-r="${r}" data-c="${c}" class="bingo-cell ${called.has(n)?"called":""} ${marks[ci].has(k)?"marked":""}">${free?"FREE":n}</button>`}return s}
function mark(host,ci,r,c){if(r===2&&c===2)return;const n=cards[ci][c][r],k=`${r}-${c}`;if(!called.has(n)){sfx("bad");return}if(!marks[ci].has(k)){marks[ci].add(k);matchedPoints+=5;sfx("coin")}draw(host)}
function toggle(host){running=!running;clearInterval(timer);if(running){call(host);timer=setInterval(()=>{seconds--;if(seconds<=0){call(host);seconds=4}else draw(host)},1000)}draw(host)}
function call(host){if(called.size>=75){clearInterval(timer);running=false;draw(host);return}let n;do{n=1+Math.floor(Math.random()*75)}while(called.has(n));called.add(n);history.push(n);seconds=4;sfx("slot");if(voiceOn)bingoCallVoice(n);draw(host)}
function line(ci){const m=marks[ci];for(let r=0;r<5;r++)if([0,1,2,3,4].every(c=>m.has(`${r}-${c}`)))return true;for(let c=0;c<5;c++)if([0,1,2,3,4].every(r=>m.has(`${r}-${c}`)))return true;if([0,1,2,3,4].every(i=>m.has(`${i}-${i}`)))return true;if([0,1,2,3,4].every(i=>m.has(`${i}-${4-i}`)))return true;return false}
async function claim(host){
 const win=cards.some((_,i)=>line(i));if(win){clearInterval(timer);running=false;const level=getLevel("bingo"),coins=180+level*20;await reward("bingo",coins);advanceLevel("bingo");showResult(host,{title:"BINGO!",message:"You completed a winning line!",coins,onContinue:()=>start(host)})}
 else{const p=await applyLoss("bingo","false_bingo");sfx("bad");showResult(host,{title:"False Bingo",message:`-${p} coins`,win:false,onContinue:()=>draw(host)})}
}
async function forfeit(host){clearInterval(timer);const p=await applyLoss("bingo","forfeit");showResult(host,{title:"Game Forfeited",message:`-${p} coins`,win:false,onContinue:()=>start(host)})}
export function unmount(){clearInterval(timer);clearVoiceQueue();stopped=true}
