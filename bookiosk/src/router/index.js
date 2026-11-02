import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainView from '../views/MainView.vue'
import SignUpView from '../views/SignUpView.vue'
import SignInView from '../views/SignInView.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import BookDetailsView from '../views/BookDetailsView.vue'
import ShelfView from '../views/ShelfView.vue'


const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { guestOnly: true } },
  { path: '/mainview', name: 'main', component: MainView},
  { path: '/signup', name: 'signup', component: SignUpView},
  { path: '/signin', name: 'signin', component: SignInView},
  { path: '/forgotpassword', name: 'forgotpassword', component: ForgotPassword},
  { path: '/book/:id', name: 'book-details', component: BookDetailsView },
  { path: '/shelf', name: 'shelf', component: ShelfView }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
