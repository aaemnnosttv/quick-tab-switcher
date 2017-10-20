<template>
  <div id="switcher"
    @keydown.enter="switchToHighlighted"
    @keydown.up="prevTab"
    @keydown.ctrl.k="prevTab"
    @keydown.down="nextTab"
    @keydown.ctrl.j="nextTab"
    @keydown.ctrl.x="removeHighlighted"
    @keydown.ctrl.f="filterInput = ''"
    @keydown.esc="close"
  >
    <div class="filter-box">
      <input type="text"
        v-model="filterInput"
        ref="input"
      >
    </div>

    <tab-list
      :search="search"
      :tabs="filteredTabs"
    ></tab-list>
  </div>
</template>

<script>
import filter from 'lodash/filter'
import pick from 'lodash/pick'
import findIndex from 'lodash/findIndex'
import call from '../pcall'
import Events from '../EventBus'
import TabList from './TabList.vue'
import fuzzyFilter from '../fuzzy-matcher'
import fuzzyTransform from '../fuzzy-results-transformer'
import request from '../send-message'

export default {
  name: 'switcher',
  data() {
    return {
      tabId: null,
      tabs: [],
      filterInput: ''
    }
  },
  components: {
    TabList,
  },
  created() {
    request({ action: 'getTabs' }).then(tabs => this.$set(this, 'tabs', tabs))

    Events.$on('switcher:close', this.close)
    Events.$on('switchToTab', this.switchToTab)
    Events.$on('closeTab', this.removeTab)
  },
  methods: {
    switchToTab(tabId) {
      request({ action: 'switchToTab', tabId: tabId }).then(this.close)
    },
    removeHighlighted() {
      Events.$emit('switcher:removeHighlighted')
    },
    removeTab(tabId) {
      this.$delete(this.tabs, findIndex(this.tabs, { id: tabId }))
      chrome.tabs.remove(tabId)
    },
    prevTab() {
      Events.$emit('switcher:prevTab')
    },
    nextTab() {
      Events.$emit('switcher:nextTab')
    },
    switchToHighlighted() {
      Events.$emit('switcher:swichToHighlighted')
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
      if (! this.search.length) {
        return this.tabs
      }

      const keys = [
        { name: 'title', weight: 0.7 },
        { name: 'url', weight: 0.3 }
      ]

      const fuzzyResults = fuzzyFilter(this.tabs, this.search, { keys })

      return fuzzyTransform(fuzzyResults, '<span class="match">','</span>')
    }
  },
  mounted() {
    this.$refs.input.focus()
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
