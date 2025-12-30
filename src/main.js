import './assets/css/variables.css'
import './assets/css/main.css'
import './assets/css/icon.css'
import './assets/css/image.css'
import './assets/css/base-form.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
