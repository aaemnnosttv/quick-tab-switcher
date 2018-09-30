<template>
  <div :data-id="id" :class="classes"
    @mouseover="hovered"
    @click="switchTo"
  >
    <div class="favicon">
      <img :src="favIconUrl" alt="">
    </div>

    <div class="info">
      <div class="title" v-html="title"></div>
      <div class="url" v-html="url"></div>
    </div>

    <div class="last">
      <a href="#" @click.stop="close" class="close">&times;</a>
    </div>
  </div>
</template>

<script>
import Tab from './Tab.vue'

export default {
  props: {
    id: null,
    url: '',
    title: '',
    favIconUrl: '',
    incognito: false,
    highlighted: false,
    onHover: null
  },
  data() {
    return {
    }
  },
  computed: {
    classes() {
      return {
        tab: true,
        highlighted: this.highlighted,
        incognito: this.incognito
      }
    }
  },
  methods: {
    hovered() {
      this.onHover(this.id)
    },
    switchTo() {
    },
    close() {
    }
  }
}
</script>

<style lang="stylus" scoped>
.tab
  display flex
  padding .5rem 0
  width 100%
  border-top 1px solid #8d8e8f
  background #f0f0f0
  text-align left
  justify-content space-between

  &:hover
    cursor pointer

  &.highlighted
    background white

  + .incognito
    border-top 1px solid #545454

.info
  flex 1
  overflow hidden

.title, .url
  max-width 100%
  white-space nowrap
  overflow hidden
  text-overflow: ellipsis

>>> .match
  font-weight bold

.title
  font-size 14px

.url
  color #888

.favicon, .last
  width 32px
  display flex
  align-items center
  justify-content center
  img
    width 16px
    height 16px

.close
  display none
  font-size 24px
  text-decoration none
  color #999
  margin-top -0.3rem
  &:hover
    color #444

.tab.highlighted .close
  display block

.tab.incognito
  background #303030

  &.highlighted
    background #464646

  .title
    color #d4d4d4

  .url
    color #8a8a8a

</style>
