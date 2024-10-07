/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins

import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
// import vuetify from '@/plugins/vuetify'
const app = createApp(App)
import 'leaflet/dist/leaflet.css' // leaflet

registerPlugins(app)
// app.use(vuetify)
app.mount('#app')
