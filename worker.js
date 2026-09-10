const JSON_HEADERS = {"content-type":"application/json; charset=utf-8","cache-control":"no-store"};
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:JSON_HEADERS})}
function cors(request){const origin=request.headers.get("Origin")||"*";return {"access-control-allow-origin":origin,"access-control-allow-headers":"Authorization, Content-Type","access-control-allow-methods":"GET, POST, PUT, OPTIONS","vary":"Origin"}}
function withCors(response,request){const h=new Headers(response.headers);for(const [k,v] of Object.entries(cors(request)))h.set(k,v);return new Response(response.body,{status:response.status,headers:h})}
async function auth(request,env){const expected=env.DONEXT_API_TOKEN;if(!expected)return false;return (request.headers.get("Authorization")||"")==="Bearer "+expected}
function emptyState(){return {schemaVersion:2,nextWorkout:"A",sessions:0,program:{A:[],B:[],C:[]},history:[]}}
async function readState(env){const raw=await env.DONEXT_KV.get("state");return raw?JSON.parse(raw):emptyState()}
async function writeState(env,state){await env.DONEXT_KV.put("state",JSON.stringify(state));return state}
function normalizeExercise(x){return [String(x.exercise??x.name??""),Number(x.weight??x.baseWeight??0),String(x.unit??"kg"),Number(x.sets??1),String(x.targetRange??x.range??"8–12")]}
async function api(request,env,path){
 if(!(await auth(request,env)))return json({error:"Unauthorized"},401);
 if(request.method==="GET"&&path==="/api/state")return json(await readState(env));
 if(request.method==="GET"&&path==="/api/history"){const s=await readState(env);return json({history:s.history||[]})}
 if(request.method==="PUT"&&path==="/api/state"){const body=await request.json(),cur=await readState(env);return json(await writeState(env,{...cur,...body,program:body.program||cur.program,history:Array.isArray(body.history)?body.history:cur.history}))}
 if(request.method==="POST"&&path==="/api/workout"){
  const body=await request.json(),s=await readState(env);s.history=Array.isArray(s.history)?s.history:[];
  const ix=s.history.findIndex(x=>x.id&&body.id&&x.id===body.id); if(ix>=0)s.history[ix]=body;else s.history.push(body);
  if(!body.enteredAfterward){s.sessions=Number(s.sessions||0)+1;s.nextWorkout=body.workout==="A"?"B":body.workout==="B"?"C":"A"}
  return json(await writeState(env,s))
 }
 if((request.method==="POST"||request.method==="PUT")&&path==="/api/next-workout"){
  const body=await request.json(),w=String(body.workout||"").toUpperCase();
  if(!["A","B","C"].includes(w))return json({error:"workout must be A, B or C"},400);
  if(!Array.isArray(body.exercises))return json({error:"exercises must be an array"},400);
  const s=await readState(env);s.program=s.program||{A:[],B:[],C:[]};s.program[w]=body.exercises.map(normalizeExercise);s.nextWorkout=w;
  s.lastPlanUpdate={at:new Date().toISOString(),source:"ChatGPT",reason:body.reason||""};return json(await writeState(env,s))
 }
 if(request.method==="POST"&&path==="/api/replace-exercise"){
  const body=await request.json(),w=String(body.workout||"").toUpperCase();
  if(!["A","B","C"].includes(w))return json({error:"workout must be A, B or C"},400);
  if(!body.from||!body.to)return json({error:"from and to are required"},400);
  const s=await readState(env),list=s.program?.[w]||[],from=String(body.from).trim().toLowerCase(),ix=list.findIndex(e=>String(e[0]).trim().toLowerCase()===from);
  if(ix<0)return json({error:"Exercise not found"},404);
  list[ix]=normalizeExercise(body.to);s.program[w]=list;s.nextWorkout=w;s.lastPlanUpdate={at:new Date().toISOString(),source:"ChatGPT",reason:body.reason||`Replace ${body.from}`};return json(await writeState(env,s))
 }
 return json({error:"Not found"},404)
}
export default {async fetch(request,env){if(request.method==="OPTIONS")return withCors(new Response(null,{status:204}),request);const url=new URL(request.url);if(url.pathname.startsWith("/api/"))return withCors(await api(request,env,url.pathname),request);return env.ASSETS.fetch(request)}}
