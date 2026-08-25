const initializePageInteractions = () => {
  const personSelect = document.querySelector('#homework-person');
  const homeworkItems = [...document.querySelectorAll('.homework-item')];
  const storageKey = (person) => `homework-status:v2:${person}`;
  // professional: safe storage access (private mode / quota)
  const storageAvailable = (() => {
    try { const k='__test__'; localStorage.setItem(k,'1'); localStorage.removeItem(k); return true; } catch { return false; }
  })();
  const announce = (msg) => {
    let live = document.getElementById('hw-live');
    if(!live){ live=document.createElement('div'); live.id='hw-live'; live.setAttribute('aria-live','polite'); live.setAttribute('aria-atomic','true'); live.style.position='absolute'; live.style.left='-9999px'; document.body.appendChild(live); }
    live.textContent=''; setTimeout(()=> live.textContent=msg, 40);
  };
  const readStatuses = () => {
    if (!personSelect || !storageAvailable) return [];
    try { return JSON.parse(localStorage.getItem(storageKey(personSelect.value)) || '[]'); }
    catch { return []; }
  };
  const saveStatuses = () => {
    if (!personSelect || !storageAvailable) return;
    const statuses = homeworkItems.map((item) => item.classList.contains('is-complete'));
    try { localStorage.setItem(storageKey(personSelect.value), JSON.stringify(statuses)); }
    catch (err){
      // quota or disabled: inform user once, keep in-memory
      console.warn('Homework save failed', err);
      announce('Gagal menyimpan — penyimpanan penuh atau diblokir.');
    }
  };
  const renderStatuses = () => {
    const statuses = readStatuses();
    homeworkItems.forEach((item, index) => {
      const completed = statuses[index] === true;
      const status = item.querySelector('.status, .homework-item__status');
      const button = item.querySelector('.homework-toggle');
      item.classList.toggle('is-complete', completed);
      if (status) status.textContent = completed ? 'Selesai' : 'Belum selesai';
      if (button) { button.textContent = completed ? 'Batalkan' : 'Tandai selesai'; button.setAttribute('aria-pressed', String(completed)); }
    });
  };

  if (personSelect) personSelect.addEventListener('change', renderStatuses);

  homeworkItems.forEach((item, idx) => {
    const status = item.querySelector('.status, .homework-item__status');
    if (!status) return;
    if(!item.id) item.id = `hw-${idx+1}`;
    status.setAttribute('aria-live','polite');
    const isExam = item.classList.contains('homework-item--exam');
    const labelType = isExam ? 'ulangan' : 'tugas';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'homework-toggle';
    button.textContent = 'Tandai selesai';
    button.setAttribute('aria-label', `Tandai ${labelType} ${idx+1} selesai`);
    button.setAttribute('aria-controls', item.id);
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click', () => {
      const completed = item.classList.toggle('is-complete');
      status.textContent = completed ? 'Selesai' : 'Belum selesai';
      button.textContent = completed ? 'Batalkan' : 'Tandai selesai';
      button.setAttribute('aria-pressed', String(completed));
      button.setAttribute('aria-label', completed ? `Batalkan ${labelType} ${idx+1}` : `Tandai ${labelType} ${idx+1} selesai`);
      announce(completed ? `${labelType} ${idx+1} ditandai selesai.` : `${labelType} ${idx+1} dibatalkan.`);
      saveStatuses();
    });
    item.appendChild(button);
  });
  renderStatuses();

};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePageInteractions, { once: true });
} else {
  initializePageInteractions();
}
