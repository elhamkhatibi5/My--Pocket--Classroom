
import { saveCapsule, loadIndex } from './storage.js';

if(loadIndex().length === 0){
  const sample = {
    "schema": "pocket-classroom/v1",
    "id": "sample_math_1",
    "meta": {
      "title": "Math Capsule – Addition & Subtraction",
      "subject": "Mathematics",
      "level": "Beginner",
      "description": "Practice basic addition and subtraction"
    },
    "notes": [
      "Addition is combining numbers: 2 + 3 = 5.",
      "Subtraction is taking away: 5 - 2 = 3.",
      "Zero is the identity for addition: n + 0 = n."
    ],
    "flashcards": [
      { "front": "3 + 4", "back": "7" },
      { "front": "5 - 2", "back": "3" },
      { "front": "10 + 0", "back": "10" },
      { "front": "7 - 7", "back": "0" }
    ],
    "quiz": [
      {
        "question": "What is 4 + 3?",
        "choices": ["5", "6", "7", "8"],
        "answer": 2,
        "explanation": "4 + 3 = 7"
      },
      {
        "question": "What is 9 - 6?",
        "choices": ["2", "3", "4", "5"],
        "answer": 1,
        "explanation": "9 - 6 = 3"
      },
      {
        "question": "What is the result of 10 + 0?",
        "choices": ["0", "10", "20", "1"],
        "answer": 1,
        "explanation": "Zero doesn’t change a number in addition"
      }
    ],
    "updatedAt": new Date().toISOString()
  };
  saveCapsule(sample);
}


document.addEventListener('DOMContentLoaded', () => {

  let capsules = JSON.parse(localStorage.getItem('pocket_capsules')) || [];

  function saveAll() {
    localStorage.setItem('pocket_capsules', JSON.stringify(capsules));
  }

  // ===== Tabs =====
  const tabs = document.querySelectorAll('#tabs .nav-link');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('d-none'));
      document.getElementById(tab.dataset.tab + 'Tab').classList.remove('d-none');
      if(tab.dataset.tab === 'learn') renderLearn();
      if(tab.dataset.tab === 'library') renderLibrary();
    });
  });

  // ===== Library =====
  const libraryContainer = document.getElementById('libraryContainer');

  function renderLibrary() {
    libraryContainer.innerHTML = '';
    capsules.forEach(cap => {
      const div = document.createElement('div');
      div.className = 'capsule-row';
      div.innerHTML = `
        <div>
          <strong>${cap.title}</strong> | ${cap.subject} | ${cap.level} | Updated: ${cap.updatedAt}
        </div>
        <div>
          <button class="btn btn-sm btn-primary editBtn">Edit</button>
          <button class="btn btn-sm btn-danger deleteBtn">Delete</button>
          <button class="btn btn-sm btn-success learnBtn">Learn</button>
          <button class="btn btn-sm btn-warning exportBtn">Export</button>
        </div>
      `;

      div.querySelector('.editBtn').addEventListener('click', e => {
        e.stopPropagation();
        const newTitle = prompt('Title:', cap.title);
        const newSubject = prompt('Subject:', cap.subject);
        const newLevel = prompt('Level:', cap.level);
        if(newTitle && newSubject && newLevel){
          cap.title = newTitle; cap.subject = newSubject; cap.level = newLevel;
          cap.updatedAt = new Date().toISOString().split('T')[0];
          saveAll(); renderLibrary();
        }
      });

      div.querySelector('.deleteBtn').addEventListener('click', e => {
        e.stopPropagation();
        capsules = capsules.filter(c => c.id !== cap.id);
        saveAll(); renderLibrary();
      });

      div.querySelector('.learnBtn').addEventListener('click', e => {
        e.stopPropagation();
        alert(`Learn Capsule: ${cap.title}`);
      });

      div.querySelector('.exportBtn').addEventListener('click', e => {
        e.stopPropagation();
        const data = JSON.stringify(cap, null, 2);
        const blob = new Blob([data], {type:'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href=url; a.download=cap.title+'.json'; a.click();
        URL.revokeObjectURL(url);
      });

      libraryContainer.appendChild(div);
    });
  }

  renderLibrary();

  // ===== Author =====
  document.getElementById('addCapsuleBtn').addEventListener('click', () => {
    const title = document.getElementById('capsuleTitle').value.trim();
    const subject = document.getElementById('capsuleSubject').value.trim();
    const level = document.getElementById('capsuleLevel').value;
    if(!title || !subject) return alert('Please fill Title and Subject');
    capsules.push({id: Date.now(), title, subject, level, updatedAt: new Date().toISOString().split('T')[0], notes: [], flashcards: [], quiz: []});
    saveAll(); renderLibrary();
    document.getElementById('capsuleTitle').value=''; document.getElementById('capsuleSubject').value='';
  });

  // ===== Learn =====
  const learnContainer = document.getElementById('learnContainer');
  function renderLearn() {
    learnContainer.innerHTML = '';
    capsules.forEach(cap => {
      const div = document.createElement('div');
      div.className = 'card p-2 mb-2';
      div.innerHTML = `<strong>${cap.title}</strong> | Notes: ${cap.notes.length} | Flashcards: ${cap.flashcards.length} | Quiz: ${cap.quiz.length}`;
      learnContainer.appendChild(div);
    });
  }

  // ===== Export / Import =====
  document.getElementById('exportBtn').addEventListener('click', () => {
    const data = JSON.stringify(capsules, null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='pocket_classroom.json'; a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('importBtn').addEventListener('click',()=>document.getElementById('importFile').click());
  document.getElementById('importFile').addEventListener('change', e=>{
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = function(evt){
      try{
        const data = JSON.parse(evt.target.result);
        capsules = data;
        saveAll(); renderLibrary(); alert('Import successful!');
      }catch(err){ alert('Invalid JSON'); }
    };
    reader.readAsText(file);
  });

});
