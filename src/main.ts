import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import './style.css'
import App from './App.vue'
import Dashboard from './views/Dashboard.vue'
import RevenueAnalysis from './views/RevenueAnalysis.vue'
import InventoryManagement from './views/InventoryManagement.vue'
import ProductRegistration from './views/ProductRegistration.vue'

const pinia = createPinia()

const routes = [
  { path: '/', component: Dashboard },
  { path: '/revenue', component: RevenueAnalysis },
  { path: '/inventory', component: InventoryManagement },
  { path: '/product-registration', component: ProductRegistration }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: toast.POSITION.TOP_RIGHT,
  theme: 'light'
})
app.mount('#app')