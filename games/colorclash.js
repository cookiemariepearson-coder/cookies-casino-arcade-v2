import {sfx} from "../js/audio.js";import {reward} from "../js/coins.js";import {showResult} from "./result.js";
import {getLevel,advanceLevel,applyLoss,lossPenalty,controls,bindControls} from "./economy.js";
const colors=["#e93d4c","#287cff","#39b95a","#f0c52c"];let hand=[],top=null,bot=[],busy=false,unoCalled=false,drawStreak=0,stopped=false;
function card(){return {color:colors[Math.floor(Math.random()*4)],n:Math.floor(Math.random()*10)}}
export function mount(host){start(host)}
function start(host){hand=Array.from({length:7},card);bot=Array.from({length:7},card);top=card();busy=false;unoCalled=false;drawStreak=0;stopped=false;draw(host,"Your turn. Match color or number.")}
function backs(n){return `<div class="hidden-hand">${Array.from({length:n},()=>'<div class="card-back-mini"></div>').join("")}</div>`}
function draw(host,msg){
 const level=getLevel("colorclash");
 host.innerHTML=`<div class="game-shell"><details class="rules-box"><summary>COLOR CLASH RULES</summary><p>Match the center card by color or number. If you cannot play, draw one card. On the second consecutive draw without a play, a Draw Storm adds three extra cards. Press LAST CARD before playing down to one card.</p></details>${controls("colorclash",{})}
 <div class="game-hud"><div class="hud-box">Level: <b>${level}</b></div><div class="hud-box">Loss: <b>-${lossPenalty("colorclash")}</b></div></div><div class="turn-banner ${busy?"bot":""}">${msg}</div><div class="color-arena"><div class="opponent-panel ${bot.length===1?"opponent-last":""}"><h3>Opponent</h3>${backs(bot.length)}<p>${bot.length===1?"LAST CARD!":bot.length+" cards"}</p></div>
 <div><div class="deck-area"><div><div class="deck-stack">🂠</div><div class="deck-count">Draw Deck</div></div><div><div class="card-row"><div class="play-card" style="background:${top.color};color:white">${top.n}</div></div><p style="text-align:center">Center Card</p></div></div></div>
 <div class="opponent-panel"><h3>Cookie</h3><p>${hand.length} cards</p><button id="lastCardBtn" class="uno-button">${unoCalled?"CALLED!":"LAST CARD"}</button><button id="drawCard" class="secondary">DRAW CARD</button></div></div><h3>Your Hand</h3><div id="clashHand" class="card-row"></div></div>`;
 bindControls(host,{onNew:()=>start(host),onStop:()=>forfeit(host)});
 const r=host.querySelector("#clashHand");hand.forEach((c,i)=>{const b=document.createElement("button");b.className="play-card selectable";b.style.background=c.color;b.style.color="white";b.textContent=c.n;b.disabled=busy;b.onclick=()=>play(host,i);r.append(b)});
 host.querySelector("#lastCardBtn").onclick=()=>{unoCalled=true;sfx("cheer");draw(host,"Last Card called!")};
 host.querySelector("#drawCard").onclick=()=>pull(host)
}
function pull(host){
 if(busy)return;drawStreak++;hand.push(card());let extra=0;if(drawStreak>=2){hand.push(card(),card(),card());extra=3;drawStreak=0;sfx("bad")}
 busy=true;draw(host,extra?"Draw Storm! Three extra cards were added. Opponent is playing…":"You pulled one card. Opponent is playing…");setTimeout(()=>botTurn(host),1500)
}
async function play(host,i){
 if(busy)return;const c=hand[i];if(c.color!==top.color&&c.n!==top.n){sfx("bad");draw(host,"That card does not match.");return}
 if(hand.length===2&&!unoCalled){hand.push(card(),card());sfx("bad");draw(host,"You forgot LAST CARD. Two penalty cards added.");return}
 top=c;hand.splice(i,1);drawStreak=0;unoCalled=false;sfx("card");
 if(!hand.length){const level=getLevel("colorclash"),coins=180+level*20;await reward("colorclash",coins);advanceLevel("colorclash");showResult(host,{title:"Color Clash Win!",message:"You played every card first.",coins,onContinue:()=>start(host)});return}
 busy=true;draw(host,"Opponent is playing…");setTimeout(()=>botTurn(host),1500)
}
async function botTurn(host){
 const i=bot.findIndex(c=>c.color===top.color||c.n===top.n);if(i>=0){top=bot.splice(i,1)[0];sfx("card")}else bot.push(card());
 if(!bot.length){const p=await applyLoss("colorclash","loss");showResult(host,{title:"Opponent Wins",message:`-${p} coins`,win:false,onContinue:()=>start(host)});return}
 busy=false;draw(host,bot.length===1?"Opponent has one card left! Your turn.":"Your turn.")
}
async function forfeit(host){const p=await applyLoss("colorclash","forfeit");showResult(host,{title:"Game Forfeited",message:`-${p} coins`,win:false,onContinue:()=>start(host)})}
export function unmount(){busy=true;stopped=true}
