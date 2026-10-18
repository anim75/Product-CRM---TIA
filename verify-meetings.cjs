'use strict';
const assert=require('node:assert/strict');
const fmt=require('./meeting-format.js');
const {createServer}=require('./server.cjs');
const meeting={title:'Kikori AI weekly sync',date:'2026-10-17',attendees:'Tanjim, Nahid',notes:'Summary: Review launch readiness.\nDecisions: Keep price at 99 BDT.\nAction items: Nahid to finish UAT by 20 Oct.\nTimeline: Soft launch 20 Oct.\nConclusion: Await operator approval.'};
const local=fmt.local(meeting),body=fmt.body(meeting,local);
assert.equal(local.subject,'MoM | Kikori AI weekly sync | 2026-10-17');
assert.deepEqual(local.decisions,['Keep price at 99 BDT.']);
assert.deepEqual(local.actions,['Nahid to finish UAT by 20 Oct.']);
for(const text of ['Hi all,','Rangs Babylonia','246, Bir Uttam Mir Shawkat Road, Tejgaon','I/A, Dhaka-1208','tanjim@edisoncommunication.com','+88 01709654210','EDISON GROUP'])assert.ok(body.includes(text),text);
const unstructured=fmt.local({...meeting,notes:'Price 99 BDT\nNahid: UAT by 20 Oct'});
assert.ok(unstructured.summary.includes('Nahid: UAT by 20 Oct'));
assert.deepEqual(unstructured.actions,[],'does not invent structured actions');
async function run(){
 let captured;
 const mock=async(url,options)=>{captured=JSON.parse(options.body);assert.equal(url,'https://api.openai.com/v1/responses');return {ok:true,json:async()=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(local)}]}]})};};
 const server=createServer({apiKey:'test-only-key',model:'test-only-model',request:mock});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const post=(body,extra={})=>fetch(base+'/api/meeting-summary',{method:'POST',headers:{'Content-Type':'application/json',...extra},body:JSON.stringify(body)});
 try{
  assert.equal((await fetch(base+'/')).status,200);
  assert.equal((await fetch(base+'/meeting-email.js')).status,200);
  assert.equal((await fetch(base+'/server.cjs')).status,404,'server and secrets are not public assets');
  assert.equal((await fetch(base+'/.env')).status,404);
  const result=await post(meeting);assert.equal(result.status,200);assert.deepEqual(await result.json(),local);
  assert.equal(captured.store,false);assert.equal(captured.text.format.strict,true);assert.ok(captured.input.includes('99 BDT'));assert.ok(!captured.input.includes('Rangs Babylonia'));
  assert.equal((await post({...meeting,notes:''})).status,400);
  assert.equal((await post(meeting,{Origin:'https://other.example'})).status,403);
 }finally{await new Promise(resolve=>server.close(resolve));}
 const missing=createServer({apiKey:'',model:''});await new Promise(resolve=>missing.listen(0,'127.0.0.1',resolve));
 try{const res=await fetch('http://127.0.0.1:'+missing.address().port+'/api/meeting-summary',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(meeting)});assert.equal(res.status,503);assert.ok((await res.json()).error.includes('not configured'));}finally{await new Promise(resolve=>missing.close(resolve));}
 console.log('Passed: email format, exact signature, source facts, structured AI request, mocked API response, static preview, input validation, same-origin checks and missing-key handling. Live AI not exercised.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
