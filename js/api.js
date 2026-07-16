import {state} from "./state.js";
export async function publicConfig(){
 const r=await fetch("/api/public-config");if(!r.ok)throw new Error("Account configuration is unavailable.");return r.json()
}
export async function secureFetch(url,options={}){
 const token=state.session?.access_token;if(!token)throw new Error("Please sign in.");
 const r=await fetch(url,{...options,headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`,...options.headers}});
 const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||"Request failed");return data
}
