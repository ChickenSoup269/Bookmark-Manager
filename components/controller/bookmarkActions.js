// ./components/controller/bookmarkActions.js
import {
  translations,
  safeChromeBookmarksCall,
  showCustomPopup,
  showCustomConfirm,
} from "../utils.js"
import { getBookmarkTree } from "../bookmarks.js"
import { renderFilteredBookmarks } from "../ui.js"
import { uiState, setCurrentBookmarkId } from "../state.js"
import { openAddToFolderPopup } from "./addToFolder.js"

export function setupBookmarkActionListeners(elements) {
  if (elements.renameSave) {
    elements.renameSave.removeEventListener("click", handleRenameSave)
    elements.renameSave.addEventListener("click", (e) =>
      handleRenameSave(e, elements)
    )
  } else {
    console.error("renameSave element not found")
  }

  if (elements.renameCancel) {
    elements.renameCancel.removeEventListener("click", handleRenameCancel)
    elements.renameCancel.addEventListener("click", (e) =>
      handleRenameCancel(e, elements)
    )
  } else {
    console.error("renameCancel element not found")
  }

  if (elements.renameInput) {
    elements.renameInput.removeEventListener(
      "keypress",
      handleRenameInputKeypress
    )
    elements.renameInput.addEventListener("keypress", (e) =>
      handleRenameInputKeypress(e, elements)
    )
    elements.renameInput.removeEventListener(
      "keydown",
      handleRenameInputKeydown
    )
    elements.renameInput.addEventListener("keydown", (e) =>
      handleRenameInputKeydown(e, elements)
    )
  } else {
    console.error("renameInput element not found")
  }

  if (elements.renamePopup) {
    elements.renamePopup.removeEventListener("click", handleRenamePopupClick)
    elements.renamePopup.addEventListener("click", (e) =>
      handleRenamePopupClick(e, elements)
    )
  } else {
    console.error("renamePopup element not found")
  }

  if (elements.clearRenameButton) {
    elements.clearRenameButton.removeEventListener("click", handleClearRename)
    elements.clearRenameButton.addEventListener("click", (e) =>
      handleClearRename(e, elements)
    )
  } else {
    console.error("clearRenameButton element not found")
  }

  const addToFolderButtons = document.querySelectorAll(".add-to-folder")
  console.log("Found add-to-folder buttons:", addToFolderButtons.length)
  addToFolderButtons.forEach((button) => {
    button.removeEventListener("click", handleAddToFolder)
    button.addEventListener("click", (e) => handleAddToFolder(e, elements))
  })

  const deleteButtons = document.querySelectorAll(".delete-btn")
  console.log("Found delete buttons:", deleteButtons.length)
  deleteButtons.forEach((button) => {
    button.removeEventListener("click", handleDeleteBookmark)
    button.addEventListener("click", (e) => handleDeleteBookmark(e, elements))
  })

  const renameButtons = document.querySelectorAll(".rename-btn")
  console.log("Found rename buttons:", renameButtons.length)
  renameButtons.forEach((button) => {
    button.removeEventListener("click", handleRenameBookmark)
    button.addEventListener("click", (e) => handleRenameBookmark(e, elements))
  })

  const checkboxes = document.querySelectorAll(".bookmark-checkbox")
  console.log("Found bookmark checkboxes:", checkboxes.length)
  checkboxes.forEach((checkbox) => {
    checkbox.removeEventListener("change", handleBookmarkCheckbox)
    checkbox.addEventListener("change", (e) =>
      handleBookmarkCheckbox(e, elements)
    )
  })
}

