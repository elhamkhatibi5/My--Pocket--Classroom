// نمونه داده اولیه
let capsules = JSON.parse(localStorage.getItem('pc_capsules')) || [];

if(capsules.length === 0){
  capsules = [
    {id:'1',title:'Math Basics',subject:'Math',level:'Beginner',updatedAt:'2025-10-02', notes:[], flashcards:[], quiz:[]},
    {id:'2',title:'History 101',subject:'History',level:'Intermediate',updatedAt:'2025-10-01', notes:[], flashcards:[], quiz:[]}
  ];
  localStorage.setItem('pc_capsules', JSON.stringify(capsules));
}

// تابع نمایش بخش‌ها
function showSection(sectionId){
  document.getElementById('library').classList.add('d-none');
  document.getElementById('author').classList.add('d-none');
  document.getElementById('learn').classList.add('d-none');
  document.getElementById(sectionId).classList.remove('d-none');
}

// Dark Mode
const darkToggle = document.getElementById('darkModeToggle');
darkToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});
if(localStorage.getItem('darkMode')==='true') document.body.classList.add('dark-mode');

// Navbar
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('libraryNav').addEventListener('click', e=>{
    e.preventDefault();
    showSection('library');
    renderLibrary();
  });
  document.getElementById('authorNav').addEventListener('click', e=>{
    e.preventDefault();
    showSection('author');
  });
  document.getElementById('learnNav').addEventListener('click', e=>{
    e.preventDefault();
    showSection('learn');
  });

  renderLibrary();
});

// رندر Library واقعی
function renderLibrary(){
  const libraryEl = document.getElementById('library');
  libraryEl.innerHTML = '';
  capsules.forEach(c => {
    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
      <div class="card mb-3 p-2 shadow-sm">
        <div class="card-body">
          <h5>${c.title} <span class="badge bg-primary">${c.level}</span></h5>
          <p>${c.subject} | Updated: ${c.updatedAt}</p>
          <div class="d-flex justify-content-between flex-wrap">
            <button class="btn btn-success btn-sm mb-1" onclick="openLearn('${c.id}')"><i class="bi bi-book"></i> Learn</button>
            <button class="btn btn-warning btn-sm mb-1" onclick="openEdit('${c.id}')"><i class="bi bi-pencil-square"></i> Edit</button>
            <button class="btn btn-info btn-sm mb-1" onclick="exportCapsule('${c.id}')"><i class="bi bi-box-arrow-up-right"></i> Export</button>
            <button class="btn btn-danger btn-sm mb-1" onclick="deleteCapsule('${c.id}')"><i class="bi bi-trash"></i> Delete</button>
          </div>
        </div>
      </div>
    `;
    libraryEl.appendChild(card);
  });
}

// دکمه‌های Library
function openLearn(id){
  showSection('learn');
  const capsule = capsules.find(c => c.id===id);
  document.getElementById('learn').innerHTML = `<h2>${capsule.title}</h2><p>Learn Mode content coming soon...</p>`;
}

function openEdit(id){
  showSection('author');
  const capsule = capsules.find(c => c.id===id);
  document.getElementById('titleInput').value = capsule.title;
  document.getElementById('subjectInput').value = capsule.subject;
  document.getElementById('levelInput').value = capsule.level;
}

function exportCapsule(id){
  const capsule = capsules.find(c => c.id===id);
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(capsule,null,2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", capsule.title+".json");
  dlAnchor.click();
}

function deleteCapsule(id){
  if(!confirm('Delete this capsule?')) return;
  capsules = capsules.filter(c => c.id!==id);
  localStorage.setItem('pc_capsules', JSON.stringify(capsules));
  renderLibrary();
}

// Author Mode: ذخیره Capsule جدید
const authorForm = document.getElementById('authorForm');
authorForm.addEventListener('submit', e=>{
  e.preventDefault();
  const title = document.getElementById('titleInput').value;
  const subject = document.getElementById('subjectInput').value;
  const level = document.getElementById('levelInput').value;

  const newCapsule = { id: Date.now().toString(), title, subject, level, updatedAt: new Date().toISOString(), notes: [], flashcards: [], quiz: [] };
  capsules.push(newCapsule);
  localStorage.setItem('pc_capsules', JSON.stringify(capsules));
  renderLibrary();
  showSection('library');
});
