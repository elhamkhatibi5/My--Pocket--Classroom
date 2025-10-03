// storage.js

// ===== ایندکس کپسول‌ها =====
export function loadIndex() {
  try {
    return JSON.parse(localStorage.getItem('pc_capsules_index') || '[]');
  } catch (e) {
    return [];
  }
}

export function saveIndex(index) {
  localStorage.setItem('pc_capsules_index', JSON.stringify(index));
}

// ===== ذخیره یک کپسول =====
export function saveCapsule(capsule) {
  if (!capsule.id) capsule.id = 'pc_' + Date.now();
  capsule.updatedAt = new Date().toISOString();

  localStorage.setItem('pc_capsule_' + capsule.id, JSON.stringify(capsule));

  const idx = loadIndex();
  const existing = idx.find(i => i.id === capsule.id);

  const entry = {
    id: capsule.id,
    title: capsule.meta?.title || 'Untitled',
    subject: capsule.meta?.subject || '',
    level: capsule.meta?.level || '',
    type: capsule.meta?.type || 'note',   // 👈 نوع کپسول (note / flashcard / quiz)
    updatedAt: capsule.updatedAt
  };

  if (existing) {
    idx[idx.findIndex(x => x.id === capsule.id)] = entry;
  } else {
    idx.push(entry);
  }

  saveIndex(idx);
}

// ===== لود و حذف =====
export function loadCapsule(id) {
  try {
    return JSON.parse(localStorage.getItem('pc_capsule_' + id));
  } catch (e) {
    return null;
  }
}

export function deleteCapsule(id) {
  localStorage.removeItem('pc_capsule_' + id);
  saveIndex(loadIndex().filter(i => i.id !== id));
}

// ===== پیشرفت کاربر در Learn Mode =====
export function loadProgress(id) {
  try {
    return JSON.parse(localStorage.getItem('pc_progress_' + id) || '{}');
  } catch (e) {
    return {};
  }
}

export function saveProgress(id, progress) {
  localStorage.setItem('pc_progress_' + id, JSON.stringify(progress));
}

// ===== Import / Export =====
export function exportCapsules() {
  const index = loadIndex();
  const capsules = index.map(i => loadCapsule(i.id));
  return JSON.stringify({ schema: "pocket-classroom/v1", capsules }, null, 2);
}

export function importCapsules(json) {
  try {
    const data = JSON.parse(json);
    if (data.schema !== "pocket-classroom/v1") throw new Error("Invalid schema");
    if (!Array.isArray(data.capsules)) throw new Error("Invalid capsules array");

    data.capsules.forEach(c => saveCapsule(c));
    return true;
  } catch (e) {
    console.error("Import failed", e);
    return false;
  }
}
