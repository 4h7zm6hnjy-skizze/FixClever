/* FixClever 2.3.1 – lokal zwischengespeicherte Programmdatei; keine Netzwerk-Abhaengigkeiten. */

/* FixClever 2.3.1: Fachnavigation sofort nach App-Initialisierung ergänzen. */
const NRW_SUBJECTS = [{"name":"Sachunterricht","icon":"Su","color":"#dff0f4","ink":"#336278","hint":"Natur und Alltag"},{"name":"Gesellschaftslehre","icon":"GL","color":"#e5e4f4","ink":"#574b86","hint":"Geschichte und Zusammenleben"},{"name":"Geschichte","icon":"Ge","color":"#f0dfca","ink":"#79542f","hint":"Vergangenheit erforschen"},{"name":"Kunst","icon":"Ku","color":"#f6dfdd","ink":"#97453e","hint":"Farben und Gestaltung"},{"name":"Musik","icon":"Mu","color":"#e9daf6","ink":"#68429b","hint":"Rhythmus und Klang"},{"name":"Sport","icon":"Sp","color":"#d5eee5","ink":"#28634e","hint":"Bewegung und Gesundheit"},{"name":"Praktische Philosophie","icon":"Pp","color":"#e8e8d3","ink":"#566038","hint":"Werte und Fragen"},{"name":"Religion","icon":"Re","color":"#e2e9f4","ink":"#426084","hint":"Religion und Vielfalt"},{"name":"Technik","icon":"Te","color":"#e3e3e3","ink":"#4a5560","hint":"Werkstoffe und Bauen"},{"name":"Arbeitslehre","icon":"Al","color":"#f3e3cc","ink":"#765324","hint":"Arbeit und Praxis"},{"name":"Wirtschaft","icon":"Wi","color":"#dbe7d2","ink":"#4d6b33","hint":"Geld und Konsum"},{"name":"Hauswirtschaft","icon":"Hw","color":"#f0e2e4","ink":"#804956","hint":"Alltag und Ernährung"},{"name":"Darstellen und Gestalten","icon":"DG","color":"#f2dff0","ink":"#763d73","hint":"Theater und Ausdruck"},{"name":"Französisch","icon":"Fr","color":"#dbe5f6","ink":"#375d8c","hint":"Sprache und Alltag"},{"name":"Spanisch","icon":"Es","color":"#f6e5d0","ink":"#885d2f","hint":"Spanisch lernen"},{"name":"Latein","icon":"La","color":"#e6e2f2","ink":"#625687","hint":"Sprache und Grammatik"}];
for (const s of NRW_SUBJECTS) if(!SUBJECTS.some(t=>t.name===s.name))SUBJECTS.push(s);
const fixOriginalSubjects=subjects;
subjects=function(){
 fixOriginalSubjects();
 document.querySelectorAll('.subject-card').forEach(b=>{
   const n=LESSONS.filter(l=>l.subject===b.dataset.subject && l.grade===state.grade).length;
   const total=LESSONS.filter(l=>l.subject===b.dataset.subject).length;
   const caption=b.querySelector('small');
   if(caption)caption.textContent=n?`${n} ${n===1?'Thema':'Themen'} in Klasse ${state.grade}`:total?'Themen anderer Klassen ansehen':'Inhalte in Vorbereitung';
   b.title=b.dataset.subject+' – '+(n?`${n} Themen in Klasse ${state.grade}`:total?'Themen in anderen Klassen':'Inhalte in Vorbereitung');
 });
};
const fixOriginalRenderHome=renderHome;
renderHome=function(){
 const noClassTopics=state.subject&&!LESSONS.some(l=>l.subject===state.subject&&l.grade===state.grade);
 if(noClassTopics)state.all=true;
 fixOriginalRenderHome();
 const n=state.subject?LESSONS.filter(l=>l.subject===state.subject).length:0;
 const el=document.getElementById('fix-subject-notice');
 if(el)el.textContent=noClassTopics?(n?`Für ${state.subject} gibt es in Klasse ${state.grade} noch kein eigenes Thema. Deshalb werden die Themen anderer Klassen angezeigt.`:`Die Inhalte für ${state.subject} werden ergänzt. Du kannst ein anderes Fach wählen.`):'';
};
renderHome();

