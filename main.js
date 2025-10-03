// ---------- داده اولیه ----------
let capsules = JSON.parse(localStorage.getItem('pc_capsules')) || [];

if (capsules.length === 0) {
  capsules.push({
    id: '1',
    title: 'Sample Capsule',
    subject: 'Demo',
    level: 'Beginner',
    updatedAt: new Date().toISOString(),
    notes: ['Note 1', 'Note 2'],
    flashcards: [{ front: 'Q1', back: 'A1' }],
    quiz: [{ question: 'Q?', options: ['A', 'B', 'C', 'D'], correctIndex: 0 }]
  });
  localStorage.setItem('pc_capsules', JSON.stringify(capsules));
}

// ---------- نمایش بخش‌ها ----------
function showSection(sectionId) {
  document.getElementById('library').classList.add('d-none');
  document.getElementById('author').classList.add('d-none');
  document.getElementById('learn').classList.add('d-none');
  document.getElementById(sectionId).classList.remove('d-none');
}

// ---------- Dark Mode ----------
const darkToggle = document.getElementById('darkModeToggle');
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});
if (localStorage.getItem('darkMode') === 'true')
  document.body.classList.add('dark-mode');

// ---------- Navbar ----------
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('libraryNav').addEventListener('click', e => {
    e.preventDefault();
    showSection('library');
    renderLibrary();
  });

  document.getElementById('authorNav').addEventListener('click', e => {
    e.preventDefault();
    showSection('author');
  });

  document.getElementById('learnNav').addEventListener('click', e => {
    e.preventDefault();
    showSection('learn');
  });

  renderLibrary();
});

