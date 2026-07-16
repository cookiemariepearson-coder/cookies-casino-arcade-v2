import {state} from "./state.js";import {publicConfig,secureFetch} from "./api.js";
let client=null,mode="signin";
export async function initAuth(){
 const cfg=await publicConfig();client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
 const {data}=await client.auth.getSession();state.session=data.session;state.user=data.session?.user||null;
 client.auth.onAuthStateChange((_event,session)=>{state.session=session;state.user=session?.user||null});
 return Boolean(state.user)
}
export function setAuthMode(next){
 mode=next;document.getElementById("authSignInTab").classList.toggle("active",mode==="signin");
 document.getElementById("authCreateTab").classList.toggle("active",mode==="create");
 document.getElementById("playerNameWrap").style.display=mode==="create"?"block":"none";
 document.getElementById("authSubmit").textContent=mode==="create"?"CREATE ACCOUNT":"SIGN IN"
}
export async function submitAuth(){
 const email=document.getElementById("authEmail").value.trim(),password=document.getElementById("authPassword").value;
 const message=document.getElementById("authMessage");message.textContent="Working…";
 if(mode==="create"){
  const display_name=document.getElementById("authPlayerName").value.trim()||"Cookie";
  const {data,error}=await client.auth.signUp({email,password,options:{data:{display_name,username:display_name}}});
  if(error)throw error;
  if(data.session){state.session=data.session;state.user=data.user;message.textContent="Account created."}
  else message.textContent="Check your email to confirm your account."
 }else{
  const {data,error}=await client.auth.signInWithPassword({email,password});if(error)throw error;
  state.session=data.session;state.user=data.user;message.textContent="Signed in."
 }
}
export async function signOut(){await client.auth.signOut();state.session=null;state.user=null}
export async function resetPassword(){
 const email=document.getElementById("authEmail").value.trim();if(!email)throw new Error("Enter your email first.");
 const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:location.origin});if(error)throw error
}
export async function loadAccount(){
 const a=await secureFetch("/api/account");state.profile=a.profile;state.coins=Number(a.wallet?.coins||0);state.transactions=a.transactions||[];return a
}
