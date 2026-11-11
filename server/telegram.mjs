import {randomUUID,createHmac,timingSafeEqual} from 'node:crypto';
const cookieName='book_activity_consent';
const actions=new Set(['sharing_started','button_click','page_view','swipe','keyboard_navigation']);
const clean=(value,max=160)=>typeof value==='string'?value.replace(/[\u0000-\u001f]/g,' ').slice(0,max):'';
export function createTelegramHandler({token,chatId,fetchImpl=fetch,now=Date.now}={}){
 const enabled=!!(token&&chatId),seen=new Map(),rates=new Map();
 const sign=s=>createHmac('sha256',token||'disabled').update(s).digest('base64url');
 const readSession=req=>{try{const value=(req.headers.cookie||'').split('; ').find(c=>c.startsWith(cookieName+'='))?.slice(cookieName.length+1);if(!value)return null;const [payload,signature]=value.split('.'),expected=sign(payload);if(!signature||signature.length!==expected.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return null;const session=JSON.parse(Buffer.from(payload,'base64url').toString());return session.expires>now()?session:null}catch{return null}};
 const respond=(res,status,body)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body))};
 async function body(req){let data;const parsed=req.body;if(parsed!==undefined){data=typeof parsed==='string'||Buffer.isBuffer(parsed)?String(parsed):JSON.stringify(parsed)}else{data='';for await(const chunk of req){data+=chunk;if(Buffer.byteLength(data)>4096)throw Error('oversize')}}if(Buffer.byteLength(data)>4096)throw Error('oversize');const result=JSON.parse(data||'{}');if(!result||typeof result!=='object'||Array.isArray(result))throw Error('invalid body');return result}

 const sameOrigin=req=>{try{return !!req.headers.origin&&new URL(req.headers.origin).host===req.headers.host}catch{return false}};
 return async function handle(req,res){const path=new URL(req.url,'http://localhost').pathname;if(!path.startsWith('/api/telegram/'))return false;
  if(path==='/api/telegram/status'&&req.method==='GET'){respond(res,200,{enabled,consented:!!readSession(req)});return true}
  if(req.method!=='POST'||!sameOrigin(req)){respond(res,403,{error:'Request not permitted'});return true}
  if(!enabled){respond(res,503,{error:'Telegram is not configured'});return true}
  let input;try{input=await body(req)}catch{respond(res,400,{error:'Invalid request'});return true}
  const secure=req.socket?.encrypted||req.headers['x-forwarded-proto']==='https';const flags=`; HttpOnly; SameSite=Strict; Path=/api/telegram${secure?'; Secure':''}`;
  if(path==='/api/telegram/consent'){
   if(input.agreed!==true){res.setHeader('Set-Cookie',`${cookieName}=; Max-Age=0${flags}`);respond(res,200,{consented:false});return true}
   const session={id:randomUUID(),expires:now()+86400000},payload=Buffer.from(JSON.stringify(session)).toString('base64url');res.setHeader('Set-Cookie',`${cookieName}=${payload}.${sign(payload)}; Max-Age=86400${flags}`);respond(res,200,{consented:true});return true;
  }
  if(path!=='/api/telegram/event'){respond(res,404,{error:'Not found'});return true}
  const session=readSession(req);if(!session){respond(res,403,{error:'Reader consent required'});return true}
  if(!actions.has(input.action)||!/^[-\w]{8,64}$/.test(input.id||'')||!Number.isFinite(Date.parse(input.at))){respond(res,400,{error:'Invalid event'});return true}
  const eventKey=session.id+':'+input.id;if(seen.has(eventKey)){respond(res,200,{delivered:true});return true}
  const last=rates.get(session.id)||[];const recent=last.filter(t=>t>now()-60000);if(recent.length>=40){respond(res,429,{error:'Please retry shortly'});return true}recent.push(now());rates.set(session.id,recent);
  const timestamp=new Date(input.at).toLocaleString('en-GB',{timeZone:'Asia/Colombo',hour12:true});
  const lines=['The Secret — reader activity',`Reader session: ${session.id.slice(0,8)}`,`Time: ${timestamp} (Sri Lanka)`,`Action: ${input.action.replaceAll('_',' ')}`];
  if(input.label)lines.push(`Button: ${clean(input.label,220)}`);
  if(input.chapter)lines.push(`Chapter: ${clean(input.chapter)}`);
  if(input.section)lines.push(`Section: ${clean(input.section)}`);
  if(Number.isInteger(input.page)&&input.page>0)lines.push(`Page within section: ${Math.min(999,input.page)}`);
  if(input.ending)lines.push(`Answer route: ${clean(input.ending)}`);
  if(input.direction)lines.push(`Swipe: ${clean(input.direction,20)}${input.blocked?' (choice page — stayed in place)':''}`);
  if(Number.isFinite(input.timeOnPage))lines.push(`Time on previous page: ${Math.max(0,Math.min(86400,Math.round(input.timeOnPage)))} seconds`);
  if(Number.isFinite(input.elapsed))lines.push(`Time since sharing began: ${Math.max(0,Math.min(86400,Math.round(input.elapsed)))} seconds`);
  try{const response=await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text:lines.join('\n')}),signal:AbortSignal.timeout(10000)});const result=await response.json();if(!response.ok||!result.ok)throw Error('Telegram rejected message');seen.set(eventKey,now());if(seen.size>5000){for(const [key,t]of seen)if(t<now()-86400000)seen.delete(key)}respond(res,200,{delivered:true})}catch{respond(res,502,{error:'Telegram delivery pending. Retry later.'})}
  return true;
 }
}
