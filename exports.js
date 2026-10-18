(function(root){
'use strict';
const types={products:'Products',health:'Development health',tasks:'Tasks',members:'Product team',meetings:'Meetings & email',campaigns:'Campaigns & ROI',winners:'Campaign winners',daily:'Marketing & audience metrics',budgets:'Monthly budgets',files:'Supporting links',notes:'Notes',snapshots:'Saved KPI snapshots',settings:'Workspace settings'};
const iso=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}/.test(value)?value.slice(0,10):'';
function inRange(row,filter={}){const start=iso(row.start||row.date||row.createdAt||row.due||row.deadline),end=iso(row.end||row.deadline||row.due)||start;if(!start&&!end)return filter.undated!==false;return (!filter.from||(end||start)>=filter.from)&&(!filter.to||(start||end)<=filter.to);}
function records(workspace,type,health){const products=workspace.products||[],name=id=>products.find(p=>p.id===id)?.name||'',enrich=row=>({...row,product_name:name(row.product)});switch(type){
case 'products':return products.map(p=>({...p,product:p.id,product_name:p.name}));
case 'health':return products.flatMap(p=>{const h=health?health(workspace.tasks||[],p.id,p.phase||'Phase 1'):null;return (h?.sections||[]).map(s=>({product:p.id,product_name:p.name,phase:p.phase||'Phase 1',section:s.label,earned:s.earned,maximum:s.weight,completion_percent:s.completion*100,product_health:h.score,start:p.start,deadline:p.deadline}));});
case 'members':return products.flatMap(p=>(p.members||[]).map(m=>({...m,product:p.id,product_name:p.name,start:p.start,deadline:p.deadline})));
case 'winners':return (workspace.campaigns||[]).flatMap(c=>(c.winners||[]).map((winner,i)=>enrich({campaign:c.name,rank:i+1,...(typeof winner==='object'?winner:{name:winner}),product:c.product,start:c.start,end:c.end})));
case 'budgets':return Object.entries(workspace.budgets||{}).map(([key,budget])=>{const [product,month]=key.split('|');const last=new Date(Date.UTC(Number(month?.slice(0,4)),Number(month?.slice(5,7)),0)).toISOString().slice(0,10);return enrich({product,month,budget,start:month+'-01',end:last,currency:workspace.currency});});
case 'settings':return [{display_name:workspace.profile?.name,email:workspace.profile?.email,currency:workspace.currency,theme:workspace.theme||'white',automations:workspace.automations}];
default:return (workspace[type]||[]).map(enrich);
}}
function rows(workspace,type,filter={},health){if(filter.from&&filter.to&&filter.from>filter.to)throw Error('Start date must be before or equal to end date.');const selected=type==='all'?Object.keys(types):[type];return selected.flatMap(kind=>records(workspace,kind,health).filter(row=>(!filter.product||filter.product==='all'||row.product===filter.product)&&inRange(row,filter)).map(row=>({record_type:kind,...row})));}
function csv(records){if(!records.length)return '';const fields=[...new Set(records.flatMap(Object.keys))],cell=value=>'"'+String(value==null?'':typeof value==='object'?JSON.stringify(value):value).replace(/^(\s*)([=+@-])/,'$1\'$2').replace(/"/g,'""')+'"';return '\uFEFF'+[fields,...records.map(row=>fields.map(field=>row[field]))].map(row=>row.map(cell).join(',')).join('\r\n');}
const api={types,inRange,records,rows,csv};root.WorkspaceExport=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