function handleRenameSave(e, elements) {
  e.stopPropagation()
  const newTitle = elements.renameInput.value.trim()
  const language = localStorage.getItem("appLanguage") || "en"
  console.log(
    "handleRenameSave called, currentBookmarkId:",
    uiState.currentBookmarkId,
    "newTitle:",
    newTitle
  )

  if (!newTitle) {
    console.log("Empty title entered")
    elements.renameInput.classList.add("error")
    elements.renameInput.placeholder = translations[language].emptyTitleError
    elements.renameInput.focus()
    return
  }

  if (!uiState.currentBookmarkId) {
    console.error("No currentBookmarkId set")
    showCustomPopup(
      translations[language].errorNoBookmarkSelected || "No bookmark selected",
      "error",
      false
    )
    elements.renamePopup.classList.add("hidden")
    return
  }

  safeChromeBookmarksCall("get", [uiState.currentBookmarkId], (bookmark) => {
    if (chrome.runtime.lastError) {
      console.error(
        "Error retrieving bookmark:",
        chrome.runtime.lastError.message
      )
      showCustomPopup(
        translations[language].errorUnexpected ||
          "An unexpected error occurred",
        "error",
        false
      )
      elements.renamePopup.classList.add("hidden")
      return
    }

    if (!bookmark || !bookmark[0]) {
      console.error("Bookmark not found for ID:", uiState.currentBookmarkId)
      showCustomPopup(
        translations[language].bookmarkNotFound || "Bookmark not found",
        "error",
        false
      )
      elements.renamePopup.classList.add("hidden")
      return
    }

    if (!bookmark[0].url) {
      console.error(
        "Selected item is not a bookmark, ID:",
        uiState.currentBookmarkId
      )
      showCustomPopup(
        translations[language].errorNotABookmark ||
          "Selected item is not a bookmark",
        "error",
        false
      )
      elements.renamePopup.classList.add("hidden")
      return
    }

    const parentId = bookmark[0].parentId
    safeChromeBookmarksCall("getChildren", [parentId], (siblings) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error retrieving siblings:",
          chrome.runtime.lastError.message
        )
        showCustomPopup(
          translations[language].errorUnexpected ||
            "An unexpected error occurred",
          "error",
          false
        )
        elements.renamePopup.classList.add("hidden")
        return
      }

      const isDuplicate = siblings.some(
        (sibling) =>
          sibling.id !== uiState.currentBookmarkId &&
          sibling.title.toLowerCase() === newTitle.toLowerCase()
      )
      if (isDuplicate) {
        console.log("Duplicate title found:", newTitle)
        elements.renameInput.classList.add("error")
        elements.renameInput.placeholder =
          translations[language].duplicateTitleError
        elements.renameInput.focus()
        return
      }

      safeChromeBookmarksCall(
        "update",
        [uiState.currentBookmarkId, { title: newTitle }],
        (result) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error updating bookmark:",
              chrome.runtime.lastError.message
            )
            showCustomPopup(
              translations[language].errorUnexpected ||
                "An unexpected error occurred",
              "error",
              false
            )
            elements.renamePopup.classList.add("hidden")
            return
          }

          if (result) {
            console.log(
              "Bookmark updated successfully, ID:",
              uiState.currentBookmarkId
            )
            getBookmarkTree((bookmarkTreeNodes) => {
              if (bookmarkTreeNodes) {
                renderFilteredBookmarks(bookmarkTreeNodes, elements)
                showCustomPopup(
                  translations[language].renameSuccess ||
                    "Bookmark renamed successfully!",
                  "success"
                )
                setCurrentBookmarkId(null)
                elements.renamePopup.classList.add("hidden")
              } else {
                console.error("Failed to retrieve bookmark tree")
                showCustomPopup(
                  translations[language].errorUnexpected ||
                    "An unexpected error occurred",
                  "error",
                  false
                )
              }
            })
          } else {
            console.error("Bookmark update returned null")
            showCustomPopup(
              translations[language].errorUnexpected ||
                "An unexpected error occurred",
              "error",
              false
            )
            elements.renamePopup.classList.add("hidden")
          }
        }
      )
    })
  })
}

function handleRenameCancel(e, elements) {
  e.stopPropagation()
  console.log("handleRenameCancel called, resetting currentBookmarkId")
  elements.renamePopup.classList.add("hidden")
  elements.renameInput.classList.remove("error")
  elements.renameInput.value = ""
  const language = localStorage.getItem("appLanguage") || "en"
  elements.renameInput.placeholder = translations[language].renamePlaceholder
  setCurrentBookmarkId(null)
}

function handleRenameInputKeypress(e, elements) {
  if (e.key === "Enter") {
    elements.renameSave.click()
  }
}

function handleRenameInputKeydown(e, elements) {
  if (e.key === "Escape") {
    elements.renameCancel.click()
  }
}

function handleRenamePopupClick(e, elements) {
  if (e.target === elements.renamePopup) {
    elements.renameCancel.click()
  }
}

function handleClearRename(e, elements) {
  e.stopPropagation()
  elements.renameInput.value = ""
  elements.renameInput.classList.remove("error")
  const language = localStorage.getItem("appLanguage") || "en"
  elements.renameInput.placeholder = translations[language].renamePlaceholder
  elements.renameInput.focus()
}

function handleAddToFolder(e, elements) {
  e.stopPropagation()
  const bookmarkId = e.target.dataset.id
  if (!bookmarkId) {
    console.error("Bookmark ID is undefined in handleAddToFolder")
    const language = localStorage.getItem("appLanguage") || "en"
    showCustomPopup(translations[language].errorUnexpected, "error", false)
    return
  }
  console.log("Opening add to folder popup for bookmarkId:", bookmarkId)
  openAddToFolderPopup(elements, [bookmarkId])
  e.target.closest(".dropdown-menu").classList.add("hidden")
}

