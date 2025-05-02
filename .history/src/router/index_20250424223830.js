import { getUserInformation, isAuthenticated } from '@/utils/supabase'
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
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminAnnouncementManager from '@/views/admin/AdminAnnouncementManager.vue'
import AdminBookingsView from '@/views/admin/AdminBookingsView.vue'
import NotFoundView from '@/views/error/NotFoundView.vue'
import FFBookingListView from '@/views/admin/FFBookingListView.vue'
import BFBookingListView from '@/views/admin/BFBookingListView.vue'
import TGBookingListView from '@/views/admin/TGBookingListView.vue'
import ForbiddenView from '@/views/error/ForbiddenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/homepage',
      name: 'homepage',
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
      path: '/admin/admin-dashboard',
      name: 'admin-dashboard',
      component: AdminDashboard,
    },
    {
      path: '/admin/admin-booking-view',
      name: 'admin-booking-view',
      component: AdminBookingsView,
    },
    {
      path: '/admin/admin-announcement-manager',
      name: 'admin-announcement-manager',
      component: AdminAnnouncementManager,
    },
    {
      path: '/trial-header',
      name: 'trial-header',
      component: TrialHeader,
    },
    {
      path: '/page-not-found',
      name: 'page-not-found',
      component: NotFoundView,
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
    },
    {
      path: '/funeral-mass-form-bookinglist-view',
      name: 'funeral-mass-form-bookinglist-view',
      component: FFBookingListView,
    },
    {
      path: '/baptism-mass-form-bookinglist-view',
      name: 'baptism-mass-form-bookinglist-view',
      component: BFBookingListView,
    },
    {
      path: '/thanksgiving-mass-form-bookinglist-view',
      name: 'thanksgiving-mass-form-bookinglist-view',
      component: TGBookingListView,
    },
  ],
})

router.beforeEach(async (to) => {
  const isLoggedIn = await isAuthenticated()
  const userMetadata = await getUserInformation()

  const isAdmin = userMetadata.is_admin === true

  // Redirect to appropriate page if accessing home route
  if (to.name === 'home') {
    return isLoggedIn ? { name: 'homepage' } : { name: 'login' }
  }

  // If logged in, prevent access to login or register pages
  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    // redirect the user to the dashboard page
    return { name: 'homepage' }
  }

  // Check user if the user is logged in or not admin
  if (isLoggedIn && !isAdmin) {
    if (to.path.startsWith('/admin/users')) {
      return { name: 'forbidden' }
    }
  }

  // If not logged in, prevent access to system pages
  if (!isLoggedIn && to.path.startsWith('/admin')) {
    // redirect the user to the login page
    return { name: 'login' }
  }

  if (router.resolve(to).matched.length === 0) {
    return { name: 'page-not-found' }
  }
})

export default router
