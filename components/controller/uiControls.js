import { translations, debounce } from "../utils.js"
import { isInFolder } from "../bookmarks.js"
import {
  updateUILanguage,
  updateTheme,
  renderFilteredBookmarks,
} from "../ui.js"
import { uiState, saveUIState, selectedBookmarks } from "../state.js"

export function setupUIControlListeners(elements) {
  elements.languageSwitcher.addEventListener("change", (e) => {
    updateUILanguage(elements, e.target.value)
    renderFilteredBookmarks(uiState.bookmarkTree, elements)
  })

  elements.themeSwitcher.addEventListener("change", (e) => {
    localStorage.setItem("appTheme", e.target.value)
    updateTheme(elements, e.target.value)
  })

  elements.fontSwitcher.addEventListener("change", (e) => {
    document.body.classList.remove("font-gohu", "font-normal")
    document.body.classList.add(`font-${e.target.value}`)
    localStorage.setItem("appFont", e.target.value)
  })

  elements.toggleCheckboxesButton.addEventListener("click", () => {
    uiState.checkboxesVisible = !uiState.checkboxesVisible
    const language = localStorage.getItem("appLanguage") || "en"
    elements.toggleCheckboxesButton.textContent = uiState.checkboxesVisible
      ? translations[language].hideCheckboxes
      : translations[language].showCheckboxes
    document
      .querySelectorAll(".bookmark-checkbox, .select-all input")
      .forEach((checkbox) => {
        checkbox.style.display = uiState.checkboxesVisible
          ? "inline-block"
          : "none"
      })
    if (!uiState.checkboxesVisible) {
      selectedBookmarks.clear()
      elements.addToFolderButton.classList.add("hidden")
      document.querySelectorAll(".bookmark-checkbox").forEach((cb) => {
        cb.checked = false
      })
    }
    saveUIState()
  })

  elements.scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  window.addEventListener("scroll", () => {
    elements.scrollToTopButton.classList.toggle("hidden", window.scrollY <= 0)
  })

  elements.searchInput.addEventListener(
    "input",
    debounce((e) => {
      uiState.searchQuery = e.target.value.toLowerCase()
      uiState.selectedFolderId = elements.folderFilter.value
      uiState.sortType = elements.sortFilter.value || "default"
      let filtered = uiState.bookmarks
      if (uiState.selectedFolderId) {
        filtered = filtered.filter((bookmark) =>
          isInFolder(bookmark, uiState.selectedFolderId)
        )
      }
      if (uiState.searchQuery) {
        filtered = filtered.filter(
          (bookmark) =>
            bookmark.title?.toLowerCase().includes(uiState.searchQuery) ||
            bookmark.url?.toLowerCase().includes(uiState.searchQuery)
        )
      }
      renderFilteredBookmarks(uiState.bookmarkTree, elements)
      saveUIState()
    }, 150)
  )

  elements.clearSearchButton.addEventListener("click", () => {
    elements.searchInput.value = ""
    uiState.searchQuery = ""
    let filtered = uiState.bookmarks
    if (uiState.selectedFolderId) {
      filtered = filtered.filter((bookmark) =>
        isInFolder(bookmark, uiState.selectedFolderId)
      )
    }
    renderFilteredBookmarks(uiState.bookmarkTree, elements)
    saveUIState()
  })

  elements.folderFilter.addEventListener("change", () => {
    uiState.searchQuery = elements.searchInput.value.toLowerCase()
    uiState.selectedFolderId = elements.folderFilter.value
    uiState.sortType = elements.sortFilter.value || "default"
    let filtered = uiState.bookmarks
    if (uiState.selectedFolderId) {
      filtered = filtered.filter((bookmark) =>
        isInFolder(bookmark, uiState.selectedFolderId)
      )
    }
    if (uiState.searchQuery) {
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title?.toLowerCase().includes(uiState.searchQuery) ||
          bookmark.url?.toLowerCase().includes(uiState.searchQuery)
      )
    }
    renderFilteredBookmarks(uiState.bookmarkTree, elements)
    saveUIState()
  })

  elements.sortFilter.addEventListener("change", () => {
    uiState.searchQuery = elements.searchInput.value.toLowerCase()
    uiState.selectedFolderId = elements.folderFilter.value
    uiState.sortType = elements.sortFilter.value || "default"
    let filtered = uiState.bookmarks
    if (uiState.selectedFolderId) {
      filtered = filtered.filter((bookmark) =>
        isInFolder(bookmark, uiState.selectedFolderId)
      )
    }
    if (uiState.searchQuery) {
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title?.toLowerCase().includes(uiState.searchQuery) ||
          bookmark.url?.toLowerCase().includes(uiState.searchQuery)
      )
    }
    renderFilteredBookmarks(uiState.bookmarkTree, elements)
    saveUIState()
  })

  elements.settingsButton.addEventListener("click", (e) => {
    e.stopPropagation()
    elements.settingsMenu.classList.toggle("hidden")
  })

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest("#settings-button") &&
      !e.target.closest("#settings-menu") &&
      !e.target.closest(".dropdown-btn") &&
      !e.target.closest(".dropdown-menu")
    ) {
      elements.settingsMenu.classList.add("hidden")
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.add("hidden")
      })
    }
  })
}