function handleDeleteBookmark(e, elements) {
  e.stopPropagation()
  const bookmarkId = e.target.dataset.id
  const language = localStorage.getItem("appLanguage") || "en"
  if (!bookmarkId) {
    console.error("Bookmark ID is undefined in handleDeleteBookmark")
    showCustomPopup(translations[language].errorUnexpected, "error", false)
    return
  }
  showCustomConfirm(translations[language].deleteConfirm, () => {
    safeChromeBookmarksCall("remove", [bookmarkId], () => {
      getBookmarkTree((bookmarkTreeNodes) => {
        if (bookmarkTreeNodes) {
          renderFilteredBookmarks(bookmarkTreeNodes, elements)
          showCustomPopup(
            translations[language].deleteBookmarkSuccess ||
              "Bookmark deleted successfully!",
            "success"
          )
        } else {
          console.error("Failed to retrieve bookmark tree")
          showCustomPopup(
            translations[language].errorUnexpected ||
              "An unexpected error occurred",
            "error",
            false
          )
        }
      })
    })
  })
  e.target.closest(".dropdown-menu").classList.add("hidden")
}

function handleRenameBookmark(e, elements) {
  e.stopPropagation()
  const bookmarkId = e.target.dataset.id
  const language = localStorage.getItem("appLanguage") || "en"
  console.log("handleRenameBookmark called, bookmarkId:", bookmarkId)

  if (!bookmarkId) {
    console.error("Bookmark ID is undefined in handleRenameBookmark")
    showCustomPopup(translations[language].errorUnexpected, "error", false)
    return
  }

  const renamePopup = document.getElementById("rename-popup")
  const renameInput = document.getElementById("rename-input")
  if (!renamePopup || !renameInput) {
    console.error("Rename popup or input element is missing", {
      renamePopup: !!renamePopup,
      renameInput: !!renameInput,
    })
    showCustomPopup(
      translations[language].popupNotFound || "Rename popup not found",
      "error",
      false
    )
    return
  }

  console.log("Setting currentBookmarkId:", bookmarkId)
  setCurrentBookmarkId(bookmarkId)
  renameInput.value = ""
  renameInput.classList.remove("error")
  renameInput.placeholder = translations[language].renamePlaceholder
  renamePopup.classList.remove("hidden")
  renameInput.focus()

  safeChromeBookmarksCall("get", [bookmarkId], (bookmark) => {
    if (chrome.runtime.lastError) {
      console.error(
        "Error retrieving bookmark:",
        chrome.runtime.lastError.message
      )
      showCustomPopup(
        translations[language].errorUnexpected ||
          "An unexpected error occurred",
        "error",
        false
      )
      renamePopup.classList.add("hidden")
      setCurrentBookmarkId(null)
      return
    }

    if (bookmark && bookmark[0]) {
      console.log("Bookmark retrieved:", bookmark[0])
      if (!bookmark[0].url) {
        console.error("Selected item is not a bookmark, ID:", bookmarkId)
        showCustomPopup(
          translations[language].errorNotABookmark ||
            "Selected item is not a bookmark",
          "error",
          false
        )
        renamePopup.classList.add("hidden")
        setCurrentBookmarkId(null)
        return
      }
      renameInput.value = bookmark[0].title || ""
      console.log("Rename input value set to:", renameInput.value)
    } else {
      console.error("Bookmark not found for ID:", bookmarkId)
      showCustomPopup(
        translations[language].bookmarkNotFound || "Bookmark not found",
        "error",
        false
      )
      renamePopup.classList.add("hidden")
      setCurrentBookmarkId(null)
    }
  })

  e.target.closest(".dropdown-menu").classList.add("hidden")
}

function handleBookmarkCheckbox(e, elements) {
  e.stopPropagation()
  const bookmarkId = e.target.dataset.id
  if (!bookmarkId) {
    console.error("Bookmark ID is undefined in handleBookmarkCheckbox", {
      checkbox: e.target,
      dataset: e.target.dataset,
    })
    return
  }
  console.log(
    "Checkbox changed, bookmarkId:",
    bookmarkId,
    "checked:",
    e.target.checked
  )
  if (e.target.checked) {
    uiState.selectedBookmarks.add(bookmarkId)
  } else {
    uiState.selectedBookmarks.delete(bookmarkId)
  }
  console.log(
    "Updated selectedBookmarks:",
    Array.from(uiState.selectedBookmarks)
  )
  elements.addToFolderButton.classList.toggle(
    "hidden",
    uiState.selectedBookmarks.size === 0
  )
  console.log(
    "Add to folder button hidden:",
    elements.addToFolderButton.classList.contains("hidden")
  )
}
