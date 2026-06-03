(() => {
  'use strict';

  const rtlRegex = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;

  // Block-level elements whose direction we detect individually so that each
  // paragraph / list item / heading flows in its own correct direction.
  const blockSelector =
    'p, li, blockquote, h1, h2, h3, h4, h5, h6, td, th, dd, dt, summary, figcaption';

  // Elements that must stay left-to-right regardless of surrounding Hebrew.
  const skipSelector = 'pre, code, kbd, samp';

  // Shared defaults are provided by defaults.js (loaded first by the manifest).
  const defaultSelectors = RTL_CHAT_BOOST_DEFAULTS;

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

  function setAutoDir(el) {
    // dir="auto" lets the browser pick the direction from each element's own
    // text, so Hebrew flows RTL while English / numbers stay LTR.
    el.setAttribute('dir', 'auto');
    el.classList.add('rtl-chat-boost');
  }

  function applyRTL(el) {
    if (!el) return;

    const text = el.textContent || '';

    // Nothing Hebrew anywhere — leave the element untouched.
    if (!rtlRegex.test(text)) return;

    // Editable inputs are live editors (ProseMirror / textarea). Only set the
    // native dir="auto" attribute — it updates as you type and handles
    // direction + alignment by itself. Adding our display CSS (unicode-bidi /
    // text-align) here fights the editor's own layout and causes a horizontal
    // scrollbar (e.g. when typing "1." which it turns into a list).
    if (el.isContentEditable || el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      el.setAttribute('dir', 'auto');
      return;
    }

    // Message / response containers hold mixed content. Detect direction per
    // block so English paragraphs, lists and code keep their own direction
    // instead of being forced RTL as a whole.
    setAutoDir(el);

    el.querySelectorAll(blockSelector).forEach((block) => {
      if (block.closest(skipSelector)) return;
      setAutoDir(block);
    });
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

    // dir="auto" re-evaluates direction by itself as text changes, so we only
    // need to catch newly added elements (childList) — watching characterData
    // would fire constantly during response streaming for no benefit.
    observer.observe(document.body, {
      childList: true,
      subtree: true
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
