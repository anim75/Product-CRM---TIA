(function(root){
 'use strict';
 const signature=`Regards,

Tanjim Imtial
Product Manager
Cell: +88 01709654210, Ext: 7009
E-mail: tanjim@edisoncommunication.com

Rangs Babylonia
246, Bir Uttam Mir Shawkat Road, Tejgaon
I/A, Dhaka-1208
Telephone: +880 2 8878057, 8878058 Ext.: 7009
www.momagicbd.com | www.momagic.bd.com
www.edison-bd.com

EDISON GROUP`;
 const lists=['decisions','actions','timeline'];
 function valid(s){return s&&typeof s.subject==='string'&&typeof s.summary==='string'&&typeof s.conclusion==='string'&&lists.every(k=>Array.isArray(s[k])&&s[k].every(x=>typeof x==='string'));}
 function local(m){const lines=m.notes.split(/\r?\n/).map(s=>s.replace(/^\s*[-*•]\s*/, '').trim()).filter(Boolean),sections={summary:[],decisions:[],actions:[],timeline:[],conclusion:[]};let current='summary';for(const line of lines){const match=line.match(/^(summary|decisions?|action items?|actions?|next steps?|execution timeline|timeline|conclusion)\s*:\s*(.*)$/i);if(match){const h=match[1].toLowerCase();current=h.startsWith('decision')?'decisions':/^(action|next)/.test(h)?'actions':h.includes('timeline')?'timeline':h; if(match[2])sections[current].push(match[2]);}else sections[current].push(line);}return {subject:`MoM | ${m.title} | ${m.date}`,summary:sections.summary.join('\n')||'Please review the discussion and next steps below.',decisions:sections.decisions,actions:sections.actions,timeline:sections.timeline,conclusion:sections.conclusion.join('\n')||'Please review the above points and confirm any outstanding items.'};}
 function body(m,s){const bullets=arr=>arr.length?arr.map(x=>'• '+x).join('\n'):'Not recorded in the meeting notes.';return `Hi all,\n\nThank you for joining the meeting. Please find the summary below.\n\nMeeting: ${m.title}\nDate: ${m.date}\nAttendees: ${m.attendees}\n\nSummary\n${s.summary}\n\nDecisions\n${bullets(s.decisions)}\n\nAction items\n${bullets(s.actions)}\n\nExecution timeline\n${bullets(s.timeline)}\n\nConclusion\n${s.conclusion}\n\nPlease reply if anything is missing or needs correction.\n\n${signature}`;}
 const api={signature,valid,local,body};root.MeetingFormat=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
