import {sfx} from "../js/audio.js";import {reward} from "../js/coins.js";import {showResult} from "./result.js";
import {getLevel,advanceLevel,applyLoss,lossPenalty,controls,bindControls} from "./economy.js";
let hand=[],bot=[],chain=[],pile=[],busy=false,time=18,timer=null,stopped=false;
function set(){const d=[];for(let a=0;a<=6;a++)for(let b=a;b<=6;b++)d.push([a,b]);return d.sort(()=>Math.random()-.5)}
export function mount(host){start(host)}
function start(host){const d=set();hand=d.splice(0,7);bot=d.splice(0,7);chain=[d.pop()];pile=d;busy=false;time=18;stopped=false;clearInterval(timer);draw(host,"YOUR TURN — match either open number.");timer=setInterval(()=>tick(host),1000)}
function backs(){return `<div class="hidden-hand">${bot.map(()=>'<div class="card-back-mini"></div>').join("")}</div>`}
function draw(host,msg){
 const level=getLevel("dominoes");
 host.innerHTML=`<div class="game-shell"><details class="rules-box"><summary>DOMINO HOUSE RULES</summary><p>Match either open end of the chain. If you cannot play, draw from the boneyard until you receive a playable tile or the pile is empty.</p></details>${controls("dominoes",{})}
 <div class="game-hud"><div class="hud-box">Your Tiles: <b>${hand.length}</b></div><div class="hud-box">Bot Tiles: <b>${bot.length}</b></div><div class="hud-box">Draw Pile: <b>${pile.length}</b></div><div class="hud-box">Time: <b id="domTime">${time}</b>s</div><div class="hud-box">Level: <b>${level}</b></div><div class="hud-box">Loss: <b>-${lossPenalty("dominoes")}</b></div></div>
 <div class="timer-bar"><div id="domFill" class="timer-fill" style="width:${time/18*100}%"></div></div><div class="deck-area"><div><div class="deck-stack ${pile.length?"":"empty"}">🁫</div><div class="deck-count">${pile.length} tiles in draw pile</div></div></div><div class="turn-banner ${busy?"bot":""}">${msg}</div><h3>Opponent Hand</h3>${backs()}<h3>Board</h3><div class="domino-row">${chain.map(x=>`<div class="domino-tile">${x[0]} | ${x[1]}</div>`).join("")}</div><h3>Your Hand</h3><div id="domHand" class="domino-row"></div><div class="button-row"><button id="drawDomino" class="secondary">DRAW FROM PILE</button></div></div>`;
 bindControls(host,{onNew:()=>start(host),onStop:()=>forfeit(host)});
 const r=host.querySelector("#domHand");hand.forEach((x,i)=>{const b=document.createElement("button");b.className="domino-tile";b.textContent=`${x[0]} | ${x[1]}`;b.disabled=busy;b.onclick=()=>play(host,i);r.append(b)});
 host.querySelector("#drawDomino").onclick=()=>drawFromPile(host)
}
function tick(host){if(busy)return;time--;const t=host.querySelector("#domTime"),f=host.querySelector("#domFill");if(t)t.textContent=time;if(f)f.style.width=Math.max(0,time/18*100)+"%";if(time<=0)timeout(host)}
function fit(x){const l=chain[0][0],r=chain.at(-1)[1];if(x[1]===l)return["left",x];if(x[0]===l)return["left",[x[1],x[0]]];if(x[0]===r)return["right",x];if(x[1]===r)return["right",[x[1],x[0]]]}
function drawFromPile(host){if(busy)return;if(hand.some(fit)){sfx("bad");draw(host,"You already have a playable tile.");return}if(pile.length){hand.push(pile.pop());sfx("card");time=18;draw(host,"Tile drawn. Play it if possible.")}else draw(host,"The draw pile is empty.")}
function play(host,i){if(busy)return;const f=fit(hand[i]);if(!f){sfx("bad");draw(host,"That tile does not match.");return}f[0]==="left"?chain.unshift(f[1]):chain.push(f[1]);hand.splice(i,1);sfx("card");time=18;if(!hand.length){win(host);return}busy=true;draw(host,"BOT IS THINKING…");setTimeout(()=>botPlay(host),2100)}
function botPlay(host){let i=bot.findIndex(x=>fit(x));while(i<0&&pile.length){bot.push(pile.pop());i=bot.findIndex(x=>fit(x))}if(i>=0){const f=fit(bot[i]);f[0]==="left"?chain.unshift(f[1]):chain.push(f[1]);bot.splice(i,1)}busy=false;time=18;if(!bot.length){lose(host);return}draw(host,"YOUR TURN — take your time.")}
async function win(host){clearInterval(timer);const level=getLevel("dominoes"),coins=150+level*20;await reward("dominoes",coins);advanceLevel("dominoes");showResult(host,{title:"Domino House Win!",message:"You played every tile first.",coins,onContinue:()=>start(host)})}
async function lose(host){clearInterval(timer);const p=await applyLoss("dominoes","loss");showResult(host,{title:"Opponent Wins",message:`-${p} coins`,win:false,onContinue:()=>start(host)})}
async function timeout(host){clearInterval(timer);const p=await applyLoss("dominoes","timeout");showResult(host,{title:"Time's Up",message:`-${p} coins`,win:false,onContinue:()=>start(host)})}
async function forfeit(host){clearInterval(timer);const p=await applyLoss("dominoes","forfeit");showResult(host,{title:"Game Forfeited",message:`-${p} coins`,win:false,onContinue:()=>start(host)})}
export function unmount(){clearInterval(timer);busy=true;stopped=true}
