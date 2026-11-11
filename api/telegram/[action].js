import {createTelegramHandler} from '../../server/telegram.mjs';

// Vercel runs this privately; these variables never enter the browser bundle.
const handle=createTelegramHandler({
 token:process.env.TELEGRAM_BOT_TOKEN,
 chatId:process.env.TELEGRAM_CHAT_ID,
});
export default async function telegram(req,res){
 try{if(!await handle(req,res)){res.statusCode=404;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'Not found'}))}}
 catch{res.statusCode=500;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'Request failed'}))}
}
