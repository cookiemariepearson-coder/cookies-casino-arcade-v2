import {supabaseAdmin} from "./supabase-admin.js";
export async function requireUser(req){const h=req.headers.authorization||"",token=h.startsWith("Bearer ")?h.slice(7):"";if(!token)throw Object.assign(new Error("Please sign in."),{status:401});
 const {data,error}=await supabaseAdmin.auth.getUser(token);if(error||!data.user)throw Object.assign(new Error("Session expired."),{status:401});return data.user}
export function sendError(res,e){return res.status(e.status||500).json({error:e.message||"Server error"})}
