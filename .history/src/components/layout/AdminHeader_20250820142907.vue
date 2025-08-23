<script setup>
import { useAuthUserStore } from '@/stores/authUser'
import { onMounted, ref, computed, watch } from 'vue'

// Store and display breakpoint
const authStore = useAuthUserStore()

//display for desktop & mobile
import { useDisplay, useTheme } from 'vuetify'
const { mobile, smAndDown, mdAndDown } = useDisplay()
const theme = useTheme()

// Theme Mode (localStorage)
const themeMode = ref(localStorage.getItem('theme') ?? 'light')

const isDark = computed({
  get: () => themeMode.value === 'dark',
  set: (val) => {
    themeMode.value = val ? 'dark' : 'light'
    localStorage.setItem('theme', themeMode.value)
  },
})

// Sync Vuetify theme dynamically
watch(themeMode, (val) => {
  theme.global.name.value = val
})

const isLoggedIn = ref(false)
const drawer = ref(false)

function onClick() {
  localStorage.setItem('theme', themeMode.value)
}

onMounted(async () => {
  isLoggedIn.value = await authStore.isAuthenticated()
  theme.global.name.value = themeMode.value // Set on mount
})
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <!-- Enhanced Header -->
      <v-app-bar
        class="header-container"
        :color="themeMode === 'light' ? 'light-blue-lighten-1' : 'light-blue-accent-4'"
        height="80"
        border
        elevation="4"
      >
        <!-- Left Section - Logo and Title -->
        <div class="d-flex align-center header-brand">
          <!-- Logo Container with subtle shadow -->
          <div class="logo-container">
            <v-img
              src="logo.png"
              :width="mobile ? '50px' : '60px'"
              :height="mobile ? '50px' : '60px'"
              class="logo-image"
              cover
            />
          </div>

          <!-- Title Section -->
          <div class="title-section ml-4">
            <h1 :class="mobile ? 'title-mobile' : 'title-desktop'" class="parish-title">
              SAN ISIDRO LABRADOR PARISH
            </h1>
            <p class="parish-subtitle" v-if="!mobile">
              Information Management System
            </p>
          </div>
        </div>

        <v-spacer></v-spacer>

        <!-- Right Section - Theme Toggle and Menu -->
        <div class="d-flex align-center header-actions">
          <!-- Desktop Theme Toggle -->
          <div v-if="!mobile" class="theme-toggle-container">
            <v-btn
              :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
              :color="themeMode === 'light' ? 'white' : 'amber'"
              variant="text"
              size="large"
              class="theme-btn"
              @click="isDark = !isDark; onClick()"
            >
            </v-btn>
          </div>

          <!-- Hamburger Menu -->
          <v-btn
            icon="mdi-menu"
            variant="text"
            size="large"
            class="menu-btn ml-2"
            @click="drawer = !drawer"
          >
          </v-btn>
        </div>
      </v-app-bar>

      <!-- Enhanced Drawer Menu -->
      <v-navigation-drawer
        v-model="drawer"
        temporary
        location="right"
        width="320"
        class="drawer-enhanced"
      >
        <!-- Drawer Header -->
        <div class="drawer-header pa-4">
          <div class="d-flex align-center">
            <v-img src="logo.png" width="40px" height="40px" class="me-3"></v-img>
            <div>
              <h3 class="drawer-title">Parish System</h3>
              <p class="drawer-subtitle">Administration Panel</p>
            </div>
          </div>
        </div>

        <v-divider class="mb-2"></v-divider>

        <v-list nav class="drawer-list">
          <!-- Dashboard -->
          <v-list-item
            prepend-icon="mdi-view-dashboard"
            class="nav-item"
            rounded="xl"
          >
            <RouterLink to="/admin-dashboard" class="router-link">
              <v-list-item-title class="nav-title">Dashboard</v-list-item-title>
            </RouterLink>
          </v-list-item>

          <!-- Wedding Mass -->
          <v-list-item
            prepend-icon="mdi-heart"
            class="nav-item"
            rounded="xl"
          >
            <RouterLink to="/admin-booking-view" class="router-link">
              <v-list-item-title class="nav-title">Special Wedding Mass</v-list-item-title>
            </RouterLink>
          </v-list-item>

          <!-- Funeral Mass -->
          <v-list-item
            prepend-icon="mdi-cross"
            class="nav-item"
            rounded="xl"
          >
            <RouterLink to="/funeral-mass-form-bookinglist-view" class="router-link">
              <v-list-item-title class="nav-title">Funeral Mass</v-list-item-title>
            </RouterLink>
          </v-list-item>

          <!-- Baptism Mass -->
          <v-list-item
            prepend-icon="mdi-water"
            class="nav-item"
            rounded="xl"
          >
            <RouterLink to="/baptism-mass-form-bookinglist-view" class="router-link">
              <v-list-item-title class="nav-title">Baptism Mass</v-list-item-title>
            </RouterLink>
          </v-list-item>

          <!-- Thanksgiving Mass -->
          <v-list-item
            prepend-icon="mdi-hands-pray"
            class="nav-item"
            rounded="xl"
          >
            <RouterLink to="/thanksgiving-mass-form-bookinglist-view" class="router-link">
              <v-list-item-title class="nav-title">Thanksgiving Mass</v-list-item-title>
            </RouterLink>
          </v-list-item>

          <!-- Mobile Theme Toggle -->
          <v-list-item
            v-if="mobile"
            :prepend-icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
            class="nav-item"
            rounded="xl"
            @click="isDark = !isDark; onClick()"
          >
            <v-list-item-title class="nav-title">
              {{ isDark ? 'Dark Mode' : 'Light Mode' }}
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <!-- Drawer Footer -->
        <template v-slot:append>
          <div class="pa-4">
            <v-btn
              block
              variant="outlined"
              color="error"
              prepend-icon="mdi-logout"
              @click="onLogout"
              class="logout-btn"
            >
              Log Out
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <!-- MAIN CONTENT -->
      <v-main>
        <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style scoped>
