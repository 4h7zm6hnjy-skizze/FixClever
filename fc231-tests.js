/* FixClever 2.3.3 performance hotfix (2026-10-13).
   Ersetzt ausschliesslich die blockierende Aufgabenaufbereitung; vorhandene Daten bleiben erhalten. */
(()=>{
'use strict';
const ORIGINAL={};
for(const [id,items] of Object.entries(QUESTIONS)) ORIGINAL[id]=items.map(q=>({...q,options:[...q.options]}));
const lessonFor=new Map(LESSONS.map(l=>[l.id,l]));
const rows=[];
for(const [lessonId,bank] of Object.entries(ORIGINAL)){
 if(lessonId.startsWith('fc15_')||lessonId.startsWith('fc16_'))continue;
 const lesson=lessonFor.get(lessonId);if(!lesson)continue;
 for(const q of bank)rows.push({lessonId,subject:lesson.subject,grade:lesson.grade,q});
}
const binary=q=>q.options.length===2&&q.options.includes('Stimmt')&&q.options.includes('Stimmt nicht');
const claim=q=>String(q.prompt).replace(/^\s*Stimmt\s+das\?\s*/i,'').trim();
const norm=v=>{const t=String(v).normalize('NFKC').toLocaleLowerCase('de-DE').replace(/\s+/g,' ').trim();return t.length<=2?t:t.replace(/[.!?]+$/,'');};
const FALSE=rows.filter(x=>binary(x.q)&&x.q.options[x.q.answer]==='Stimmt nicht').map(x=>({...x,text:claim(x.q)}));
const TRUE=rows.filter(x=>binary(x.q)&&x.q.options[x.q.answer]==='Stimmt').map(x=>({...x,text:claim(x.q)}));
const WRONG=rows.flatMap(x=>binary(x.q)?[]:x.q.options.filter((v,i)=>i!==x.q.answer).map(text=>({...x,text:String(text)})));
function uniq(arr,text,seen){const t=String(text||'').trim(),k=norm(t);if(!k||seen.has(k))return false;seen.add(k);arr.push(t);return true;}
function numericPattern(text){const m=String(text).trim().match(/^([−+\-]?\d+(?:[.,]\d+)?)(\s*(?:%|€|cm|mm|km|m|kg|g|mg|ml|l|h|min|s|°|m²|cm²)?)$/i);return m||null;}
function shape(str){const s=String(str).trim();if(numericPattern(s))return 'numeric';if(/^\d+\s+Rest\s+\d+$/i.test(s))return 'remainder';if(s.length<35&&!/[.!?]/.test(s))return 'short';return 'phrase';}
// Previous implementation re-sorted every distractor in every test question.
// That is quadratic and can freeze iOS Safari. Here we index once per pool.
const rankCache=new WeakMap();
function rank(pool,x,wantedShape){
 let index=rankCache.get(pool);
 if(!index){
  index={lesson:new Map(),subjectGrade:new Map(),subject:new Map(),grade:new Map(),shape:new Map(),all:pool};
  const add=(m,k,v)=>{let group=m.get(k);if(!group){group=[];m.set(k,group);}group.push(v);};
  for(const v of pool){
   add(index.lesson,v.lessonId,v);
   add(index.subjectGrade,v.subject+'|'+v.grade,v);
   add(index.subject,v.subject,v);
   add(index.grade,v.grade,v);
   add(index.shape,shape(v.text),v);
  }
  rankCache.set(pool,index);
 }
 const seed=[...String(x.q.id)].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,2166136261);
 const candidates=[],visited=new Set(),limit=96;
 function add(group,maxScan){
  if(!group||candidates.length>=limit)return;
  const start=seed%group.length,scans=Math.min(group.length,maxScan);
  for(let k=0;k<scans&&candidates.length<limit;k++){
   const v=group[(start+k)%group.length];
   if(v.q.id===x.q.id||visited.has(v))continue;
   if(wantedShape&&shape(v.text)!==wantedShape)continue;
   visited.add(v);candidates.push(v);
  }
 }
 add(index.lesson.get(x.lessonId),64);
 add(index.subjectGrade.get(x.subject+'|'+x.grade),96);
 add(index.subjectGrade.get(x.subject+'|'+(x.grade-1)),32);
 add(index.subjectGrade.get(x.subject+'|'+(x.grade+1)),32);
 add(index.subject.get(x.subject),128);
 add(index.grade.get(x.grade),64);
 if(wantedShape)add(index.shape.get(wantedShape),128);
 add(index.all,128);
 return candidates;
}
function numericWrong(correct){
 const m=numericPattern(correct);if(!m)return [];
 const val=Number(m[1].replace('−','-').replace(',','.'));if(!Number.isFinite(val))return [];
 const fmt=m[1].includes(',')?',':m[1].includes('.')?'.':null,dp=fmt?m[1].split(fmt)[1].length:0,step=Math.pow(10,-dp);
 return [-1,1,-2,2,-3,3,-4,4,-5,5,-6,6,-8,8,-10,10,-12,12,-15,15].map(delta=>{
  const n=val+delta*step;if(n<0&&val>=0||!Number.isFinite(n))return null;
  return (dp?n.toFixed(dp).replace('.',fmt):String(n))+m[2];
 }).filter(Boolean);
}
function remainderWrong(correct){
 const m=String(correct).trim().match(/^(\d+)\s+Rest\s+(\d+)$/i);if(!m)return [];
 const a=Number(m[1]),b=Number(m[2]),out=[];
 for(const dx of [-1,1,-2,2,-3,3,4])for(const dy of [-1,1,2,-2,3])if(a+dx>=0&&b+dy>=0)out.push(`${a+dx} Rest ${b+dy}`);
 return out;
}
const unresolved=[];
for(const x of rows){
 const q=x.q,correct=q.options[q.answer],opts=[],seen=new Set();let answer=0,prompt=q.prompt;
 if(q.id==='nrw13_16q5'){
  for(const v of ['¿','!',';','¡','?',':','«','»','.','—'])uniq(opts,v,seen);
  answer=0;
 }else if(binary(q)){
  let chosenCorrect=q.options[q.answer]==='Stimmt'?claim(q):String(q.explanation).trim();
  if(chosenCorrect.length<10||/^(?:das|diese|sie|er|es|hier|nein|ja|falsch|richtig)\b/i.test(chosenCorrect)||!/[.?!]$/.test(chosenCorrect)){
   chosenCorrect=rank(TRUE,x).find(v=>v.lessonId===x.lessonId)?.text||rank(TRUE,x)[0]?.text||chosenCorrect;
  }
  uniq(opts,chosenCorrect,seen);
  for(const candidate of rank(FALSE,x)){
   if(opts.length>=10)break;
   if(norm(candidate.text)===norm(chosenCorrect))continue;
   uniq(opts,candidate.text,seen);
  }
  prompt='Welche Aussage ist richtig?';
 }else{
  for(const value of q.options.map(String))uniq(opts,value,seen);
  answer=opts.findIndex(v=>norm(v)===norm(correct));
  const sig=shape(correct);
  if(sig==='numeric'||sig==='remainder')for(const v of(sig==='numeric'?numericWrong(correct):remainderWrong(correct))){if(opts.length>=10)break;uniq(opts,v,seen);}
  if(opts.length<10)for(const candidate of rank(WRONG,x,sig)){
   if(opts.length>=10)break;
   if(sig==='short'){
    const ratio=candidate.text.length/Math.max(1,String(correct).length);
    if(ratio>2.5||ratio<0.35)continue;
   }
   uniq(opts,candidate.text,seen);
  }
 }
 if(opts.length===10&&new Set(opts.map(norm)).size===10&&answer>=0&&answer<10){
  if(binary(q))answer=0;
  const live=QUESTIONS[x.lessonId].find(y=>y.id===q.id);
  live.prompt=prompt;live.options=[...opts];live.answer=answer;
 }else unresolved.push(q.id);
}
// Preserve previously saved quiz answers and existing child profiles.
cleanAttempt=function(a){
 if(!a||!validIds.has(a.lessonId)||!Number.isInteger(a.correct)||a.correct<0||a.correct>10||a.total!==10||!Number.isFinite(Date.parse(a.date))||!Array.isArray(a.answers)||a.answers.length!==10)return null;
 const old=ORIGINAL[a.lessonId],now=QUESTIONS[a.lessonId];if(!old||!now)return null;
 const used=new Set();let correct=0;
 for(const ans of a.answers){
  if(used.has(ans.questionId))return null;used.add(ans.questionId);
  const orig=old.find(q=>q.id===ans.questionId),next=now.find(q=>q.id===ans.questionId);
  if(!orig||!next)return null;
  const validOld=orig.options.includes(ans.selected),validNew=next.options.includes(ans.selected);
  if(!validOld&&!validNew)return null;
  const chosen=validOld?orig:next;
  if(ans.selected===chosen.options[chosen.answer])correct++;
 }
 if(correct!==a.correct)return null;
 return {id:String(a.id),lessonId:a.lessonId,date:a.date,total:10,correct,answers:a.answers.map(x=>({questionId:x.questionId,selected:x.selected}))};
};
profileData=loadProfiles();applyChild();profileButton();
const priorResult=showResult;
showResult=function(a,stored){
 const hadLegacy=a?.answers?.some(ans=>{const orig=ORIGINAL[a.lessonId]?.find(q=>q.id===ans.questionId);return orig&&binary(orig)&&orig.options.includes(ans.selected);});
 if(hadLegacy){const saved=QUESTIONS[a.lessonId];QUESTIONS[a.lessonId]=ORIGINAL[a.lessonId];try{return priorResult(a,stored);}finally{QUESTIONS[a.lessonId]=saved;}}
 return priorResult(a,stored);
};
const prevRender=renderQuiz;
renderQuiz=function(){prevRender();const note=document.querySelector('#quiz-area .answer-options+p');if(note)note.textContent='Eine von zehn Antworten auswählen. Die Lösungen erscheinen nach der Abgabe.';};
const priorReader=renderReader;
renderReader=function(){priorReader();const p=document.querySelector('#reader .test-invite p');if(p)p.textContent=p.textContent.replace('10 Aufgaben','10 Aufgaben · jeweils 10 Antwortmöglichkeiten');};
window.FixCleverAnswerAudit=Object.freeze({total:rows.length,tenChoices:rows.length-unresolved.length,pending:unresolved.slice(),revisionsRequireReview:true});
if(unresolved.length)console.warn('Einige Aufgaben bleiben bei der vorhandenen Antwortzahl. Anzahl:',unresolved.length,'Beispiele:',unresolved.slice(0,10));
})();