// ---------- Library ----------
function renderLibrary() {
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
            <button class="btn btn-success btn-sm mb-1" onclick="openLearn('${c.id}')">Learn</button>
            <button class="btn btn-warning btn-sm mb-1" onclick="openEdit('${c.id}')">Edit</button>
            <button class="btn btn-info btn-sm mb-1" onclick="exportCapsule('${c.id}')">Export</button>
            <button class="btn btn-danger btn-sm mb-1" onclick="deleteCapsule('${c.id}')">Delete</button>
          </div>
        </div>
      </div>
    `;
    libraryEl.appendChild(card);
  });
}

// ---------- Library Actions ----------
function openLearn(id) {
  showSection('learn');
  const capsule = capsules.find(c => c.id === id);
  const learnEl = document.getElementById('learn');
  learnEl.innerHTML = `<h2>${capsule.title}</h2>`;

  // Notes
  if (capsule.notes.length) {
    const notesDiv = document.createElement('div');
    notesDiv.className = 'mb-3';
    notesDiv.innerHTML = `<h4>Notes</h4><ul>${capsule.notes.map(n => `<li>${n}</li>`).join('')}</ul>`;
    learnEl.appendChild(notesDiv);
  }

  // Flashcards
  if (capsule.flashcards.length) {
    let currentIndex = 0;
    const flashDiv = document.createElement('div');
    flashDiv.className = 'mb-3';
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card p-3 mb-2 shadow-sm text-center';
    cardDiv.style.cursor = 'pointer';
    cardDiv.innerText = capsule.flashcards[currentIndex].front;

    cardDiv.addEventListener('click', () => {
      const f = capsule.flashcards[currentIndex];
      cardDiv.innerText = cardDiv.innerText === f.front ? f.back : f.front;
    });

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-secondary btn-sm me-1';
    prevBtn.innerText = 'Prev';
    prevBtn.onclick = () => {
      if (currentIndex > 0) {
        currentIndex--;
        cardDiv.innerText = capsule.flashcards[currentIndex].front;
      }
    };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-secondary btn-sm';
    nextBtn.innerText = 'Next';
    nextBtn.onclick = () => {
      if (currentIndex < capsule.flashcards.length - 1) {
        currentIndex++;
        cardDiv.innerText = capsule.flashcards[currentIndex].front;
      }
    };

    flashDiv.appendChild(cardDiv);
    flashDiv.appendChild(prevBtn);
    flashDiv.appendChild(nextBtn);
    learnEl.appendChild(flashDiv);
  }

  // Quiz
  if (capsule.quiz.length) {
    let qIndex = 0;
    const quizDiv = document.createElement('div');
    quizDiv.className = 'mb-3';
    const renderQuestion = () => {
      quizDiv.innerHTML = '';
      const q = capsule.quiz[qIndex];
      const qCard = document.createElement('div');
      qCard.className = 'card p-3 mb-2 shadow-sm';
      qCard.innerHTML = `<h5>${q.question}</h5>`;
      q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary btn-sm m-1';
        btn.innerText = opt;
        btn.onclick = () => {
          if (i === q.correctIndex) btn.className = 'btn btn-success btn-sm m-1';
          else btn.className = 'btn btn-danger btn-sm m-1';
          setTimeout(() => {
            qIndex++;
            if (qIndex < capsule.quiz.length) renderQuestion();
            else quizDiv.innerHTML = '<p>Quiz Finished!</p>';
          }, 500);
        };
        qCard.appendChild(btn);
      });
      quizDiv.appendChild(qCard);
    };
    renderQuestion();
    learnEl.appendChild(quizDiv);
  }
}

// ---------- Author Mode ----------
const flashcardsEditor = document.getElementById('flashcardsEditor');
const addFlashcardBtn = document.getElementById('addFlashcardBtn');
addFlashcardBtn.addEventListener('click', () => {
  const div = document.createElement('div');
  div.className = 'mb-2';
  div.innerHTML = `
    <input type="text" placeholder="Front" class="form-control mb-1 frontInput">
    <input type="text" placeholder="Back" class="form-control mb-1 backInput">
    <button type="button" class="btn btn-danger btn-sm removeFlashcard">Remove</button>
  `;
  flashcardsEditor.appendChild(div);
  div.querySelector('.removeFlashcard').addEventListener('click', () => div.remove());
});

const quizEditor = document.getElementById('quizEditor');
const addQuizBtn = document.getElementById('addQuizBtn');
addQuizBtn.addEventListener('click', () => {
  const div = document.createElement('div');
  div.className = 'mb-3 border p-2';
  div.innerHTML = `
    <input type="text" placeholder="Question" class="form-control mb-1 questionInput">
    <input type="text" placeholder="Option A" class="form-control mb-1 opt0">
    <input type="text" placeholder="Option B" class="form-control mb-1 opt1">
    <input type="text" placeholder="Option C" class="form-control mb-1 opt2">
    <input type="text" placeholder="Option D" class="form-control mb-1 opt3">
    <select class="form-select mb-1 correctIndex">
      <option value="0">Correct: A</option>
      <option value="1">Correct: B</option>
      <option value="2">Correct: C</option>
      <option value="3">Correct: D</option>
    </select>
    <button type="button" class="btn btn-danger btn-sm removeQuestion">Remove</button>
  `;
  quizEditor.appendChild(div);
  div.querySelector('.removeQuestion').addEventListener('click', () => div.remove());
});

// ---------- Save Capsule ----------
document.getElementById('authorForm').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('titleInput').value;
  const subject = document.getElementById('subjectInput').value;
  const level = document.getElementById('levelInput').value;

  const flashcards = Array.from(flashcardsEditor.children).map(div => ({
    front: div.querySelector('.frontInput').value,
    back: div.querySelector('.backInput').value
  })).filter(f => f.front && f.back);

  const quiz = Array.from(quizEditor.children).map(div => ({
    question: div.querySelector('.questionInput').value,
    options: [
      div.querySelector('.opt0').value,
      div.querySelector('.opt1').value,
      div.querySelector('.opt2').value,
      div.querySelector('.opt3').value
    ],
    correctIndex: parseInt(div.querySelector('.correctIndex').value)
  })).filter(q => q.question && q.options.every(o => o));

  const newCapsule = {
    id: Date.now().toString(),
    title, subject, level,
    updatedAt: new Date().toISOString(),
    notes: [],
    flashcards,
    quiz
  };

  capsules.push(newCapsule);
  localStorage.setItem('pc_capsules', JSON.stringify(capsules));
  renderLibrary();
  showSection('library');
});
    cardDiv.addEventListener('click', () => {
      const f = capsule.flashcards[currentIndex];
      cardDiv.innerText = cardDiv.innerText === f.front ? f.back : f.front;
    });

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-secondary btn-sm me-1';
    prevBtn.innerText = 'Prev';
    prevBtn.onclick = () => {
      if (currentIndex > 0) {
        currentIndex--;
        cardDiv.innerText = capsule.flashcards[currentIndex].front;
      }
    };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-secondary btn-sm';
    nextBtn.innerText = 'Next';
    nextBtn.onclick = () => {
      if (currentIndex < capsule.flashcards.length - 1) {
        currentIndex++;
        cardDiv.innerText = capsule.flashcards[currentIndex].front;
      }
    };

    flashDiv.appendChild(cardDiv);
    flashDiv.appendChild(prevBtn);
    flashDiv.appendChild(nextBtn);
    learnEl.appendChild(flashDiv);
  }

  // Quiz
  if (capsule.quiz.length) {
    let qIndex = 0;
    const quizDiv = document.createElement('div');
    quizDiv.className = 'mb-3';

    const renderQuestion = () => {
      quizDiv.innerHTML = '';
      const q = capsule.quiz[qIndex];
      const qCard = document.createElement('div');
      qCard.className = 'card p-3 mb-2 shadow-sm';
      qCard.innerHTML = `<h5>${q.question}</h5>`;
      q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary btn-sm m-1';
        btn.innerText = opt;
        btn.onclick = () => {
          if (i === q.correctIndex) btn.className = 'btn btn-success btn-sm m-1';
          else btn.className = 'btn btn-danger btn-sm m-1';
          setTimeout(() => {
            qIndex++;
            if (qIndex < capsule.quiz.length) renderQuestion();
            else quizDiv.innerHTML = '<p>Quiz Finished!</p>';
          }, 500);
        };
        qCard.appendChild(btn);
      });
      quizDiv.appendChild(qCard);
    };

    renderQuestion();
    learnEl.appendChild(quizDiv);
  }
}

// ---------- Author Mode ----------
const flashcardsEditor = document.getElementById('flashcardsEditor');
document.getElementById('addFlashcardBtn').addEventListener('click', () => {
  const div = document.createElement('div');
  div.className = 'mb-2';
  div.innerHTML = `
    <input type="text" placeholder="Front" class="form-control mb-1 frontInput">
    <input type="text" placeholder="Back" class="form-control mb-1 backInput">
    <button type="button" class="btn btn-danger btn-sm removeFlashcard">Remove</button>
  `;
  flashcardsEditor.appendChild(div);
  div.querySelector('.removeFlashcard').addEventListener('click', () => div.remove());
});

const quizEditor = document.getElementById('quizEditor');
document.getElementById('addQuizBtn').addEventListener('click', () => {
  const div = document.createElement('div');
  div.className = 'mb-3 border p-2';
  div.innerHTML = `
    <input type="text" placeholder="Question" class="form-control mb-1 questionInput">
    <input type="text" placeholder="Option A" class="form-control mb-1 opt0">
    <input type="text" placeholder="Option B" class="form-control mb-1 opt1">
    <input type="text" placeholder="Option C" class="form-control mb-1 opt2">
    <input type="text" placeholder="Option D" class="form-control mb-1 opt3">
    <select class="form-select mb-1 correctIndex">
      <option value="0">Correct: A</option>
      <option value="1">Correct: B</option>
      <option value="2">Correct: C</option>
      <option value="3">Correct: D</option>
    </select>
    <button type="button" class="btn btn-danger btn-sm removeQuestion">Remove</button>
  `;
  quizEditor.appendChild(div);
  div.querySelector('.removeQuestion').addEventListener('click', () => div.remove());
});

// ---------- Save Capsule ----------
document.getElementById('authorForm').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('titleInput').value;
  const subject = document.getElementById('subjectInput').value;
  const level = document.getElementById('levelInput').value;

  const flashcards = Array.from(flashcardsEditor.children).map(div => ({
    front: div.querySelector('.frontInput').value,
    back: div.querySelector('.backInput').value
  })).filter(f => f.front && f.back);

  const quiz = Array.from(quizEditor.children).map(div => ({
    question: div.querySelector('.questionInput').value,
    options: [
      div.querySelector('.opt0').value,
      div.querySelector('.opt1').value,
      div.querySelector('.opt2').value,
      div.querySelector('.opt3').value
    ],
    correctIndex: parseInt(div.querySelector('.correctIndex').value)
  })).filter(q => q.question);

  const newCapsule = {
    id: Date.now().toString(),
    title,
    subject,
    level,
    updatedAt: new Date().toISOString(),
    notes: [],
    flashcards,
    quiz
  };

  capsules.push(newCapsule);
  localStorage.setItem('pc_capsules', JSON.stringify(capsules));
  renderLibrary();
  showSection('library');
});

// ---------- Edit Capsule ----------
function openEdit(id) {
  showSection('author');
  const capsule = capsules.find(c => c.id === id);
  if (!capsule) return;

  document.getElementById('titleInput').value = capsule.title;
  document.getElementById('subjectInput').value = capsule.subject;
  document.getElementById('levelInput').value = capsule.level;

  flashcardsEditor.innerHTML = '';
  capsule.flashcards.forEach(fc => {
    const div = document.createElement('div');
    div.className = 'mb-2';
    div.innerHTML = `
      <input class="form-control mb-1 frontInput" value="${fc.front}">
      <input class="form-control mb-1 backInput" value="${fc.back}">
      <button type="button" class="btn btn-danger btn-sm removeFlashcard">Remove</button>
    `;
    flashcardsEditor.appendChild(div);
    div.querySelector('.removeFlashcard').addEventListener('click', () => div.remove());
  });

  quizEditor.innerHTML = '';
  capsule.quiz.forEach(q => {
    const div = document.createElement('div');
    div.className = 'mb-3 border p-2';
    div.innerHTML = `
      <input type="text" class="form-control mb-1 questionInput" value="${q.question}">
      <input type="text" class="form-control mb-1 opt0" value="${q.options[0]}">
      <input type="text" class="form-control mb-1 opt1" value="${q.options[1]}">
      <input type="text" class="form-control mb-1 opt2" value="${q.options[2]}">
      <input type="text" class="form-control mb-1 opt3" value="${q.options[3]}">
      <select class="form-select mb-1 correctIndex">
        <option value="0" ${q.correctIndex === 0 ? 'selected' : ''}>Correct: A</option>
        <option value="1" ${q.correctIndex === 1 ? 'selected' : ''}>Correct: B</option>
        <option value="2" ${q.correctIndex === 2 ? 'selected' : ''}>Correct: C</option>
        <option value="3" ${q.correctIndex === 3 ? 'selected' : ''}>Correct: D</option>
      </select>
      <button type="button" class="btn btn-danger btn-sm removeQuestion">Remove</button>
    `;
    quizEditor.appendChild(div);
    div.querySelector('.removeQuestion').addEventListener('click', () => div.remove());
  });
}

// ---------- Delete Capsule ----------
function deleteCapsule(id) {
  if (!confirm('Are you sure you want to delete this capsule?')) return;
  capsules = capsules.filter(c => c.id !== id);
  localStorage.setItem('pc_capsules', JSON.stringify(capsules));
  renderLibrary();
}

// ---------- Export Capsule ----------
function exportCapsule(id) {
  const capsule = capsules.find(c => c.id === id);
  if (!capsule) return;

  const blob = new Blob([JSON.stringify(capsule, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${capsule.title}.json`;
  a.click();
  URL.revokeObjectURL(url);
                  }    // 🎯 Edit
    card.querySelector(".editBtn").addEventListener("click", () => {
      showSection(authorDiv);
      titleInput.value = capsule.title;
      subjectInput.value = capsule.subject;
      levelInput.value = capsule.level;
      editingCapsuleId = capsule.id;
    });

    // 🎯 Delete
    card.querySelector(".deleteBtn").addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this capsule?")) {
        deleteCapsule(capsule.id);
        renderLibrary();
      }
    });

    // 🎯 Export
    card.querySelector(".exportBtn").addEventListener("click", () => {
      exportCapsule(capsule);
    });

    libraryDiv.appendChild(card);
  });
}

// شروع از Library
renderLibrary();
