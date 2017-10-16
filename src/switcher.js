import Vue from 'vue'
import Switcher from 'components/Switcher.vue'

/* eslint-disable no-new */
window.switcher = new Vue({
  el: '#switcher',
  render: h => h(Switcher)
})
