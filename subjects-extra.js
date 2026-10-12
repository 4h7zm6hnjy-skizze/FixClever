/* Zusätzliche Fachnavigation; nach app.js laden. */
SUBJECTS.push(
{name:'Biologie',icon:'Bio',color:'#d4ead8',ink:'#236142',hint:'Lebewesen & Natur'},
{name:'Chemie',icon:'Ch',color:'#f5dfc5',ink:'#805628',hint:'Stoffe & Reaktionen'},
{name:'Physik',icon:'Ph',color:'#d9e6fa',ink:'#315b91',hint:'Kräfte & Energie'},
{name:'Informatik',icon:'IT',color:'#e8dff6',ink:'#5c4588',hint:'Algorithmen & Daten'}
);
const originalSubjects=subjects;
subjects=function(){originalSubjects();document.querySelectorAll('.subject-card').forEach(b=>{let count=LESSONS.filter(l=>l.subject===b.dataset.subject&&l.grade===state.grade).length;let label=b.querySelector('small');if(label)label.textContent=count+' Erklärungen';});};
subjects();
