import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUpView from '../views/SignUpView.vue'
import SignInView from '../views/SignInView.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import BookDetailsView from '../views/BookDetailsView.vue'
import MyShelf from '../components/MyShelf.vue'
import ProfileView from '../views/ProfileView.vue'
import { useFirebaseAuth } from '../services/firebaseAuth'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/mainview', redirect: { name: 'home' } },
  { path: '/signup', name: 'signup', component: SignUpView, meta: { guestOnly: true } },
  { path: '/signin', name: 'signin', component: SignInView, meta: { guestOnly: true } },
  { path: '/forgotpassword', name: 'forgotpassword', component: ForgotPassword, meta: { guestOnly: true } },
  { path: '/book/:id', name: 'book-details', component: BookDetailsView },
  { path: '/shelf', name: 'shelf', component: MyShelf, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach(to => {
  const { currentUser } = useFirebaseAuth()
  if (to.meta.requiresAuth && !currentUser.value) {
    return { name: 'signin', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && currentUser.value) {
    return { name: 'home' }
  }
  return true
})

export default router
