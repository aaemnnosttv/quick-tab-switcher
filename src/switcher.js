import devtools from '@vue/devtools'
import Vue from 'vue'
import Switcher from 'components/Switcher.vue'

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === 'development') {
  try {
    devtools.connect()
  } catch (e) {
    console.log(
      'Vue Devtools not connected. Make sure remote devtools are running.'
    )
  }
}

/* eslint-disable-next-line no-new */
new Vue({
  el: '#switcher',
  render: h => h(Switcher)
})
