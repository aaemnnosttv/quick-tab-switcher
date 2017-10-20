<template>
  <div class="tab-list">

    <tab v-for="tab in tabs"
      :id="tab.id"
      :url="tab.url"
      :title="tab.title"
      :incognito="tab.incognito"
      :fav-icon-url="tab.favIconUrl"
      :highlighted="tab.id === highlightedTab"
      :on-hover="highlightTab"
    ></tab>

  </div>
</template>

<script>
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import Tab from './Tab.vue'
import Events from '../EventBus'

export default {
  name: 'tab-list',
  props: {
    tabs: [],
    search: ''
  },
  components: {
    Tab
  },
  data() {
    return {
      highlightedTabId: null
    }
  },
  watch: {
    search() {
      this.highlightedTabId = null
    }
  },
  methods: {
    highlightTab(tabId) {
      this.highlightedTabId = tabId
    },
    highlightPreviousTab() {
      let curIdx = findIndex(this.tabs, { id: this.highlightedTabId })
      let prevIdx = curIdx - 1

      if (prevIdx > -1) {
        this.highlightTab(this.tabs[prevIdx].id)
      }
    },
    highlightNextTab() {
      let curIdx = findIndex(this.tabs, { id: this.highlightedTabId })
      let nextIdx = curIdx + 1

      if (nextIdx <= this.tabs.length) {
        this.highlightTab(this.tabs[nextIdx].id)
      }
    },
    removeHighlightedTab() {
      let tabId = this.highlightedTabId
      let tabIdx = findIndex(this.tabs, { id: tabId })
      let method = this.tabs.length === tabIdx + 1 ? 'highlightPreviousTab' : 'highlightNextTab'
      this[ method ]()
      Events.$emit('closeTab', tabId)
    }
  },
  computed: {
    highlightedTab() {
      if (find(this.tabs, { id: this.highlightedTabId })) {
        return this.highlightedTabId
      }

      if (this.tabs.length) {
        this.highlightedTabId = this.tabs[0].id
      }

      return this.highlightedTabId
    }
  },
  mounted: function() {
    Events.$on('switcher:prevTab', this.highlightPreviousTab)
    Events.$on('switcher:nextTab', this.highlightNextTab)
    Events.$on('switcher:swichToHighlighted', () => Events.$emit('switchToTab', this.highlightedTabId))
    Events.$on('switcher:removeHighlighted', this.removeHighlightedTab)
  }
}
</script>

<style lang="stylus" scoped>
.tab-list
  flex 1

pre
  background #444
  color #c0c0c0
  margin 0
  padding 1em
</style>
