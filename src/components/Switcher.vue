<template>
  <div id="switcher"
    @keydown.enter="switchToHighlighted"
    @keydown.up="highlightPreviousTab"
    @keydown.ctrl.k="highlightPreviousTab"
    @keydown.down="highlightNextTab"
    @keydown.ctrl.j="highlightNextTab"
    @keydown.ctrl.x="removeHighlightedTab"
    @keydown.ctrl.f="filterInput = ''"
    @keydown.esc="close"
  >
    <div class="filter-box">
      <input type="text"
        v-model="filterInput"
        ref="input"
      >
    </div>

    <div class="tab-list">
      <tab v-for="tab in filteredTabs" :key="tab.id"
        :id="tab.id"
        :url="tab.url"
        :title="tab.title"
        :incognito="tab.incognito"
        :fav-icon-url="tab.favIconUrl"
        :highlighted="tab.id === highlightedTabId"
        @highlight="highlightTab(tab.id)"
        @switchTo="switchToTab(tab.id)"
        @close="removeTab(tab.id)"
      ></tab>
    </div>
  </div>
</template>

<script>
import browser from 'webextension-polyfill'
import filter from 'lodash/filter'
import pick from 'lodash/pick'
import findIndex from 'lodash/findIndex'
import Tab from './Tab.vue'
import fuzzyFilter from '../fuzzy-matcher'
import fuzzyTransform from '../fuzzy-results-transformer'

export default {
  data() {
    return {
      highlightedTabId: null,
      tabId: null,
      tabs: [],
      filterInput: ''
    }
  },
  components: {
    Tab
  },
  created() {
    browser.runtime
      .sendMessage({ action: 'getTabs' })
      .then(tabs => this.$set(this, 'tabs', tabs))
  },
  methods: {
    highlightTab(tabId) {
      this.highlightedTabId = tabId
    },
    highlightPreviousTab() {
      const curIdx = findIndex(this.filteredTabs, { id: this.highlightedTabId })
      const prevIdx = curIdx - 1

      if (prevIdx > -1) {
        this.highlightTab(this.filteredTabs[prevIdx].id)
      } else {
        this.highlightTab(this.lastTabId)
      }
    },
    highlightNextTab() {
      const curIdx = findIndex(this.filteredTabs, { id: this.highlightedTabId })
      const nextIdx = curIdx + 1

      if (nextIdx < this.filteredTabs.length) {
        this.highlightTab(this.filteredTabs[nextIdx].id)
      } else {
        this.highlightTab(this.firstTabId)
      }
    },
    removeHighlightedTab() {
      const tabId = this.highlightedTabId
      const tabIdx = findIndex(this.filteredTabs, { id: tabId })
      const method =
        this.filteredTabs.length === tabIdx + 1
          ? 'highlightPreviousTab'
          : 'highlightNextTab'

      this[method]()
      this.removeTab(tabId)
    },
    switchToTab(tabId) {
      browser.runtime
        .sendMessage({ action: 'switchToTab', tabId: tabId })
        .then(this.close)
    },
    removeTab(tabId) {
      this.$delete(this.tabs, findIndex(this.tabs, { id: tabId }))
      browser.tabs.remove(tabId)
    },
    switchToHighlighted() {
      this.switchToTab(this.highlightedTabId)
    },
    close() {
      window.close()
    }
  },
  computed: {
    search() {
      return this.filterInput.trim()
    },
    filteredTabs() {
      if (!this.search.length) {
        return this.tabs
      }

      const keys = [
        { name: 'title', weight: 0.7 },
        { name: 'url', weight: 0.3 }
      ]

      const fuzzyResults = fuzzyFilter(this.tabs, this.search, { keys })

      return fuzzyTransform(fuzzyResults, '<span class="match">', '</span>')
    },
    firstTabId() {
      if (!this.filteredTabs || !this.filteredTabs.length) {
        return null
      }

      return this.filteredTabs[0].id
    },
    lastTabId() {
      if (!this.filteredTabs || !this.filteredTabs.length) {
        return null
      }

      return this.filteredTabs[this.filteredTabs.length - 1].id
    }
  },
  mounted() {
    this.$refs.input.focus()
  },
  watch: {
    filteredTabs(value) {
      if (!this.highlightedTabId && this.firstTabId) {
        this.highlightTab(this.firstTabId)
      }
    },
    search() {
      this.highlightTab(this.firstTabId)
    }
  }
}
</script>

<style lang="stylus" scoped>
#switcher
  display flex
  flex-direction column
  width 100%
  font-family Helvetica, Arial, sans-serif
  text-align center
  color #2c3e50

.filter-box
  background #f0f0f0
  border-top 1px solid #8d8e8f
  border-bottom 2px solid #8d8e8f
  padding .8rem
  input
    box-sizing border-box
    border-radius: 4px;
    border: 1px solid #8d8e8f;
    width 100%
    font-size 1.8em
    line-height 2em
    padding 0 0.4em
    &:focus
      outline none
</style>
