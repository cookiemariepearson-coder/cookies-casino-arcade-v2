import {reward} from "../js/coins.js";import {sfx} from "../js/audio.js";import {showResult} from "./result.js";
import {getLevel,advanceLevel,applyLoss,lossPenalty,controls,bindControls} from "./economy.js";
const sets={Easy:["COOKIE","BINGO","CARDS","COINS"],Medium:["CASINO","ARCADE","SPADES","DOMINO"],Hard:["JACKPOT","TREASURE","SOLITAIRE","CHALLENGE"]};
let word="",difficulty="Easy",time=25,timer=null,stopped=false;
export function mount(host){start(host)}
function start(host){const level=getLevel("word");difficulty=level<3?"Easy":level<6?"Medium":"Hard";const arr=sets[difficulty];word=arr[Math.floor(Math.random()*arr.length)];time=difficulty==="Easy"?25:difficulty==="Medium"?20:15;stopped=false;clearInterval(timer);draw(host);timer=setInterval(()=>tick(host),1000)}
function draw(host){const level=getLevel("word"),mixed=word.split("").sort(()=>Math.random()-.5).join("");host.innerHTML=`<div class="game-shell"><details class="rules-box"><summary>WORD TREASURE RULES</summary><p>Unscramble the word before time expires. Wrong answers and timeouts cost the current level penalty.</p></details>${controls("word",{})}
 <div class="word-meta"><div class="hud-box">Level: <b>${level}</b></div><div class="hud-box">Difficulty: <b>${difficulty}</b></div><div class="hud-box">Time: <b id="wordTime">${time}</b>s</div><div class="hud-box">Miss Penalty: <b>-${lossPenalty("word")}</b></div></div>
 <div class="timer-bar"><div id="wordTimerFill" class="timer-fill" style="width:${time/(difficulty==="Easy"?25:difficulty==="Medium"?20:15)*100}%"></div></div><div class="word-scramble">${mixed}</div><input id="wordInput" style="width:100%;padding:14px;border-radius:12px;font-size:22px">
 <div class="button-row"><button id="wordCheck" class="primary">CHECK</button><button id="wordHint" class="secondary">HINT</button></div><div id="wordMsg" class="action-feed"></div></div>`;
 bindControls(host,{onNew:()=>start(host),onStop:()=>forfeit(host)});
 host.querySelector("#wordCheck").onclick=()=>check(host);host.querySelector("#wordHint").onclick=()=>host.querySelector("#wordMsg").textContent=`Starts with ${word[0]} and has ${word.length} letters.`
}
function tick(host){time--;const t=host.querySelector("#wordTime"),f=host.querySelector("#wordTimerFill");if(t)t.textContent=time;if(f)f.style.width=Math.max(0,time/(difficulty==="Easy"?25:difficulty==="Medium"?20:15)*100)+"%";sfx("tick");if(time<=0)timeout(host)}
async function timeout(host){clearInterval(timer);const p=await applyLoss("word","timeout");showResult(host,{title:"Time's Up",message:`The word was ${word}. -${p} coins`,win:false,onContinue:()=>start(host)})}
async function check(host){
 if(host.querySelector("#wordInput").value.trim().toUpperCase()===word){clearInterval(timer);const level=getLevel("word"),coins=50+level*15;await reward("word",coins);advanceLevel("word");showResult(host,{title:"Word Solved!",message:`${word} was correct.`,coins,onContinue:()=>start(host)})}
 else{clearInterval(timer);const p=await applyLoss("word","wrong_answer");showResult(host,{title:"Wrong Word",message:`The word was ${word}. -${p} coins`,win:false,onContinue:()=>start(host)})}
}
async function forfeit(host){clearInterval(timer);const p=await applyLoss("word","forfeit");showResult(host,{title:"Game Forfeited",message:`-${p} coins`,win:false,onContinue:()=>start(host)})}
export function unmount(){clearInterval(timer);stopped=true}
