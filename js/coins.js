import {state,GAME_DEFS} from "./state.js";import {secureFetch} from "./api.js";import {sfx} from "./audio.js";
export function renderBalance(){document.getElementById("coinBalance").textContent=Number(state.coins||0).toLocaleString()}
export async function chargeEntry(gameId){
 const def=GAME_DEFS.find(g=>g.id===gameId);const requestId=`entry_${gameId}_${crypto.randomUUID()}`;
 const data=await secureFetch("/api/wallet-transaction",{method:"POST",body:JSON.stringify({action:"game_entry",gameKey:gameId,requestId})});
 state.coins=Number(data.wallet.coins);renderBalance();sfx("coin");return def
}
export async function reward(gameId,coins){
 const requestId=`reward_${gameId}_${crypto.randomUUID()}`;
 const data=await secureFetch("/api/wallet-transaction",{method:"POST",body:JSON.stringify({action:"game_reward",gameKey:gameId,coins,requestId})});
 state.coins=Number(data.wallet.coins);renderBalance();sfx("win")
}
