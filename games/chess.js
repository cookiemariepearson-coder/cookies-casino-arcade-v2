import {sfx} from "../js/audio.js";
const pieces=["♜","♞","♝","♛","♚","♝","♞","♜",...Array(8).fill("♟"),...Array(32).fill(""),...Array(8).fill("♙"),"♖","♘","♗","♕","♔","♗","♘","♖"];let selected=null;
export function mount(host){selected=null;draw(host)}
function draw(host){host.innerHTML=`<div class="game-shell"><div class="action-feed">Cookie is White. Click a piece, then click a destination. This V2 foundation uses quick free movement.</div><div id="chessBoard" class="chess-board"></div></div>`;
 const b=host.querySelector("#chessBoard");pieces.forEach((p,i)=>{const e=document.createElement("button");e.className="chess-square";e.textContent=p;e.onclick=()=>move(host,i);b.append(e)})
}
function move(host,i){if(selected===null){if(pieces[i])selected=i;return}pieces[i]=pieces[selected];pieces[selected]="";selected=null;sfx("card");draw(host)}
export function unmount(){}
