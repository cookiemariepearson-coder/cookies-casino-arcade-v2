import {sfx} from "../js/audio.js";import {reward} from "../js/coins.js";
let hand=[],bot=[],chain=[],busy=false;
function set(){const d=[];for(let a=0;a<=6;a++)for(let b=a;b<=6;b++)d.push([a,b]);return d.sort(()=>Math.random()-.5)}
export function mount(host){const d=set();hand=d.splice(0,7);bot=d.splice(0,7);chain=[d.pop()];busy=false;draw(host,"YOUR TURN — match either open number.")}
function draw(host,msg){host.innerHTML=`<div class="game-shell"><div class="game-hud"><div class="hud-box">Your Tiles: <b>${hand.length}</b></div><div class="hud-box">Bot Tiles: <b>${bot.length}</b></div></div><div class="action-feed">${msg}</div>
 <h3>Board</h3><div class="domino-row">${chain.map(x=>`<div class="domino-tile">${x[0]} | ${x[1]}</div>`).join("")}</div><h3>Your Hand</h3><div id="domHand" class="domino-row"></div></div>`;
 const r=host.querySelector("#domHand");hand.forEach((x,i)=>{const b=document.createElement("button");b.className="domino-tile";b.textContent=`${x[0]} | ${x[1]}`;b.onclick=()=>play(host,i);r.append(b)})
}
function fit(x){const l=chain[0][0],r=chain.at(-1)[1];if(x[1]===l)return["left",x];if(x[0]===l)return["left",[x[1],x[0]]];if(x[0]===r)return["right",x];if(x[1]===r)return["right",[x[1],x[0]]]}
function play(host,i){if(busy)return;const f=fit(hand[i]);if(!f){sfx("bad");draw(host,"That tile does not match. Try another.");return}f[0]==="left"?chain.unshift(f[1]):chain.push(f[1]);hand.splice(i,1);sfx("card");if(!hand.length){reward("dominoes",280);mount(host);return}busy=true;draw(host,"BOT IS THINKING…");setTimeout(()=>botPlay(host),2200)}
function botPlay(host){const i=bot.findIndex(x=>fit(x));if(i>=0){const f=fit(bot[i]);f[0]==="left"?chain.unshift(f[1]):chain.push(f[1]);bot.splice(i,1)}busy=false;if(!bot.length){mount(host);return}draw(host,"YOUR TURN — take your time.")}
export function unmount(){}
