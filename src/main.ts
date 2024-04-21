import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAccountStore } from '~src/stores/account'
import { useClientStore } from '~src/stores/client'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// @ts-ignore
window.accountStore = useAccountStore()

// @ts-ignore
window.clientStore = useClientStore()