/* Lernsterne & Abzeichen: unchanged rules, data remains only in local browser storage. */
(()=>{
 'use strict';
 function info(){
  const p=typeof child==='function'?child():null;
  const attempts=[...(p?.attempts||[])].filter(a=>a&&a.total===10&&Number.isInteger(a.correct)).sort((a,b)=>new Date(a.date)-new Date(b.date)||String(a.id).localeCompare(String(b.id)));
  const best=new Map(),subjects=new Set(),days=new Set();let stars=0,improvements=0;
  const earns=new Map();
  for(const a of attempts){
   const old=best.get(a.lessonId)||0;
   const gain=Math.max(0,a.correct-old),bonus=best.has(a.lessonId)&&gain>0?2:0;
   const earned=gain+bonus;
   stars+=earned;earns.set(a.id,earned);
   if(best.has(a.lessonId)&&gain>0)improvements++;
   if(!best.has(a.lessonId)||a.correct>old)best.set(a.lessonId,a.correct);
   const l=LESSONS.find(l=>l.id===a.lessonId);if(l)subjects.add(l.subject);
   const dt=new Date(a.date);if(Number.isFinite(dt.getTime())){
    const date=[dt.getFullYear(),String(dt.getMonth()+1).padStart(2,'0'),String(dt.getDate()).padStart(2,'0')].join('-');days.add(date);
   }
  }
  const sorted=[...days].sort();let streak=0,maxStreak=0,prior=null;
  for(const day of sorted){const t=new Date(day+'T12:00:00');if(prior&&Math.round((t-prior)/86400000)===1)streak++;else streak=1;maxStreak=Math.max(maxStreak,streak);prior=t;}
  const mastered=[...best.values()].filter(x=>x===10).length;
  const goals=[
   {id:'start',name:'Erster Schritt',hint:'Schließe deinen ersten Test ab',done:attempts.length>=1},
   {id:'five',name:'Neugierig',hint:'Übe fünf verschiedene Themen',done:best.size>=5},
   {id:'perfect',name:'Volltreffer',hint:'Beantworte alle zehn Aufgaben eines Tests richtig',done:mastered>=1},
   {id:'better',name:'Dranbleiber',hint:'Verbessere dich in einem Thema',done:improvements>=1},
   {id:'subjects',name:'Fächer-Entdecker',hint:'Übe in vier verschiedenen Fächern',done:subjects.size>=4},
   {id:'days',name:'Lernserie',hint:'Lerne an drei aufeinanderfolgenden Tagen',done:maxStreak>=3},
   {id:'stars',name:'Sternensammler',hint:'Sammle 100 Lernsterne',done:stars>=100},
   {id:'expert',name:'Themenprofi',hint:'Schaffe fünf perfekte Tests in verschiedenen Themen',done:mastered>=5}
  ];
  const ranks=[{s:0,label:'Wissensstarter'},{s:30,label:'Wissenssammler'},{s:100,label:'Wissensforscher'},{s:300,label:'Lernprofi'},{s:700,label:'Wissensmeister'}];
  let level=ranks[0],next=null;for(const r of ranks){if(stars>=r.s)level=r;else{next=r;break;}}
  return {p,stars,mastered,attempts,best,subjects,goals,earns,level,next,days};
 }
 const root=document.querySelector('.fc-update-details')||document.querySelector('.top-actions');
 const btn=document.createElement('button');btn.type='button';btn.className='fc-reward-open';btn.setAttribute('aria-label','Lernbelohnungen ansehen');btn.textContent='☆ Meine Sterne';
 if(root)root.after(btn);
 const dialog=document.createElement('dialog');dialog.id='fc-rewards-dialog';dialog.setAttribute('aria-label','Meine Lernbelohnungen');
 document.body.append(dialog);
 const e=s=>esc(s);
 function renderRewardDialog(){
  const x=info();const progress=x.next?Math.max(0,Math.min(100,Math.round((x.stars-x.level.s)/(x.next.s-x.level.s)*100))):100;
  dialog.innerHTML=`<div class="fc-reward-head"><div><span class="eyebrow">DEIN LERNWEG</span><h2>${x.p?e(x.p.name)+', deine':'Deine'} Lernbelohnungen</h2></div><button type="button" class="fc-reward-close" aria-label="Schließen">×</button></div>
  <div class="fc-reward-big"><strong>${x.stars} <span>★</span></strong><p>Lernsterne · ${e(x.level.label)}</p><div class="fc-reward-progress" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" aria-label="Fortschritt zum nächsten Lernrang"><span style="width:${progress}%"></span></div><small>${x.next?`Noch ${x.next.s-x.stars} Sterne bis ${e(x.next.label)}.`:'Du hast den höchsten Lernrang erreicht.'}</small></div>
  <p class="fc-reward-note">Du bekommst einen Stern für jede zusätzliche richtige Antwort gegenüber deinem bisherigen besten Test in diesem Thema. Beim Verbessern gibt es zwei Extra-Sterne. Kein Abzug für Fehler oder Pausen, keine Rangliste.</p>
  <h3>Deine Abzeichen <small>${x.goals.filter(g=>g.done).length}/${x.goals.length}</small></h3>
  <div class="fc-reward-badges">${x.goals.map(g=>`<div class="fc-reward-badge ${g.done?'unlocked':'locked'}"><span>${g.done?'★':'◇'}</span><strong>${e(g.name)}</strong><small>${e(g.hint)}</small></div>`).join('')}</div>
  <button type="button" class="fc-reward-close fc-reward-done">Schließen</button>`;
  dialog.querySelectorAll('.fc-reward-close').forEach(b=>b.addEventListener('click',()=>dialog.close()));
 }
 btn?.addEventListener('click',()=>{renderRewardDialog();dialog.showModal();});
 dialog.addEventListener('click',ev=>{if(ev.target===dialog)dialog.close();});
 const prevShow=showResult;
 showResult=function(a,stored){
  const result=prevShow(a,stored),x=info();
  const gain=x.earns.get(a.id)||0;
  const element=document.querySelector('#quiz-area .result-hero');
  if(element){const card=document.createElement('div');card.className='fc-result-reward';
   card.innerHTML=`<strong>★ ${gain?`+${gain} Lernsterne für diesen Versuch`:'Deine Lernsterne bleiben erhalten'}</strong><p>Insgesamt ${x.stars} Sterne · ${e(x.level.label)}</p><button type="button" class="fc-reward-result-open">Abzeichen ansehen ↗</button>`;
   element.append(card);card.querySelector('button').addEventListener('click',()=>btn.click());
  }return result;
 };
 const prevStats=showStats;
 showStats=function(){const result=prevStats(),x=info();const target=document.querySelector('#quiz-area .stat-grid');
  if(target){const row=document.createElement('div');row.className='fc-reward-stat';row.innerHTML=`<strong>★ ${x.stars} Lernsterne</strong><span>${e(x.level.label)} · ${x.goals.filter(g=>g.done).length} Abzeichen</span><button type="button">Belohnungen ansehen ↗</button>`;target.before(row);row.querySelector('button').addEventListener('click',()=>btn.click());}
  return result;
 };
 window.FixCleverRewardsAudit=()=>{const a=info();return {stars:a.stars,earnedBadges:a.goals.filter(x=>x.done).map(x=>x.id),count:a.attempts.length}};
})();
