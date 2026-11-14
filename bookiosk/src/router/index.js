import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUpView from '../views/SignUpView.vue'
import SignInView from '../views/SignInView.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import BookDetailsView from '../views/BookDetailsView.vue'
import MyShelf from '../components/MyShelf.vue'


const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { guestOnly: true } },
  { path: '/mainview', redirect: { name: 'home' } },
  { path: '/signup', name: 'signup', component: SignUpView},
  { path: '/signin', name: 'signin', component: SignInView},
  { path: '/forgotpassword', name: 'forgotpassword', component: ForgotPassword},
  { path: '/book/:id', name: 'book-details', component: BookDetailsView },
  { path: '/shelf', name: 'shelf', component: MyShelf }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
    scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  },
})

export default router
