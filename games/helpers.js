export const ranks=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
export const suits=["♠","♥","♦","♣"];
export function freshDeck(){
  const d=[];for(const s of suits)for(let i=0;i<ranks.length;i++)d.push({s,r:ranks[i],v:i+2,id:`${ranks[i]}${s}`});
  return shuffle(d)
}
export const deck=freshDeck;
export function cardHTML(c){return `<div class="play-card ${c.s==="♥"||c.s==="♦"?"red":""}"><span>${c.r}</span><span>${c.s}</span></div>`}
export function shuffle(a){
  const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x
}
