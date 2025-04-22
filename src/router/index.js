//import { isAuthenticated } from '@/utils/supabase'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import HomePage from '@/views/auth/HomePage.vue'
import BookEvent from '@/views/auth/BookEvent.vue'
import WeddingMassForm from '@/views/auth/WeddingMassForm.vue'
import BaptismMass from '@/views/auth/BaptismMass.vue'
import FuneralMass from '@/views/auth/FuneralMass.vue'
import ThanksGivingMass from '@/views/auth/ThanksGivingMass.vue'
import TrialHeader from '@/views/TrialHeader.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/book-event',
      name: 'book-event',
      component: BookEvent,
    },
    {
      path: '/wedding-mass-form',
      name: 'wedding-mass-form',
      component: WeddingMassForm,
    },
    {
      path: '/baptism-mass',
      name: 'baptism-mass',
      component: BaptismMass,
    },
    {
      path: '/funeral-mass',
      name: 'funeral-mass',
      component: FuneralMass,
    },
    {
      path: '/thanks-giving-mass',
      name: 'thanks-giving-mass',
      component: ThanksGivingMass,
    },

    {
      path: '/trial-header',
      name: 'trial-header',
      component: TrialHeader,
    },
  ],
})

/* 
router.beforeEach(async (to) => {
  const isLoggedIn = await isAuthenticated()

  // Redirect to appropriate page if accessing home route
  if (to.name === 'home') {
    return isLoggedIn ? { name: 'home' } : { name: 'login' }
  }

  // If logged in, prevent access to login or register pages
  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    // redirect the user to the dashboard page
    return { name: 'home' }
  }

  // If not logged in, prevent access to system pages
  if (!isLoggedIn && to.meta.requiresAuth) {
    // redirect the user to the login page
    return { name: 'login' }
  }
})
*/
export default router
