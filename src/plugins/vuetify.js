/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { zhHant } from 'vuetify/locale'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes:{
      light:{
        colors:{
          primary:'#A7D9D6',
          secondary:'#D8C6AB',
          third:'#f0e5d3',
          accent:'#FBC255',
          info:'#D9D9D9'
        }
      }
    }
  },
  locale:{
    locale: 'zhHant',
    messages: { zhHant }
  }
})
