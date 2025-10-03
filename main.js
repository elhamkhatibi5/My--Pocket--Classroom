// main.js
import { saveCapsule, loadCapsules, deleteCapsule, exportCapsule } from "./utils.js";

// گرفتن المان‌ها
const libraryDiv = document.getElementById("library");
const authorDiv = document.getElementById("author");
const learnDiv = document.getElementById("learn");

const libraryNav = document.getElementById("libraryNav");
const authorNav = document.getElementById("authorNav");
const learnNav = document.getElementById("learnNav");

const authorForm = document.getElementById("authorForm");
const titleInput = document.getElementById("titleInput");
const subjectInput = document.getElementById("subjectInput");
const levelInput = document.getElementById("levelInput");

// برای ذخیره id در حالت ویرایش
let editingCapsuleId = null;

// تغییر بخش فعال
function showSection(section) {
  libraryDiv.classList.add("d-none");
  authorDiv.classList.add("d-none");
  learnDiv.classList.add("d-none");
  section.classList.remove("d-none");
}

// هدایت ناوبری
libraryNav.addEventListener("click", () => renderLibrary());
authorNav.addEventListener("click", () => {
  resetAuthorForm();
  showSection(authorDiv);
});
learnNav.addEventListener("click", () => showSection(learnDiv));

// فرم Author (ذخیره یا آپدیت)
authorForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const capsule = {
    id: editingCapsuleId ? editingCapsuleId : Date.now(),
    title: titleInput.value.trim(),
    subject: subjectInput.value.trim(),
    level: levelInput.value,
    flashcards: [], // فعلا خالی
    quiz: []        // فعلا خالی
  };

  saveCapsule(capsule, editingCapsuleId !== null);
  alert(editingCapsuleId ? "Capsule updated!" : "Capsule saved!");

  editingCapsuleId = null;
  resetAuthorForm();
  renderLibrary();
});

// ریست کردن فرم
function resetAuthorForm() {
  authorForm.reset();
  editingCapsuleId = null;
}

// رندر Library
function renderLibrary() {
  showSection(libraryDiv);
  const capsules = loadCapsules();
  libraryDiv.innerHTML = "";

  if (capsules.length === 0) {
    libraryDiv.innerHTML = `<p class="text-muted">No capsules yet. Create one in Author mode.</p>`;
    return;
  }

  capsules.forEach(capsule => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-3";

    card.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h5 class="card-title">${capsule.title}</h5>
          <p class="card-text"><strong>Subject:</strong> ${capsule.subject || "—"}</p>
          <p class="card-text"><strong>Level:</strong> ${capsule.level}</p>
          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-sm btn-primary learnBtn">Learn</button>
            <button class="btn btn-sm btn-warning editBtn">Edit</button>
            <button class="btn btn-sm btn-danger deleteBtn">Delete</button>
            <button class="btn btn-sm btn-success exportBtn">Export</button>
          </div>
        </div>
      </div>
    `;

    // 🎯 Learn
    card.querySelector(".learnBtn").addEventListener("click", () => {
      showSection(learnDiv);
      learnDiv.innerHTML = `
        <h2>${capsule.title}</h2>
        <p><strong>Subject:</strong> ${capsule.subject}</p>
        <p><strong>Level:</strong> ${capsule.level}</p>
        <p class="text-muted">Flashcards & Quiz coming soon...</p>
      `;
    });

    // 🎯 Edit
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
