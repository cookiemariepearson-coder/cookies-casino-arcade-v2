import {state,GAME_DEFS} from './state.js';import {secureFetch} from './api.js';import {sfx} from './audio.js';
export function renderBalance(){document.getElementById('coinBalance').textContent=Number(state.coins||0).toLocaleString()}
function animate(amount){const b=document.getElementById('storeBtn'),r=b.getBoundingClientRect(),f=document.createElement('div');f.className='coin-burst';f.textContent=(amount>0?'+':'')+amount.toLocaleString()+' COINS';f.style.left=r.left+'px';f.style.top=r.bottom+8+'px';document.body.append(f);setTimeout(()=>f.remove(),1500)}
export async function chargeEntry(gameId){const d=GAME_DEFS.find(g=>g.id===gameId),requestId=`entry_${gameId}_${crypto.randomUUID()}`,x=await secureFetch('/api/wallet-transaction',{method:'POST',body:JSON.stringify({action:'game_entry',gameKey:gameId,requestId})});state.coins=Number(x.wallet.coins);renderBalance();animate(-d.cost);sfx('coin');return d}
export async function reward(gameId,coins){const requestId=`reward_${gameId}_${crypto.randomUUID()}`,x=await secureFetch('/api/wallet-transaction',{method:'POST',body:JSON.stringify({action:'game_reward',gameKey:gameId,coins,requestId})});state.coins=Number(x.wallet.coins);renderBalance();animate(coins);sfx('win')}


export async function deductLoss(gameId,coins,reason="game_loss"){
  const requestId=`loss_${gameId}_${crypto.randomUUID()}`;
  const data=await secureFetch("/api/wallet-transaction",{
    method:"POST",
    body:JSON.stringify({action:"game_loss",gameKey:gameId,coins,reason,requestId})
  });
  const before=state.coins;
  state.coins=Number(data.wallet.coins);
  renderBalance();
  animateCoins(-(before-state.coins));
  sfx("bad");
  return before-state.coins;
}
