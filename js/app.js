import {state,GAME_DEFS} from "./state.js";
import {showView,showEntrance,showApp,showModal,hideModal} from "./router.js";
import {initAuth,setAuthMode,submitAuth,signOut,resetPassword,loadAccount} from "./auth.js";
import {renderBalance,chargeEntry} from "./coins.js";
import {unlockAudio,startMusic,stopMusic,coinStorm,sfx} from "./audio.js";

const modules={};
let pendingDef=null,currentModule=null;

function renderLobby(){
 const grid=document.getElementById("gameGrid");grid.innerHTML="";
 GAME_DEFS.forEach(g=>{const card=document.createElement("article");card.className="game-card";card.innerHTML=`<div><div class="game-icon">${g.icon}</div><h3>${g.title}</h3><p>${g.desc}</p></div><div><div class="game-cost">Entry: ${g.cost} coins</div><button class="primary full">PLAY</button></div>`;
 card.querySelector("button").onclick=()=>openEntry(g);grid.append(card)})
}
async function openEntry(def){
 if(!state.user){setAuthMode("signin");showModal("authModal");return}
 try{await loadAccount()}catch(e){}
 pendingDef=def;document.getElementById("entryGameName").textContent=def.title;document.getElementById("entryWallet").textContent=state.coins.toLocaleString();
 document.getElementById("entryFee").textContent=def.cost+" Coins";document.getElementById("entryMessage").textContent=state.coins<def.cost?"You need more Cookie Coins.":"Your wallet is ready.";
 document.getElementById("playGameBtn").disabled=state.coins<def.cost;showModal("entryModal")
}
async function playPending(){
 if(!pendingDef)return;
 try{await chargeEntry(pendingDef.id);hideModal("entryModal");await launchGame(pendingDef);pendingDef=null}catch(e){document.getElementById("entryMessage").textContent=e.message}
}
async function launchGame(def){
 if(currentModule?.unmount)currentModule.unmount();
 const module=await import(`/games/${def.id}.js`);modules[def.id]=module;currentModule=module;state.currentGame=def.id;
 document.getElementById("gameTitle").textContent=def.title;showView("gameView");module.mount(document.getElementById("gameHost"))
}
function showStore(){
 showView("storeView");const packs=[["Starter",500,"$1.99"],["Player",1200,"$3.99"],["High Roller",3000,"$7.99"],["VIP Vault",7500,"$14.99"]];
 document.getElementById("coinPacks").innerHTML=packs.map(([n,c,p])=>`<div class="coin-pack"><h3>${n}</h3><strong>${c.toLocaleString()}</strong><p>Cookie Coins</p><button class="primary" data-pack="${n.toLowerCase().replaceAll(" ","_")}">${p}</button></div>`).join("");
 document.querySelectorAll("[data-pack]").forEach(b=>b.onclick=()=>alert("Stripe checkout will connect in V2 Build 2."))
}
function showAccount(){
 showView("accountView");document.getElementById("accountDetails").innerHTML=`<p><b>Player:</b> ${state.profile?.display_name||state.user?.email||"Cookie Player"}</p><p><b>Email:</b> ${state.user?.email||""}</p><p><b>Cookie Coins:</b> ${state.coins.toLocaleString()}</p><p><b>Recent transactions:</b> ${state.transactions.length}</p>`
}
async function enterArcade(){
 if(!state.user){setAuthMode("signin");showModal("authModal");return}
 await unlockAudio().catch(()=>{});showApp();startMusic();coinStorm();
 try{await loadAccount()}catch(e){console.error(e)}renderBalance();document.getElementById("welcomeBalance").textContent=state.coins.toLocaleString();showModal("welcomeCoinsModal")
}
function bind(){
 document.getElementById("enterBtn").onclick=enterArcade;
 document.getElementById("signInBtn").onclick=()=>{setAuthMode("signin");showModal("authModal")};
 document.getElementById("createBtn").onclick=()=>{setAuthMode("create");showModal("authModal")};
 document.getElementById("authSignInTab").onclick=()=>setAuthMode("signin");document.getElementById("authCreateTab").onclick=()=>setAuthMode("create");
 document.getElementById("authSubmit").onclick=async()=>{try{await submitAuth();hideModal("authModal");document.getElementById("entranceStatus").textContent="Account ready — press ENTER."}catch(e){document.getElementById("authMessage").textContent=e.message}};
 document.getElementById("resetPasswordBtn").onclick=async()=>{try{await resetPassword();document.getElementById("authMessage").textContent="Password reset email sent."}catch(e){document.getElementById("authMessage").textContent=e.message}};
 document.querySelectorAll("[data-close-modal]").forEach(b=>b.onclick=()=>hideModal(b.dataset.closeModal));
 document.getElementById("homeBtn").onclick=()=>showView("lobbyView");document.getElementById("backLobbyBtn").onclick=()=>{currentModule?.unmount?.();showView("lobbyView")};
 document.querySelectorAll("[data-back-lobby]").forEach(b=>b.onclick=()=>showView("lobbyView"));
 document.getElementById("storeBtn").onclick=showStore;document.getElementById("accountBtn").onclick=showAccount;
 document.getElementById("signOutBtn").onclick=async()=>{stopMusic();await signOut();showEntrance();document.getElementById("entranceStatus").textContent="Signed out."};
 document.getElementById("playGameBtn").onclick=playPending;document.getElementById("entryStoreBtn").onclick=()=>{hideModal("entryModal");showStore()};
 document.getElementById("welcomeStoreBtn").onclick=()=>{hideModal("welcomeCoinsModal");showStore()};
 document.getElementById("soundBtn").onclick=()=>{state.sound=!state.sound;document.getElementById("soundBtn").textContent=state.sound?"🔊 SOUND":"🔇 MUTED";state.sound?startMusic():stopMusic()}
}
async function start(){
 bind();renderLobby();setAuthMode("signin");
 try{const signed=await initAuth();document.getElementById("entranceStatus").textContent=signed?"Account ready — press ENTER.":"Sign in or create an account."}catch(e){document.getElementById("entranceStatus").textContent=e.message}
}
start();
