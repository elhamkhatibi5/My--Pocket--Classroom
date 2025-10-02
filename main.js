// ---------- داده اولیه ----------
let capsules = JSON.parse(localStorage.getItem('pc_capsules')) || [];

if(capsules.length === 0){
  capsules = [
    {id:'1',title:'Math Basics',subject:'Math',level:'Beginner',updatedAt:'2025-10-02', notes:['Numbers','Add/Subtract'], flashcards:[{front:'1+1',back:'2'}], quiz:[{question:'2+2=?',options:['2','3','4','5'],correctIndex:2}]},
    {id:'2',title:'History 101',subject:'History',level:'Intermediate',updatedAt:'2025-10-01', notes:['Ancient Rome','Medieval'], flashcards:[{front:'Caesar',back:'Roman Leader'}], quiz:[{question:'Who was Caesar?',options:['King','Leader','Soldier','Philosopher'],correctIndex:1}]}
  ];
  localStorage.setItem('pc_capsules', JSON.stringify(capsules));
}

// ---------- نمایش بخش‌ها ----------
function showSection(sectionId){
  document.getElementById('library').classList.add('d-none');
  document.getElementById('author').classList.add('d-none');
  document.getElementById('learn').classList.add('d-none');
  document.getElementById(sectionId).classList.remove('d-none');
}

// ---------- Dark Mode ----------
const darkToggle = document.getElementById('darkModeToggle');
darkToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});
if(localStorage.getItem('darkMode')==='true') document.body.classList.add('dark-mode');

// ---------- Navbar ----------
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

// ---------- Library ----------
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
          <p>${c.subject} | Updated: ${c.updatedAt.split('T')[0]}</p>
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

// ---------- Library Actions ----------
function openLearn(id){
  showSection('learn');
  const capsule = capsules.find(c => c.id===id);
  const learnEl = document.getElementById('learn');
  learnEl.innerHTML = `<h2>${capsule.title}</h2>`;

  // Notes
  if(capsule.notes.length){
    const notesDiv = document.createElement('div');
    notesDiv.className='mb-3';
    notesDiv.innerHTML = `<h4>Notes</h4><ul>${capsule.notes.map(n=>`<li>${n}</li>`).join('')}</ul>`;
    learnEl.appendChild(notesDiv);
  }

  // Flashcards
  if(capsule.flashcards.length){
    let currentIndex = 0;
    const flashDiv = document.createElement('div');
    flashDiv.className='mb-3';
    const cardDiv = document.createElement('div');
    cardDiv.className='card p-3 mb-2 shadow-sm text-center';
    cardDiv.style.cursor='pointer';
    cardDiv.innerText = capsule.flashcards[currentIndex].front;

    cardDiv.addEventListener('click', ()=>{
      const f = capsule.flashcards[currentIndex];
      cardDiv.innerText = cardDiv.innerText===f.front ? f.back : f.front;
    });

    const prevBtn = document.createElement('button');
    prevBtn.className='btn btn-secondary btn-sm me-1';
    prevBtn.innerText='Prev';
    prevBtn.onclick = ()=>{ if(currentIndex>0) { currentIndex--; cardDiv.innerText = capsule.flashcards[currentIndex].front; }};

    const nextBtn = document.createElement('button');
    nextBtn.className='btn btn-secondary btn-sm';
    nextBtn.innerText='Next';
    nextBtn.onclick = ()=>{ if(currentIndex<capsule.flashcards.length-1) { currentIndex++; cardDiv.innerText = capsule.flashcards[currentIndex].front; }};

    flashDiv.appendChild(cardDiv);
    flashDiv.appendChild(prevBtn);
    flashDiv.appendChild(nextBtn);
    learnEl.appendChild(flashDiv);
  }

  // Quiz
  if(capsule.quiz.length){
    let qIndex=0;
    const quizDiv = document.createElement('div');
    quizDiv.className='mb-3';
    const renderQuestion = ()=>{
      quizDiv.innerHTML='';
      const q = capsule.quiz[qIndex];
      const qCard = document.createElement('div');
      qCard.className='card p-3 mb-2 shadow-sm';
      qCard.innerHTML = `<h5>${q.question}</h5>`;
      q.options.forEach((opt,i)=>{
        const btn = document.createElement('button');
        btn.className='btn btn-outline-primary btn-sm m-1';
        btn.innerText=opt;
        btn.onclick = ()=>{
          if(i===q.correctIndex) btn.className='btn btn-success btn-sm m-1';
          else btn.className='btn btn-danger btn-sm m-1';
          setTimeout(()=>{
            qIndex++;
            if(qIndex<capsule.quiz.length) renderQuestion();
            else quizDiv.innerHTML='<p>Quiz Finished!</p>';
          },500);
        };
        qCard.appendChild(btn);
      });
      quizDiv.appendChild(qCard);
    };
    renderQuestion();
    learnEl.appendChild(quizDiv);
  }
}

function openEdit(id){
  showSection('author');
  const capsule = capsules.find(c => c.id===id);
  document.getElementById('titleInput').value = capsule.title;
  document.getElementById('subjectInput').value = capsule.subject;
  document.getElementById('levelInput').value = capsule.level;

  // پاک کردن و بارگذاری flashcards
  flashcardsEditor.innerHTML = '';
  capsule.flashcards.forEach(fc=>{
    const div = document.createElement('div');
    div.className='mb-2';
    div.innerHTML = `<input class="form-control mb-1 frontInput" value="${fc.front}">
                     <input class="form-control mb-1 backInput" value="${fc.back}">
                     <button type="button" class="btn btn-danger btn-sm removeFlashcard">Remove</button>`;
    flashcardsEditor.appendChild(div);
    div.querySelector('.removeFlashcard').addEventListener('click',()=>div.remove());
  });

  // پاک کردن و بارگذاری quiz
  quizEditor.innerHTML='';
  capsule.quiz.forEach(q=>{
    const div = document.createElement('div');
    div.className='mb-3 border p-2';
    div.innerHTML = `<input type="text" class="form-control mb-1 questionInput" value="${q.question}">
                     <input type="text" class="form-control mb-1 opt0" value="${q.options[0]}">
                     <input type="text" class="form-control mb-1 opt1" value="${q.options[1]}">
                     <input type="text" class="form-control mb-1 opt2" value="${q.options[2]}">
                     <input type="text" class="form-control mb-1 opt3" value="${q.options[3]}">
                     <select class="form-select mb-1 correctIndex">
                       <option value="0" ${q.correctIndex===0?'selected':''}>Correct: A</option>
                       <option value="1" ${q.correctIndex===1?'selected':''}>Correct: B</option>
                       <option value="2" ${q.correctIndex===2?'selected':''}>
