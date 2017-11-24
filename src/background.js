import browser from 'webextension-polyfill'
import pick from 'lodash/pick'
import find from 'lodash/find'
import remove from 'lodash/remove'

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
  const opts = {
    width,
    height,
    left,
    top,
    url: browser.runtime.getURL('build/switcher.html'),
    focused: true,
    type: 'popup'
  }

  browser.windows.create(opts).then(createdWindow => currentSwitcherWindow = createdWindow)
}

function closeSwitcher() {
  if (! currentSwitcherWindow || ! currentSwitcherWindow.id) {
    return false
  }

  browser.windows.remove(currentSwitcherWindow.id)
  currentSwitcherWindow = false

  return true
}

function toggleSwitcher() {
  browser.windows.getCurrent({ populate: true }).then(currentWindow => {
    const left = currentWindow.left + Math.round((currentWindow.width - SWITCHER_WIDTH) / 2)
    const top = currentWindow.top + PADDING_TOP
    const height = Math.max(currentWindow.height - PADDING_TOP - PADDING_BOTTOM, 600)
    const width = SWITCHER_WIDTH
    currentTab = find(currentWindow.tabs, { active: true })

    recordTab(currentTab.id)

    closeSwitcher() || showSwitcher(width, height, left, top)
  })
}

browser.commands.onCommand.addListener(command => {
  console.log(`%c${command} %cfired!`, 'color: red', 'color: inherit')

  if (command == 'toggle_tab_switcher') {
    toggleSwitcher()
  }
})

browser.windows.onRemoved.addListener(windowId => {
  if (currentSwitcherWindow && windowId === currentSwitcherWindow.id) {
    currentSwitcherWindow = null
  }
})

browser.runtime.onMessage.addListener((request, sender) => {
  if (request.action !== 'getTabs') {
    return
  }

  return browser.tabs.query({}).then(allTabs => {
    // filter out the Switcher tab and the current tab from the results
    const tabs = allTabs.filter(tab => [currentTab.id, sender.tab.id].indexOf(tab.id) === -1)
    // check if the last tab is in the set
    const lastTab = find(tabs, tab => lastTabs.indexOf(tab.id) > -1)

    // move the last tab to the top of the list, if found
    if (lastTab) {
      remove(tabs, lastTab)
      tabs.unshift(lastTab)
    }

    return tabs.map(tab => pick(tab, ['id','title','url','favIconUrl','incognito']))
  })
})

browser.runtime.onMessage.addListener(request => {
  if (request.action === 'switchToTab') {
    return browser.tabs.update(request.tabId, { active: true }).then(
      tab => browser.windows.update(tab.windowId, { focused: true })
    )
  }
})
