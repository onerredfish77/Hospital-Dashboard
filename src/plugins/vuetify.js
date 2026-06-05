import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const hospitalTheme = {
  dark: false,
  colors: {
    primary: '#1565C0',
    secondary: '#00838F',
    success: '#2E7D32',
    warning: '#F57F17',
    error: '#C62828',
    info: '#0277BD',
    background: '#F5F7FA',
    surface: '#FFFFFF',
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
