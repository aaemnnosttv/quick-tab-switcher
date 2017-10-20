import Events from './EventBus'
import sendClient from './send-message'

let currentSwitcherWindow
let PADDING_TOP = 50
let PADDING_BOTTOM = 50
let SWITCHER_WIDTH = 600

function showSwitcher(width = 600, height = 800, left = 300, top = 150) {
  var opts = {
    width: width,
    height: height,
    left: left,
    top: top,
    url: chrome.runtime.getURL('build/switcher.html'),
    focused: true,
    type: 'popup'
  }

  chrome.windows.create(opts, createdWindow => {
    currentSwitcherWindow = createdWindow
    sendClient({ currentSwitcherWindow })
  })
}

function closeSwitcher() {
  if (! currentSwitcherWindow || ! currentSwitcherWindow.id) {
    return false
  }

  try {
    chrome.windows.remove(currentSwitcherWindow.id)
  } catch (e) {
    currentSwitcherWindow = false
    return false
  }

  currentSwitcherWindow = false

  return true
}

function toggleSwitcher() {
  chrome.windows.getCurrent(currentWindow => {
    const left = currentWindow.left + Math.round((currentWindow.width - SWITCHER_WIDTH) / 2)
    const top = currentWindow.top + PADDING_TOP
    const height = Math.max(currentWindow.height - PADDING_TOP - PADDING_BOTTOM, 600)
    const width = SWITCHER_WIDTH

    closeSwitcher() || showSwitcher(width, height, left, top)
  })
}

chrome.commands.onCommand.addListener(function(command) {
  console.log(`%c${command} %cfired!`, 'color: red', 'color: inherit')

  if (command == 'toggle_tab_switcher') {
    toggleSwitcher()
  }
})

chrome.windows.onRemoved.addListener(windowId => {
  if (currentSwitcherWindow && windowId === currentSwitcherWindow.id) {
    currentSwitcherWindow = null
  }
})

