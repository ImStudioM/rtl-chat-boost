# RTL Chat Boost

Automatic RTL support for ChatGPT and Claude.

RTL Chat Boost is a lightweight Chrome extension that improves readability for right-to-left languages in AI chats.

## Features

- Automatic RTL detection
- Supports Hebrew, Arabic, Persian, Urdu and other RTL languages
- Works with ChatGPT
- Works with Claude
- Managed selectors from the extension popup
- Add, remove, enable and disable target selectors
- Lightweight and fast
- No tracking

## Managed selectors

Open the extension popup to manage the selectors that should receive RTL support.

Default selectors:

```js
#prompt-textarea
.font-claude-response-body
.tiptap.ProseMirror[aria-label="Write your prompt to Claude"]
```

## Supported websites

```text
https://chatgpt.com/*
https://claude.ai/*
```

## Installation for local testing

1. Download or clone this repository.
2. Open Chrome.
3. Go to:

```text
chrome://extensions/
```

4. Turn on **Developer mode**.
5. Click **Load unpacked**.
6. Select the project folder:

```text
rtl-chat-boost-v1-1
```

7. Open or refresh ChatGPT / Claude.

## Test sentence

```text
שלום fire בדיקה עם ChatGPT ו-Claude
```

## Privacy

RTL Chat Boost does not collect, store, or send user data.

Selector settings are stored using Chrome Storage Sync.

## License

MIT
