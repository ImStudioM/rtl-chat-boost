// Shared defaults are provided by defaults.js (loaded first in popup.html).
const defaultSelectors = RTL_CHAT_BOOST_DEFAULTS;

const storageKey = 'rtlChatBoostSelectors';

const selectorsList = document.getElementById('selectorsList');
const selectorInput = document.getElementById('selectorInput');
const addBtn = document.getElementById('addBtn');
const resetBtn = document.getElementById('resetBtn');
const statusEl = document.getElementById('status');
const template = document.getElementById('selectorItemTemplate');

let selectors = [];

function normalizeSelectors(value) {
  if (!Array.isArray(value) || !value.length) {
    return [...defaultSelectors];
  }

  return value
    .filter((item) => item && typeof item.selector === 'string' && item.selector.trim())
    .map((item) => ({
      selector: item.selector.trim(),
      label: item.label || item.selector.trim(),
      enabled: item.enabled !== false
    }));
}

function setStatus(message) {
  statusEl.textContent = message;

  clearTimeout(setStatus.timer);
  setStatus.timer = setTimeout(() => {
    statusEl.textContent = '';
  }, 1600);
}

function saveSelectors() {
  chrome.storage.sync.set({ [storageKey]: selectors }, () => {
    setStatus('Saved');
  });
}

function renderSelectors() {
  selectorsList.innerHTML = '';

  selectors.forEach((item, index) => {
    const node = template.content.cloneNode(true);

    const enabledInput = node.querySelector('.selector-enabled');
    const labelInput = node.querySelector('.selector-label');
    const valueTextarea = node.querySelector('.selector-value');
    const deleteBtn = node.querySelector('.delete-btn');

    enabledInput.checked = item.enabled;
    labelInput.value = item.label;
    valueTextarea.value = item.selector;

    enabledInput.addEventListener('change', () => {
      selectors[index].enabled = enabledInput.checked;
      saveSelectors();
    });

    labelInput.addEventListener('change', () => {
      selectors[index].label = labelInput.value.trim() || selectors[index].selector;
      saveSelectors();
    });

    valueTextarea.addEventListener('change', () => {
      const value = valueTextarea.value.trim();

      if (!value) {
        valueTextarea.value = selectors[index].selector;
        return;
      }

      selectors[index].selector = value;
      selectors[index].label = labelInput.value.trim() || value;
      saveSelectors();
      renderSelectors();
    });

    deleteBtn.addEventListener('click', () => {
      selectors.splice(index, 1);
      saveSelectors();
      renderSelectors();
    });

    selectorsList.appendChild(node);
  });
}

function loadSelectors() {
  chrome.storage.sync.get([storageKey], (result) => {
    selectors = normalizeSelectors(result[storageKey]);
    renderSelectors();

    if (!result[storageKey]) {
      saveSelectors();
    }
  });
}

addBtn.addEventListener('click', () => {
  const value = selectorInput.value.trim();

  if (!value) {
    selectorInput.focus();
    return;
  }

  selectors.push({
    selector: value,
    label: value,
    enabled: true
  });

  selectorInput.value = '';
  saveSelectors();
  renderSelectors();
});

selectorInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addBtn.click();
  }
});

resetBtn.addEventListener('click', () => {
  selectors = [...defaultSelectors];
  saveSelectors();
  renderSelectors();
});

loadSelectors();
