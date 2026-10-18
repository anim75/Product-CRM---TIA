'use strict';
const {summarize}=require('../server.cjs');
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Use POST.'});}
 if(req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host)return res.status(403).json({error:'Same-origin requests only.'});}catch{return res.status(403).json({error:'Invalid origin.'});}}
 if(!req.headers['content-type']?.startsWith('application/json'))return res.status(415).json({error:'Use application/json.'});
 const apiKey=process.env.OPENAI_API_KEY,model=process.env.OPENAI_MODEL;
 if(!apiKey||!model)return res.status(503).json({error:'AI is not configured. Use local formatting, or configure OPENAI_API_KEY and OPENAI_MODEL in Vercel.'});
 let d=req.body;try{if(typeof d==='string')d=JSON.parse(d);}catch{return res.status(400).json({error:'Invalid JSON.'});}
 if(!d||['title','date','attendees','notes'].some(k=>typeof d[k]!=='string'||!d[k].trim())||d.notes.length>20000||d.title.length>180||d.attendees.length>1000||!/^\d{4}-\d{2}-\d{2}$/.test(d.date))return res.status(400).json({error:'Provide a subject, date, attendees and meeting notes (up to 20,000 characters).'});
 try{return res.status(200).json(await summarize({title:d.title,date:d.date,attendees:d.attendees,notes:d.notes},{apiKey,model}));}catch(error){return res.status(502).json({error:error.name==='TimeoutError'?'AI summary timed out. Please retry.':error.message});}
};
