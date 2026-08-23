const initializePageInteractions = () => {
  const personSelect = document.querySelector('#homework-person');
  const homeworkItems = [...document.querySelectorAll('.homework-item')];
  const storageKey = (person) => `homework-status:${person}`;
  const readStatuses = () => {
    if (!personSelect) return [];
    try { return JSON.parse(localStorage.getItem(storageKey(personSelect.value)) || '[]'); }
    catch { return []; }
  };
  const saveStatuses = () => {
    if (!personSelect) return;
    const statuses = homeworkItems.map((item) => item.classList.contains('is-complete'));
    localStorage.setItem(storageKey(personSelect.value), JSON.stringify(statuses));
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

  homeworkItems.forEach((item) => {
    const status = item.querySelector('.status, .homework-item__status');
    if (!status) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'homework-toggle';
    button.textContent = 'Tandai selesai';
    button.addEventListener('click', () => {
      const completed = item.classList.toggle('is-complete');
      status.textContent = completed ? 'Selesai' : 'Belum selesai';
      button.textContent = completed ? 'Batalkan' : 'Tandai selesai';
      button.setAttribute('aria-pressed', String(completed));
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
