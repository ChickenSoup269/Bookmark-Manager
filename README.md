# Bookmark Manager Extension

<div align="center">
<img src="./images/logo.png" alt="logo" width="full">
</div>

English | <a href="https://github.com/ChickenSoup269/Bookmark-Manager/blob/main/README_VN.md">Tiếng Việt</a>

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Introduction

Bookmark Manager is a powerful and intuitive Chrome extension that simplifies bookmark organization. Easily view, search, sort, and manage your bookmarks with a sleek interface. It supports light/dark themes, multilingual display (English/Vietnamese), and export/import functionality for seamless backup and restore.

## Features

- **View Bookmarks:** Browse bookmarks by folder or as a flat list.
- **Search:** Instantly find bookmarks by keyword (title or URL).
- **Sort:** Organize bookmarks by date added, last opened, or alphabetically (A-Z, Z-A).
- **Folder Management:** Create, delete, or move bookmarks between folders.
- **Edit Bookmarks:** Rename or delete bookmarks with ease.
- **Export/Import:** Save bookmarks to JSON or import with duplicate detection (based on URL).
- **Themes:** Switch between light, dark, or system-based themes.
- **Fonts:** Customize interface with different font styles.
- **Multilingual:** Supports English and Vietnamese for a localized experience.

## Running Tests

To run tests, ensure the following environment:

- **Browser:** Google Chrome (latest version).
- **Permissions:** Access to Chrome's bookmark API.

## Installation

Install Bookmark-Manager

```bash
  git clone https://github.com/ChickenSoup269/Bookmark-Manager.git
  cd Bookmark-Manager
```

### Step by step to use offline:

1. Clone the repository or download the source code from GitHub.
2. Open Chrome and navigate to chrome://extensions/.
3. Enable Developer Mode.
4. Click Load unpacked and select the extension folder.
5. Click the extension icon in the toolbar to start using it.

## Usage/Examples

| Parameter          | Description                                                    |
| :----------------- | :------------------------------------------------------------- |
| `Search`           | Type keywords in the search box.                               |
| `Filter folders`   | Select a folder from the dropdown.                             |
| `Sort`             | Choose a sorting option.                                       |
| `Manage bookmarks` | Click "⋮" to add to folder, rename, or delete.                 |
| `Export/Import`    | Use Settings to export as JSON or import with duplicate check. |
| `Customize`        | Adjust theme, font, or language in Settings.                   |

## Video & screenshots

<!-- <Video > -->
<!-- image -->

## Feedback

If you have any feedback, please reach out to us at thientran01345@icloud.com

---

---Extension version----

## Changelog

## [1.0.3] - 2025-08-28

- Added light/dark theme switching (auto-detected).
- Added English/Vietnamese language support with - dynamic UI updates.
- Added bookmark import with duplicate URL detection and user confirmation.
- Added Chrome Web Store video introduction.
- Improved bookmark refresh for add/delete/rename actions.
- Updated content script for package-based summary and title.
- Renamed popup.html/js to index.html/js.
- Replaced changefont button with font-switcher dropdown.
- Removed unrelated files.

## [1.0.2] - 2025-08-15

- Removed unused "identity" permission from manifest.json.
