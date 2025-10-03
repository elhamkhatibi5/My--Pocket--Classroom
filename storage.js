// storage.js — مدیریت کامل کپسول‌ها، فلش‌کارت‌ها و نوت‌ها

// بارگذاری همه کپسول‌ها
export function loadAllCapsules() {
  try {
    return JSON.parse(localStorage.getItem('pocket_capsules') || '[]');
  } catch (e) {
    console.error("Error loading capsules:", e);
    return [];
  }
}

// ذخیره همه کپسول‌ها
export function saveAllCapsules(capsules) {
  try {
    localStorage.setItem('pocket_capsules', JSON.stringify(capsules));
  } catch (e) {
    console.error("Error saving capsules:", e);
  }
}

// بارگذاری یک کپسول با id
export function loadCapsule(id) {
  const capsules = loadAllCapsules();
  return capsules.find(c => c.id === id) || null;
}

// ذخیره یا آپدیت یک کپسول
export function saveCapsule(capsule) {
  let capsules = loadAllCapsules();
  const index = capsules.findIndex(c => c.id === capsule.id);
  if(index >= 0) {
    capsules[index] = capsule; // آپدیت
  } else {
    capsules.push(capsule);     // اضافه کردن جدید
  }
  saveAllCapsules(capsules);
}

// حذف یک کپسول
export function deleteCapsule(id) {
  let capsules = loadAllCapsules();
  capsules = capsules.filter(c => c.id !== id);
  saveAllCapsules(capsules);
}

// پیشرفت کاربر روی یک کپسول (optional)
export function loadProgress(id) {
  try {
    return JSON.parse(localStorage.getItem('pocket_progress_' + id) || '{}');
  } catch(e) {
    console.error("Error loading progress:", e);
    return {};
  }
}

export function saveProgress(id, progress) {
  try {
    localStorage.setItem('pocket_progress_' + id, JSON.stringify(progress));
  } catch(e) {
    console.error("Error saving progress:", e);
  }
}
