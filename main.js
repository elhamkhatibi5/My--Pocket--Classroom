
import { renderLibrary } from './library.js';
import { renderAuthor } from './author.js';
import { renderLearn } from './learn.js';

document.addEventListener('DOMContentLoaded', ()=>{
  const navLinks = document.querySelectorAll('.nav-link[data-view]');
  function showView(view){
    ['library','author','learn'].forEach(id=> document.getElementById(id).classList.add('d-none'));
    document.getElementById(view).classList.remove('d-none');
    navLinks.forEach(n=> n.classList.toggle('active', n.dataset.view === view));
  }

  // initial
  showView('library');
  renderLibrary();

  navLinks.forEach(link=> link.addEventListener('click', e=>{
    e.preventDefault();
    const view = link.dataset.view;
    showView(view);
    if(view === 'library') renderLibrary();
  }));

  // custom events from modules
  window.addEventListener('pc:openAuthor', e=>{
    showView('author');
    renderAuthor(e.detail.id || null);
  });
  window.addEventListener('pc:openLearn', e=>{
    showView('learn');
    renderLearn(e.detail.id);
  });
  window.addEventListener('pc:saved', e=>{
    // after saving, return to library and refresh
    showView('library');
    renderLibrary();
  });
  window.addEventListener('pc:showLibrary', ()=>{
    showView('library');
    renderLibrary();
  });
});
