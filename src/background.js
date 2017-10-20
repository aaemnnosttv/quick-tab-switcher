import call from './pcall'
import pick from 'lodash/pick'
import find from 'lodash/find'
import remove from 'lodash/remove'
import Events from './EventBus'
import sendClient from './send-message'

let currentSwitcherWindow
let currentTab
let lastTabs = [0,0]
let PADDING_TOP = 50
let PADDING_BOTTOM = 50
let SWITCHER_WIDTH = 600

function recordTab(id) {
  lastTabs = [id, lastTabs.shift()]
}

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
  call(chrome.windows.getCurrent, { populate: true })
    .then(currentWindow => {
      const left = currentWindow.left + Math.round((currentWindow.width - SWITCHER_WIDTH) / 2)
      const top = currentWindow.top + PADDING_TOP
      const height = Math.max(currentWindow.height - PADDING_TOP - PADDING_BOTTOM, 600)
      const width = SWITCHER_WIDTH
      currentTab = find(currentWindow.tabs, { active: true })

      recordTab(currentTab.id)

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== 'getTabs') {
    return
  }

  call(chrome.tabs.query, {})
    .then(allTabs => {
      // filter out the Switcher tab and the current tab from the results
      const tabs = allTabs.filter(tab => [currentTab.id, sender.tab.id].indexOf(tab.id) === -1)
      // check if the last tab is in the set
      const lastTab = find(tabs, tab => lastTabs.indexOf(tab.id) > -1)

      // move the last tab to the top of the list, if found
      if (lastTab) {
        remove(tabs, lastTab)
        tabs.unshift(lastTab)
      }

      sendResponse(
        tabs.map(tab => pick(tab, ['id','title','url','favIconUrl','incognito']))
      )
    })

  return true // respond asynchronously
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'switchToTab') {
    call(chrome.tabs.update, request.tabId, { active: true })
      .then(tab => call(chrome.windows.update, tab.windowId, { focused: true }))
      .done()
  }
})