/* Header Styles */
.header-container {
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.header-brand {
  flex: 1;
}

.logo-container {
  position: relative;
}

.logo-image {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

.title-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.parish-title {
  font-family: 'Jomolhari', 'Georgia', serif;
  font-weight: 700;
  letter-spacing: 1.2px;
  margin: 0;
  color: #1a1a1a;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  line-height: 1.1;
}

.title-desktop {
  font-size: 24px;
}

.title-mobile {
  font-size: 18px;
  letter-spacing: 0.8px;
}

.parish-subtitle {
  font-family: 'Inter', 'Arial', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #4a4a4a;
  margin: 2px 0 0 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.header-actions {
  gap: 8px;
}

.theme-btn, .menu-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.theme-btn:hover, .menu-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Drawer Styles */
.drawer-enhanced {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
}

.drawer-header {
  background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%);
  color: white;
  margin: 0;
}

.drawer-title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.drawer-subtitle {
  font-size: 12px;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}

.drawer-list {
  padding: 16px;
}

.nav-item {
  margin-bottom: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(66, 165, 245, 0.1);
}

.nav-item:hover {
  background: rgba(66, 165, 245, 0.1);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(66, 165, 245, 0.2);
}

.nav-title {
  font-weight: 500;
  font-size: 15px;
}

.router-link {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
}

.logout-btn {
  font-weight: 600;
  border-width: 2px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

/* Dark mode adjustments */
.v-theme--dark .parish-title {
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.v-theme--dark .parish-subtitle {
  color: #e0e0e0;
}

.v-theme--dark .drawer-enhanced {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.v-theme--dark .nav-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(66, 165, 245, 0.2);
}

.v-theme--dark .nav-item:hover {
  background: rgba(66, 165, 245, 0.15);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .title-section {
    margin-left: 12px !important;
  }

  .parish-subtitle {
    display: none;
  }
}

/* Animation for drawer items */
.nav-item {
  animation: slideInRight 0.3s ease forwards;
}

.nav-item:nth-child(1) { animation-delay: 0.1s; }
.nav-item:nth-child(2) { animation-delay: 0.15s; }
.nav-item:nth-child(3) { animation-delay: 0.2s; }
.nav-item:nth-child(4) { animation-delay: 0.25s; }
.nav-item:nth-child(5) { animation-delay: 0.3s; }

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
