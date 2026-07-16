export const ranks=["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
export const suits=["♠","♥","♦","♣"];
export function deck(){return suits.flatMap(s=>ranks.map((r,i)=>({s,r,v:i+2}))).sort(()=>Math.random()-.5)}
export function cardHTML(c){return `<div class="play-card ${c.s==="♥"||c.s==="♦"?"red":""}"><span>${c.r}</span><span>${c.s}</span></div>`}
export function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
