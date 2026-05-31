(() => {
  'use strict';

  const rtlRegex = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;

  const defaultSelectors = [
    { selector: '#prompt-textarea', label: 'ChatGPT input', enabled: true },
    { selector: '.font-claude-response-body', label: 'Claude response', enabled: true },
    { selector: '.tiptap.ProseMirror[aria-label="Write your prompt to Claude"]', label: 'Claude input', enabled: true }
  ];

  const storageKey = 'rtlChatBoostSelectors';

  let activeSelector = '';
  let observer = null;
  let timer = null;

  function normalizeItems(items) {
    if (!Array.isArray(items) || !items.length) {
      return defaultSelectors;
    }

    return items
      .filter((item) => item && typeof item.selector === 'string' && item.selector.trim())
      .map((item) => ({
        selector: item.selector.trim(),
        label: item.label || item.selector.trim(),
        enabled: item.enabled !== false
      }));
  }

  function getEnabledSelector(items) {
    return items
      .filter((item) => item.enabled)
      .map((item) => item.selector)
      .join(',');
  }

  function applyRTL(el) {
    if (!el) return;

    const text = el.textContent || '';

    if (rtlRegex.test(text)) {
      el.setAttribute('dir', 'rtl');
      el.classList.add('rtl-chat-boost');
    } else {
      el.removeAttribute('dir');
      el.classList.remove('rtl-chat-boost');
    }
  }

  function scan() {
    if (!activeSelector) return;

    try {
      document.querySelectorAll(activeSelector).forEach(applyRTL);
    } catch (error) {
      console.warn('RTL Chat Boost: invalid selector', error);
    }
  }

  function scheduleScan() {
    clearTimeout(timer);
    timer = setTimeout(scan, 300);
  }

  function startObserver() {
    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver(scheduleScan);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function loadSettings() {
    chrome.storage.sync.get([storageKey], (result) => {
      const items = normalizeItems(result[storageKey]);
      activeSelector = getEnabledSelector(items);

      scan();
      startObserver();

      if (!result[storageKey]) {
        chrome.storage.sync.set({ [storageKey]: items });
      }
    });
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') return;

    if (changes[storageKey]) {
      const items = normalizeItems(changes[storageKey].newValue);
      activeSelector = getEnabledSelector(items);
      scan();
    }
  });

  loadSettings();

  console.log('RTL Chat Boost loaded');
})();
