import {requireUser,sendError} from "../lib/auth.js";import {supabaseAdmin} from "../lib/supabase-admin.js";
const COST={spades:75,solitaire:40,colorclash:60,crush:50,bingo:45,word:35,chess:60,dominoes:50};
const MAX={spades:500,solitaire:500,colorclash:500,crush:500,bingo:500,word:500,chess:500,dominoes:500};
export default async function handler(req,res){try{if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});const u=await requireUser(req),b=req.body||{};
 let amount,type;if(b.action==="game_entry"){amount=-COST[b.gameKey];type="game_entry"}else if(b.action==="game_reward"){amount=Math.min(MAX[b.gameKey]||0,Math.max(1,Number(b.coins||0)));type="game_reward"}else return res.status(400).json({error:"Unknown action"});
 const {data,error}=await supabaseAdmin.rpc("apply_arcade_wallet_transaction",{p_user_id:u.id,p_amount:amount,p_type:type,p_reference:b.requestId,p_metadata:{game_key:b.gameKey}});
 if(error)throw error;res.status(200).json(data)}catch(e){sendError(res,e)}}
