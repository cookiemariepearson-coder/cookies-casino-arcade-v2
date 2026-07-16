import {sfx} from "../js/audio.js";import {showResult} from "./result.js";import {reward} from "../js/coins.js";
import {getLevel,advanceLevel,applyLoss,lossPenalty,controls,bindControls} from "./economy.js";
let board=[],selected=null,turn="white",moves=0,legal=[],stopped=false;
function initial(){return ["♜","♞","♝","♛","♚","♝","♞","♜",...Array(8).fill("♟"),...Array(32).fill(""),...Array(8).fill("♙"),"♖","♘","♗","♕","♔","♗","♘","♖"]}
const white="♙♖♘♗♕♔",black="♟♜♞♝♛♚";
export function mount(host){start(host)}
function start(host){board=initial();selected=null;turn="white";moves=0;legal=[];stopped=false;draw(host,"Cookie is White. Choose a white piece.")}
function isWhite(p){return white.includes(p)}function isBlack(p){return black.includes(p)}
function rc(i){return[Math.floor(i/8),i%8]}function idx(r,c){return r*8+c}
function legalMoves(i){
 const p=board[i],[r,c]=rc(i),out=[];const add=(rr,cc)=>{if(rr>=0&&rr<8&&cc>=0&&cc<8&&!isWhite(board[idx(rr,cc)]))out.push(idx(rr,cc))}
 if(p==="♙"){if(r>0&&!board[idx(r-1,c)])add(r-1,c);if(r===6&&!board[idx(r-1,c)]&&!board[idx(r-2,c)])add(r-2,c);for(const dc of [-1,1])if(r>0&&c+dc>=0&&c+dc<8&&isBlack(board[idx(r-1,c+dc)]))add(r-1,c+dc)}
 else if(p==="♘"){for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]])add(r+dr,c+dc)}
 else if(p==="♔"){for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)if(dr||dc)add(r+dr,c+dc)}
 else{const dirs=p==="♖"?[[1,0],[-1,0],[0,1],[0,-1]]:p==="♗"?[[1,1],[1,-1],[-1,1],[-1,-1]]:[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  for(const [dr,dc] of dirs){let rr=r+dr,cc=c+dc;while(rr>=0&&rr<8&&cc>=0&&cc<8){if(isWhite(board[idx(rr,cc)]))break;out.push(idx(rr,cc));if(isBlack(board[idx(rr,cc)]))break;rr+=dr;cc+=dc}}
 }
 return out
}
function draw(host,msg){
 const level=getLevel("chess");
 host.innerHTML=`<div class="game-shell"><details class="rules-box"><summary>QUICK CHESS RULES</summary><p>Pieces follow standard chess movement. Cookie controls White. Complete the quick challenge before forfeiting.</p></details>${controls("chess",{})}
 <div class="game-hud"><div class="hud-box">Level: <b>${level}</b></div><div class="hud-box">Moves: <b>${moves}/10</b></div><div class="hud-box">Loss: <b>-${lossPenalty("chess")}</b></div></div><div class="turn-banner ${turn==="black"?"bot":""}">${msg}</div><div id="chessBoard" class="chess-board"></div></div>`;
 bindControls(host,{onNew:()=>start(host),onStop:()=>forfeit(host)});
 const b=host.querySelector("#chessBoard");board.forEach((p,i)=>{const e=document.createElement("button");e.className="chess-square "+(selected===i?"selected ":"")+(legal.includes(i)?"legal":"");e.textContent=p;e.onclick=()=>move(host,i);b.append(e)})
}
function move(host,i){
 if(turn!=="white")return;if(selected===null){if(isWhite(board[i])){selected=i;legal=legalMoves(i);draw(host,"Choose a highlighted legal destination.")}return}
 if(isWhite(board[i])){selected=i;legal=legalMoves(i);draw(host,"Choose a highlighted legal destination.");return}
 if(!legal.includes(i)){sfx("bad");draw(host,"That piece cannot move there.");return}
 board[i]=board[selected];board[selected]="";selected=null;legal=[];moves++;sfx("card");turn="black";draw(host,"Opponent is thinking…");setTimeout(()=>botMove(host),1300)
}
async function botMove(host){
 const candidates=[];board.forEach((p,i)=>{if(isBlack(p)){const [r,c]=rc(i);for(const d of [-8,8,-1,1]){const t=i+d;if(t>=0&&t<64&&!isBlack(board[t]))candidates.push([i,t])}}});
 if(candidates.length){const [f,t]=candidates[Math.floor(Math.random()*candidates.length)];board[t]=board[f];board[f]=""}
 turn="white";if(moves>=10){const level=getLevel("chess"),coins=140+level*15;await reward("chess",coins);advanceLevel("chess");showResult(host,{title:"Quick Chess Win!",message:"Challenge completed.",coins,onContinue:()=>start(host)});return}draw(host,"Your turn. Choose a white piece.")
}
async function forfeit(host){const p=await applyLoss("chess","forfeit");showResult(host,{title:"Game Forfeited",message:`-${p} coins`,win:false,onContinue:()=>start(host)})}
export function unmount(){turn="off";stopped=true}
