import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {createTelegramHandler} from './telegram.mjs';
try{process.loadEnvFile('.env.local')}catch(error){if(error.code!=='ENOENT')throw error}
const handler=createTelegramHandler({token:process.env.TELEGRAM_BOT_TOKEN,chatId:process.env.TELEGRAM_CHAT_ID});const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.mp3':'audio/mpeg','.json':'application/json'};
createServer(async(req,res)=>{try{if(await handler(req,res))return;if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end();return}let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return}try{if((await stat(file)).isDirectory())file=resolve(file,'index.html')}catch{if(extname(pathname)){res.writeHead(404).end();return}file=resolve(root,'index.html')}const data=await readFile(file);res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.setHeader('Content-Length',data.length);res.end(req.method==='HEAD'?undefined:data)}catch{res.writeHead(500).end('Request failed')}}).listen(Number(process.env.PORT||4173),'0.0.0.0',()=>console.log('Book server ready'));
