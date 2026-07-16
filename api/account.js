import {requireUser,sendError} from "../lib/auth.js";import {supabaseAdmin} from "../lib/supabase-admin.js";
export default async function handler(req,res){try{const u=await requireUser(req);const [p,w,g,t]=await Promise.all([
 supabaseAdmin.from("arcade_profiles").select("*").eq("id",u.id).maybeSingle(),
 supabaseAdmin.from("arcade_wallets").select("*").eq("user_id",u.id).maybeSingle(),
 supabaseAdmin.from("arcade_progress").select("*").eq("user_id",u.id).maybeSingle(),
 supabaseAdmin.from("arcade_wallet_transactions").select("*").eq("user_id",u.id).order("created_at",{ascending:false}).limit(20)]);
 const e=p.error||w.error||g.error||t.error;if(e)throw e;res.status(200).json({profile:p.data,wallet:w.data||{coins:0},progress:g.data,transactions:t.data||[]})}catch(e){sendError(res,e)}}
