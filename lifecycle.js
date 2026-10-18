(function(root){
 'use strict';
 const sections=[{id:'prd',label:'PRD',weight:10},{id:'design',label:'UI/UX / Prototype',weight:20},{id:'frontend',label:'Frontend development',weight:20},{id:'backend',label:'Backend development',weight:20},{id:'seo',label:'SEO',weight:15},{id:'uat',label:'UAT',weight:15}];
 const phase=t=>t.phase||'Phase 1',fraction=status=>status==='Done'?1:status==='In progress'?.5:0;
 function calculate(tasks,productId,currentPhase='Phase 1'){const rows=tasks.filter(t=>t.product===productId&&phase(t)===currentPhase),parts=sections.map(s=>{const matches=rows.filter(t=>t.workType===s.id),earned=matches.length?s.weight*matches.reduce((sum,t)=>sum+fraction(t.status),0)/matches.length:0;return {...s,count:matches.length,earned:Math.round(earned*100)/100,completion:matches.length?matches.reduce((sum,t)=>sum+fraction(t.status),0)/matches.length:0};});return {score:Math.round(parts.reduce((sum,s)=>sum+s.weight*s.completion,0)*100)/100,sections:parts,unclassified:rows.filter(t=>!sections.some(s=>s.id===t.workType)).length,tasks:rows};}
 const api={sections,phase,fraction,calculate};root.GrowthLifecycle=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
