import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VChart from 'vue-echarts'

import './assets/styles/main.css'
import './plugins/echarts'
import { ensureChartJs } from './plugins/chartjs'
import vuetify from './plugins/vuetify'
import App from './App.vue'

ensureChartJs()

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.component('VChart', VChart)

app.mount('#app')
