'use strict';
const assert=require('node:assert/strict'),g=require('./google-workspace.js');
async function run(){
 const message={to:'test@example.com',subject:'Meeting - বাংলা',body:'Hello\nবাংলা 🌟'};
 const mime=Buffer.from(g.gmailRaw(message),'base64url').toString();
 assert.ok(mime.includes(Buffer.from(message.subject).toString('base64')));
 assert.equal(Buffer.from(mime.split('\r\n\r\n')[1].replace(/\s/g,''),'base64').toString(),message.body);
 assert.throws(()=>g.gmailRaw({...message,to:'bad\r\nBcc: other@example.com'}),/recipient/);
 const workspace={products:[{id:'a',name:'Product',members:[{name:'Member',designation:'PM'}]}],notes:[{body:'🌟'.repeat(40000)}],profile:{name:'Tanjim'}};
 const tabs=g.backupData(workspace),raw=tabs.at(-1).values;
 assert.deepEqual(JSON.parse(raw.slice(1).map(row=>row[1]).join('')),workspace);
 assert.ok(raw.slice(1).every(row=>row[1].length<=30000));
 let calls=[];
 const transport=async(url,options)=>{calls.push({url,options});let result;
 if(url.endsWith('/spreadsheets'))result={spreadsheetId:'testspreadsheet123',spreadsheetUrl:'https://docs.google.com/spreadsheets/d/testspreadsheet123'};
 else if(url.includes('batchUpdate')){const body=JSON.parse(options.body);assert.equal(body.valueInputOption,'RAW');assert.equal(body.data.length,9);result={};}
 else result={values:url.includes('A1%3AB2')?raw.slice(0,2):raw};
 return {ok:true,json:async()=>result};};
 const saved=await g.saveBackup('test-token',workspace,transport);assert.equal(saved.id,'testspreadsheet123');
 assert.deepEqual(await g.readBackup('test-token',saved.url,transport),workspace);
 await g.sendMail('test-token',message,async(url,options)=>{assert.ok(JSON.parse(options.body).raw);return{ok:true,json:async()=>({id:'sent123'})};});
 let prompts=0;global.google={accounts:{oauth2:{hasGrantedAllScopes:()=>true,initTokenClient:config=>({requestAccessToken:options=>{assert.equal(options.prompt,'consent select_account');assert.equal(config.include_granted_scopes,false);prompts++;config.callback({access_token:'only-in-memory'});}})}}};
 await g.authorize('test.apps.googleusercontent.com','gmail');await g.authorize('test.apps.googleusercontent.com','sheets');assert.equal(prompts,2);
 await assert.rejects(()=>g.authorize('our product reo','gmail'),/client ID/);
 console.log('Passed: UTF-8 Gmail MIME, recipient validation, complete chunked backup/restore, RAW spreadsheet writes, send acknowledgement and authorization per action (mocked Google APIs).');
}
run().catch(error=>{console.error(error);process.exitCode=1;});
