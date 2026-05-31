(() => {
  'use strict';

  /**
   * Detects common RTL Unicode ranges:
   * Hebrew, Arabic, Persian, Urdu and related RTL scripts.
   */
  const rtlRegex = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;

  const targets = [
    // ChatGPT input
    '#prompt-textarea',

    // Claude response
    '.font-claude-response-body',

    // Claude input
    '.tiptap.ProseMirror[aria-label="Write your prompt to Claude"]'
  ];

  const selector = targets.join(',');

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
    document.querySelectorAll(selector).forEach(applyRTL);
  }

  scan();

  let timer = null;

  const observer = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(scan, 300);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  console.log('RTL Chat Boost loaded');
})();
