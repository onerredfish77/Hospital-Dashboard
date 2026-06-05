import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const hospitalTheme = {
  dark: true,
  colors: {
    primary: '#42A5F5',
    secondary: '#26C6DA',
    success: '#66BB6A',
    warning: '#FFB74D',
    error: '#EF5350',
    info: '#4FC3F7',
    background: '#0F1626',
    surface: '#1A2236',
    'surface-variant': '#243049',
    'on-surface': '#E3E8F2',
    'on-background': '#E3E8F2',
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'hospitalTheme',
    themes: {
      hospitalTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})
