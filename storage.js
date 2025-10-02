
export function loadIndex(){
  try { return JSON.parse(localStorage.getItem('pc_capsules_index')||'[]'); }
  catch(e){ return []; }
}
export function saveIndex(index){ localStorage.setItem('pc_capsules_index', JSON.stringify(index)); }

export function saveCapsule(capsule){
  if(!capsule.id) capsule.id = 'pc_' + Date.now();
  capsule.updatedAt = new Date().toISOString();
  localStorage.setItem('pc_capsule_' + capsule.id, JSON.stringify(capsule));
  const idx = loadIndex();
  const existing = idx.find(i=>i.id===capsule.id);
  const entry = { id: capsule.id, title: capsule.meta.title||'Untitled', subject: capsule.meta.subject||'', level: capsule.meta.level||'', updatedAt: capsule.updatedAt };
  if(existing){
    const i = idx.findIndex(x=>x.id===capsule.id);
    idx[i] = entry;
  } else { idx.push(entry); }
  saveIndex(idx);
}

export function loadCapsule(id){
  try { return JSON.parse(localStorage.getItem('pc_capsule_' + id)); }
  catch(e){ return null; }
}

export function deleteCapsule(id){
  localStorage.removeItem('pc_capsule_' + id);
  const idx = loadIndex().filter(i=>i.id!==id);
  saveIndex(idx);
}

export function loadProgress(id){
  try { return JSON.parse(localStorage.getItem('pc_progress_' + id) || '{}'); }
  catch(e){ return {}; }
}
export function saveProgress(id, progress){ localStorage.setItem('pc_progress_' + id, JSON.stringify(progress)); }
