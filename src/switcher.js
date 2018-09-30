import devtools from '@vue/devtools'
import Vue from 'vue'
import Switcher from 'components/Switcher.vue'

let closeHandler = window.close

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === 'development') {
  try {
    devtools.connect()
  } catch (e) {
    console.log(
      'Vue Devtools not connected. Make sure remote devtools are running.'
    )
  }

  closeHandler = () => {
    console.log('Switcher close triggered - window preserved for development.')
  }
}

/* eslint-disable-next-line no-new */
new Vue({
  el: '#switcher',
  render: h =>
    h(Switcher, {
      on: {
        close: closeHandler
      }
    })
})
