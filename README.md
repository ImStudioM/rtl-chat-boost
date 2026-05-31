# RTL Chat Boost

Automatic RTL support for ChatGPT and Claude.

RTL Chat Boost is a lightweight Chrome extension that improves readability for right-to-left languages in AI chats.

It automatically detects RTL text and applies proper right-to-left direction only to supported chat/input areas.

## Features

- Automatic RTL detection
- Supports Hebrew, Arabic, Persian, Urdu and other RTL languages
- Works with ChatGPT
- Works with Claude
- Lightweight and fast
- No tracking
- No special permissions required

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
rtl-chat-boost
```

7. Open or refresh ChatGPT / Claude.

## Test sentence

Use this sentence to test mixed RTL and English text:

```text
שלום fire בדיקה עם ChatGPT ו-Claude
```

## Files

```text
rtl-chat-boost/
├── manifest.json
├── content.js
├── style.css
├── icon16.png
├── icon48.png
├── icon128.png
├── LICENSE
└── README.md
```

## Chrome Web Store short description

Automatic RTL support for ChatGPT and Claude.

## Chrome Web Store full description

RTL Chat Boost automatically adds right-to-left (RTL) support to AI chats.

Features:

- Automatic RTL detection
- Supports Hebrew, Arabic, Persian, Urdu and other RTL languages
- Works with ChatGPT
- Works with Claude
- Lightweight and fast
- No tracking
- No special permissions required

## Privacy

RTL Chat Boost does not collect, store, or send any user data.

All detection happens locally in your browser.

## License

MIT
