// Single source of truth for the built-in RTL target selectors.
// Loaded as a plain script before both content.js and popup.js, so the
// content script and the popup can never drift out of sync.
var RTL_CHAT_BOOST_DEFAULTS = [
  { selector: '#prompt-textarea', label: 'ChatGPT input', enabled: true },
  { selector: '[id^="ask-user-option-question"]', label: 'Option question', enabled: true },
  { selector: '[data-testid="conversation-turn"]', label: 'ChatGPT conversation turn', enabled: true },
  { selector: '.font-claude-response', label: 'Claude response', enabled: true },
  { selector: '.font-claude-response-body', label: 'Claude response body', enabled: true },
  { selector: '.tiptap.ProseMirror[aria-label="Write your prompt to Claude"]', label: 'Claude input', enabled: true }
];
