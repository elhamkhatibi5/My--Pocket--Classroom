document.addEventListener('DOMContentLoaded', () => {

  // ======== Data ========
  let notes = JSON.parse(localStorage.getItem('pocket_notes')) || [];
  let flashcards = JSON.parse(localStorage.getItem('pocket_flashcards')) || [];
  let quiz = JSON.parse(localStorage.getItem('pocket_quiz')) || [];

  function saveAll() {
    localStorage.setItem('pocket_notes', JSON.stringify(notes));
    localStorage.setItem('pocket_flashcards', JSON.stringify(flashcards));
    localStorage.setItem('pocket_quiz', JSON.stringify(quiz));
  }

  // ======== Tabs ========
  const tabs = document.querySelectorAll('#tabs .nav-link');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('d-none'));
      document.getElementById(tab.dataset.tab + 'Tab').classList.remove('d-none');
      if(tab.dataset.tab === 'learn') renderLearn();
    });
  });

  // ======== Notes ========
  const notesContainer = document.getElementById('notesContainer');

  function renderNotes() {
    notesContainer.innerHTML = '';
    notes.forEach(note => {
      const div = document.createElement('div');
      div.className = 'col-md-4';
      div.innerHTML = `
        <div class="card p-2">
          <div class="d-flex justify-content-between align-items-center">
            <span>${note.title}</span>
            <div>
              <button class="btn btn-sm btn-primary editBtn">Edit</button>
              <button class="btn btn-sm btn-danger deleteBtn">Delete</button>
            </div>
          </div>
        </div>
      `;
      const card = div.querySelector('.card');

      div.querySelector('.editBtn').addEventListener('click', e => {
        e.stopPropagation();
        const newTitle = prompt('Edit note:', note.title);
        if(newTitle){ note.title = newTitle; saveAll(); renderNotes(); }
      });

      div.querySelector('.deleteBtn').addEventListener('click', e => {
        e.stopPropagation();
        notes = notes.filter(n => n.id !== note.id); saveAll(); renderNotes();
      });

      card.addEventListener('click', () => alert(`Note: ${note.title}`));
      notesContainer.appendChild(div);
    });
  }

  document.getElementById('addNoteBtn').addEventListener('click', () => {
    const val = document.getElementById('newNote').value.trim();
    if(!val) return alert('Please enter a note!');
    notes.push({id: Date.now(), title: val});
    saveAll();
    renderNotes();
    document.getElementById('newNote').value='';
  });

  renderNotes();

  // ======== Flashcards ========
  const flashcardsContainer = document.getElementById('flashcardsContainer');

  function renderFlashcards() {
    flashcardsContainer.innerHTML = '';
    flashcards.forEach(fc => {
      const div = document.createElement('div');
      div.className = 'col-md-4';
      div.innerHTML = `
        <div class="card p-2">
          <div><strong>${fc.front}</strong> - ${fc.back}</div>
          <div class="mt-1">
            <button class="btn btn-sm btn-primary editBtn">Edit</button>
            <button class="btn btn-sm btn-danger deleteBtn">Delete</button>
          </div>
        </div>
      `;
      const card = div.querySelector('.card');

      div.querySelector('.editBtn').addEventListener('click', e => {
        e.stopPropagation();
        const newFront = prompt('Front:', fc.front);
        const newBack = prompt('Back:', fc.back);
        if(newFront && newBack){ fc.front = newFront; fc.back = newBack; saveAll(); renderFlashcards(); }
      });

      div.querySelector('.deleteBtn').addEventListener('click', e => {
        e.stopPropagation();
        flashcards = flashcards.filter(f => f.id !== fc.id); saveAll(); renderFlashcards();
      });

      card.addEventListener('click', () => alert(`Flashcard: ${fc.front} - ${fc.back}`));
      flashcardsContainer.appendChild(div);
    });
  }

  document.getElementById('addFlashcardBtn').addEventListener('click', () => {
    const front = document.getElementById('newFront').value.trim();
    const back = document.getElementById('newBack').value.trim();
    if(!front || !back) return alert('Please enter both Front and Back!');
    flashcards.push({id: Date.now(), front, back});
    saveAll();
    renderFlashcards();
    document.getElementById('newFront').value='';
    document.getElementById('newBack').value='';
  });

  renderFlashcards();

  // ======== Quiz ========
  const quizContainer = document.getElementById('quizContainer');

  function renderQuiz() {
    quizContainer.innerHTML = '';
    quiz.forEach(q => {
      const div = document.createElement('div');
      div.className = 'col-md-4';
      div.innerHTML = `
        <div class="card p-2">
          <div><strong>${q.question}</strong> - ${q.answer}</div>
          <div class="mt-1">
            <button class="btn btn-sm btn-primary editBtn">Edit</button>
            <button class="btn btn-sm btn-danger deleteBtn">Delete</button>
          </div>
        </div>
      `;
      const card = div.querySelector('.card');

      div.querySelector('.editBtn').addEventListener('click', e => {
        e.stopPropagation();
        const newQ = prompt('Question:', q.question);
        const newA = prompt('Answer:', q.answer);
        if(newQ && newA){ q.question=newQ; q.answer=newA; saveAll(); renderQuiz(); }
      });

      div.querySelector('.deleteBtn').addEventListener('click', e => {
        e.stopPropagation();
        quiz = quiz.filter(qq => qq.id !== q.id); saveAll(); renderQuiz();
      });

      card.addEventListener('click', () => alert(`Quiz: ${q.question} - ${q.answer}`));
      quizContainer.appendChild(div);
    });
  }

  document.getElementById('addQuizBtn').addEventListener('click', () => {
    const question = document.getElementById('newQuestion').value.trim();
    const answer = document.getElementById('newAnswer').value.trim();
    if(!question || !answer) return alert('Please enter both Question and Answer!');
    quiz.push({id: Date.now(), question, answer});
    saveAll();
    renderQuiz();
    document.getElementById('newQuestion').value='';
    document.getElementById('newAnswer').value='';
  });

  renderQuiz();

  // ======== Learn Mode ========
  const learnContainer = document.getElementById('learnContainer');

  function renderLearn() {
    learnContainer.innerHTML='<h5>Notes</h5>';
    notes.forEach(n => { const div=document.createElement('div'); div.textContent=n.title; div.className='card p-2 mb-1'; learnContainer.appendChild(div); });

    learnContainer.innerHTML+='<h5 class="mt-3">Flashcards</h5>';
    flashcards.forEach(f => { const div=document.createElement('div'); div.textContent=`${f.front} - ${f.back}`; div.className='card p-2 mb-1'; learnContainer.appendChild(div); });

    learnContainer.innerHTML+='<h5 class="mt-3">Quiz</h5>';
    quiz.forEach(q => { const div=document.createElement('div'); div.textContent=`${q.question} - ${q.answer}`; div.className='card p-2 mb-1'; learnContainer.appendChild(div); });
  }

  // ======== Export / Import ========
  document.getElementById('exportBtn').addEventListener('click', () => {
    const data = JSON.stringify({notes, flashcards, quiz}, null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='pocket_classroom.json'; a.click(); URL.revokeObjectURL(url);
  });

  document.getElementById('importBtn').addEventListener('click',()=>document.getElementById('importFile').click());
  document.getElementById('importFile').addEventListener('change', e=>{
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = function(evt){
      try{
        const data = JSON.parse(evt.target.result);
        notes=data.notes||[]; flashcards=data.flashcards||[]; quiz=data.quiz||[];
        saveAll(); renderNotes(); renderFlashcards(); renderQuiz(); alert('Import successful!');
      }catch(err){ alert('Invalid JSON file'); }
    };
    reader.readAsText(file);
  });

});
