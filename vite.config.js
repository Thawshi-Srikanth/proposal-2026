import {defineConfig,loadEnv} from 'vite';
import {createTelegramHandler} from './server/telegram.mjs';
export default defineConfig(({mode})=>{const env=loadEnv(mode,process.cwd(),'');return {plugins:[{name:'private-telegram-relay',configureServer(server){const handler=createTelegramHandler({token:env.TELEGRAM_BOT_TOKEN,chatId:env.TELEGRAM_CHAT_ID});server.middlewares.use((req,res,next)=>{handler(req,res).then(handled=>{if(!handled)next()}).catch(()=>{res.statusCode=500;res.end('Request failed')})})}}]}});
