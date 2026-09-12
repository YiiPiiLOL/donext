const JSON_HEADERS={"content-type":"application/json; charset=utf-8","cache-control":"no-store"};
const PBKDF2_ITERATIONS=20000;
const MAX_EMAIL_LENGTH=254;
const MAX_PASSWORD_LENGTH=256;
function json(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{...JSON_HEADERS,...extra}})}
function cors(request){const origin=request.headers.get("Origin")||"*";return {"access-control-allow-origin":origin,"access-control-allow-headers":"Authorization, Content-Type","access-control-allow-methods":"GET, POST, PUT, OPTIONS","vary":"Origin"}}
function withCors(response,request){const h=new Headers(response.headers);for(const [k,v] of Object.entries(cors(request)))h.set(k,v);return new Response(response.body,{status:response.status,headers:h})}
function emptyState(){return {schemaVersion:2,nextWorkout:"A",sessions:0,program:{A:[],B:[],C:[]},history:[]}}
function defaultProgram(){return {A:[],B:[],C:[]}}
function normalizeExercise(x){return [String(x.exercise??x.name??""),Number(x.weight??x.baseWeight??0),String(x.unit??"kg"),Number(x.sets??1),String(x.targetRange??x.range??"8–12")]}
function b64u(bytes){let s="";for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}
function ub64(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";const bin=atob(s);return Uint8Array.from(bin,c=>c.charCodeAt(0))}
function equalBytes(a,b){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0}
async function requireAuthSecret(env){
 if(typeof env.DONEXT_AUTH_SECRET!=="string"||env.DONEXT_AUTH_SECRET.length<32)throw new Error("AUTH_SECRET_MISSING_OR_TOO_SHORT");
 return env.DONEXT_AUTH_SECRET;
}
async function requireKV(env){
 if(!env.DONEXT_KV||typeof env.DONEXT_KV.get!=="function"||typeof env.DONEXT_KV.put!=="function")throw new Error("KV_BINDING_MISSING");
 return env.DONEXT_KV;
}
async function hmac(secret,data){
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 return new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(data)));
}
async function signSession(env,payload){
 const secret=await requireAuthSecret(env);
 const body=b64u(new TextEncoder().encode(JSON.stringify(payload)));
 return body+"."+b64u(await hmac(secret,body));
}
async function verifySession(env,token){
 try{
  const secret=await requireAuthSecret(env);
  const [body,sig]=String(token||"").split(".");
  if(!body||!sig)return null;
  const expected=await hmac(secret,body);
  const got=ub64(sig);
  if(!equalBytes(expected,got))return null;
  const p=JSON.parse(new TextDecoder().decode(ub64(body)));
  if(!p.exp||p.exp<Date.now()||!p.uid)return null;
  return p;
 }catch{return null}
}
async function getSession(request,env){const h=request.headers.get("Authorization")||"";return verifySession(env,h.startsWith("Bearer ")?h.slice(7):"")}
async function authUser(request,env){const s=await getSession(request,env);return s?.uid?s:null}
async function getUser(env,uid){const kv=await requireKV(env);const raw=await kv.get(`user:${uid}`);return raw?JSON.parse(raw):null}
async function putUser(env,user){const kv=await requireKV(env);await kv.put(`user:${user.id}`,JSON.stringify(user));return user}
async function readState(env,uid){const kv=await requireKV(env);const raw=await kv.get(`state:${uid}`);return raw?JSON.parse(raw):emptyState()}
async function writeState(env,uid,state){const kv=await requireKV(env);await kv.put(`state:${uid}`,JSON.stringify(state));return state}
async function hashPassword(password,salt,iterations=PBKDF2_ITERATIONS){
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),{name:"PBKDF2"},false,["deriveBits"]);
 const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:new TextEncoder().encode(salt),iterations,hash:"SHA-256"},key,256);
 return b64u(new Uint8Array(bits));
}
function uid(){return crypto.randomUUID()}
async function emailAuth(body,env){
 try{
  const kv=await requireKV(env);
  await requireAuthSecret(env);
  const email=String(body?.email||"").trim().toLowerCase();
  const password=String(body?.password||"");
  const mode=body?.mode;
  if(!email||email.length>MAX_EMAIL_LENGTH||password.length<8||password.length>MAX_PASSWORD_LENGTH)return json({error:"Invalid email or password"},400);
  if(mode!=="register"&&mode!=="login")return json({error:"Invalid mode"},400);
  const indexKey=`email:${email}`;
  const existingId=await kv.get(indexKey);
  if(mode==="register"){
   if(existingId)return json({error:"Account already exists"},409);
   const id=uid();
   const salt=uid();
   const ph=await hashPassword(password,salt,PBKDF2_ITERATIONS);
   const token=await signSession(env,{uid:id,exp:Date.now()+1000*60*60*24*30});
   const user={id,email,provider:"email",passwordHash:ph,passwordSalt:salt,passwordIterations:PBKDF2_ITERATIONS,createdAt:new Date().toISOString(),coachProfile:null};
   await putUser(env,user);
   await kv.put(indexKey,id);
   return json({token,user:{id,email,coachProfile:null}});
  }
  if(!existingId)return json({error:"Invalid email or password"},401);
  const user=await getUser(env,existingId);
  if(!user||user.provider!=="email"||!user.passwordHash||!user.passwordSalt)return json({error:"Invalid email or password"},401);
  const iterations=Number(user.passwordIterations||120000);
  if(!Number.isInteger(iterations)||iterations<1000||iterations>1000000)return json({error:"Invalid account data"},500);
  const ph=await hashPassword(password,user.passwordSalt,iterations);
  const a=new TextEncoder().encode(ph),b=new TextEncoder().encode(String(user.passwordHash));
  if(!equalBytes(a,b))return json({error:"Invalid email or password"},401);
  const token=await signSession(env,{uid:user.id,exp:Date.now()+1000*60*60*24*30});
  return json({token,user:{id:user.id,email:user.email,coachProfile:user.coachProfile||null}});
 }catch(err){
  console.error("DoNext auth email error",{name:err?.name||"Error",message:String(err?.message||err),stack:err?.stack||""});
  return json({error:"Authentication service unavailable","code":"AUTH_INTERNAL_ERROR"},503);
 }
}
async function api(request,env,path){
 if(path==="/api/auth/email"&&request.method==="POST"){
  let body;
  try{body=await request.json()}catch{return json({error:"Invalid request body"},400)}
  return emailAuth(body,env);
 }
 const session=await authUser(request,env);if(!session)return json({error:"Unauthorized"},401);const user=await getUser(env,session.uid);if(!user)return json({error:"Account not found"},401);
 if(path==="/api/auth/me"&&request.method==="GET")return json({id:user.id,email:user.email,provider:user.provider,coachProfile:user.coachProfile||null});
 if(path==="/api/auth/coach"&&request.method==="PUT"){const p=await request.json();user.coachProfile={goal:String(p.goal||""),level:String(p.level||""),frequency:String(p.frequency||""),duration:String(p.duration||""),constraints:String(p.constraints||""),updatedAt:new Date().toISOString()};await putUser(env,user);return json({id:user.id,email:user.email,provider:user.provider,coachProfile:user.coachProfile})}
 if(path==="/api/auth/logout"&&request.method==="POST")return json({ok:true});
 if(path==="/api/auth/reset"&&request.method==="POST"){await writeState(env,session.uid,emptyState());user.coachProfile=null;await putUser(env,user);return json({ok:true})}
 if(path==="/api/auth/google"||path==="/api/auth/apple")return json({error:"Provider not configured. Add the provider credentials and verification flow before enabling this endpoint."},501);
 if(request.method==="GET"&&path==="/api/state")return json(await readState(env,session.uid));
 if(request.method==="GET"&&path==="/api/history"){const s=await readState(env,session.uid);return json({history:s.history||[]})}
 if(request.method==="PUT"&&path==="/api/state"){const body=await request.json(),cur=await readState(env,session.uid);return json(await writeState(env,session.uid,{...cur,...body,program:body.program||cur.program,history:Array.isArray(body.history)?body.history:cur.history}))}
 if(request.method==="POST"&&path==="/api/workout"){const body=await request.json(),s=await readState(env,session.uid);s.history=Array.isArray(s.history)?s.history:[];const ix=s.history.findIndex(x=>x.id&&body.id&&x.id===body.id);if(ix>=0)s.history[ix]=body;else s.history.push(body);if(!body.enteredAfterward){s.sessions=Number(s.sessions||0)+1;s.nextWorkout=body.workout==="A"?"B":body.workout==="B"?"C":"A"}return json(await writeState(env,session.uid,s))}
 if((request.method==="POST"||request.method==="PUT")&&path==="/api/next-workout"){const body=await request.json(),w=String(body.workout||"").toUpperCase();if(!["A","B","C"].includes(w))return json({error:"workout must be A, B or C"},400);if(!Array.isArray(body.exercises))return json({error:"exercises must be an array"},400);const s=await readState(env,session.uid);s.program=s.program||defaultProgram();s.program[w]=body.exercises.map(normalizeExercise);s.nextWorkout=w;s.lastPlanUpdate={at:new Date().toISOString(),source:"ChatGPT",reason:body.reason||""};return json(await writeState(env,session.uid,s))}
 if(request.method==="POST"&&path==="/api/replace-exercise"){const body=await request.json(),w=String(body.workout||"").toUpperCase();if(!["A","B","C"].includes(w))return json({error:"workout must be A, B or C"},400);if(!body.from||!body.to)return json({error:"from and to are required"},400);const s=await readState(env,session.uid),list=s.program?.[w]||[],from=String(body.from).trim().toLowerCase(),ix=list.findIndex(e=>String(e[0]).trim().toLowerCase()===from);if(ix<0)return json({error:"Exercise not found"},404);list[ix]=normalizeExercise(body.to);s.program[w]=list;s.nextWorkout=w;s.lastPlanUpdate={at:new Date().toISOString(),source:"ChatGPT",reason:body.reason||`Replace ${body.from}`};return json(await writeState(env,session.uid,s))}
 return json({error:"Not found"},404)
}
export default {async fetch(request,env){
 try{
  if(request.method==="OPTIONS")return withCors(new Response(null,{status:204}),request);
  const url=new URL(request.url);
  if(url.pathname.startsWith("/api/"))return withCors(await api(request,env,url.pathname),request);
  return env.ASSETS.fetch(request);
 }catch(err){
  console.error("DoNext unhandled worker error",{name:err?.name||"Error",message:String(err?.message||err),stack:err?.stack||""});
  return withCors(json({error:"Server error","code":"WORKER_INTERNAL_ERROR"},500),request);
 }
}}
