import {requireUser,sendError} from "../lib/auth.js";import {supabaseAdmin} from "../lib/supabase-admin.js";
const COST={spades:0,solitaire:0,colorclash:0,crush:0,bingo:0,word:0,chess:0,dominoes:0};
const MAX={spades:600,solitaire:500,colorclash:500,crush:500,bingo:500,word:500,chess:500,dominoes:500};
export default async function handler(req,res){
 try{
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const u=await requireUser(req),b=req.body||{};let amount,type;
  if(b.action==="game_entry"){amount=0;type="free_game_entry"}
  else if(b.action==="game_reward"){amount=Math.min(MAX[b.gameKey]||0,Math.max(1,Number(b.coins||0)));type="game_reward"}
  else if(b.action==="game_loss"){
    const requested=Math.min(1000,Math.max(1,Number(b.coins||100)));
    const {data:w,error:we}=await supabaseAdmin.from("arcade_wallets").select("coins").eq("user_id",u.id).single();
    if(we)throw we;amount=-Math.min(requested,Number(w.coins||0));type="game_loss";
  }else return res.status(400).json({error:"Unknown action"});
  const {data,error}=await supabaseAdmin.rpc("apply_arcade_wallet_transaction",{
    p_user_id:u.id,p_amount:amount,p_type:type,p_reference:b.requestId,
    p_metadata:{game_key:b.gameKey,reason:b.reason||null}
  });
  if(error)throw error;res.status(200).json(data)
 }catch(e){sendError(res,e)}
}
