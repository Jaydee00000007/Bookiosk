import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainView from '../views/MainView.vue'


const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { guestOnly: true } },
  { path: '/mainview', name: 'main', component: MainView}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
