<script setup>
import { useAuthUserStore } from '@/stores/authUser'
import { onMounted, ref, computed, watch } from 'vue'

// Store and display breakpoint
const authStore = useAuthUserStore()

//display for desktop & mobile
import { useDisplay, useTheme } from 'vuetify'
const { mobile, smAndDown } = useDisplay()
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
  <v-responsive>
    <v-app :theme="theme">
      <v-app-bar
        class="px-6 header-bar"
        :color="themeMode === 'light' ? 'light-blue-lighten-1' : 'light-blue-accent-4'"
        elevation="2"
        :height="70"
      >
        <!-- Logo and Title Section -->
        <div class="d-flex align-center header-content">
          <div class="logo-container">
            <v-img
              src="logo.png"
              :width="mobile ? '45px' : '50px'"
              :height="mobile ? '45px' : '50px'"
              class="logo-image"
              cover
            />
          </div>

          <div class="title-container">
            <h1 :class="['parish-title', smAndDown ? 'small-title' : 'large-title']">
              SAN ISIDRO LABRADOR PARISH
            </h1>
            <div class="subtitle" v-if="!smAndDown">Parish Information & Booking System</div>
          </div>
        </div>

        <v-spacer></v-spacer>

        <!-- Only show toggle on desktop -->
        <div v-if="!mobile" class="d-flex align-center actions-container">
          <v-switch
            v-model="isDark"
            color="primary"
            hide-details
            class="theme-switch"
            @change="onClick"
          >
            <template #thumb>
              <v-icon size="20" :color="isDark ? 'white' : '#FDB813'">
                {{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
              </v-icon>
            </template>
          </v-switch>

          <v-btn class="ml-4 menu-btn" icon elevation="2" @click="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </div>

        <!-- Mobile Menu Button -->
        <v-btn v-else icon class="menu-btn" elevation="2" @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <!-- Hamburger -->
        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- DRAWER MENU -->
      <v-navigation-drawer v-model="drawer" temporary location="right">
        <v-list>
          <!--Toggle in drawer for mobile -->
          <v-list-item>
            <RouterLink to="/admin-dashboard" class="router-link">
              <span class>Dashboard</span>
            </RouterLink>
          </v-list-item>
          <v-divider></v-divider>

          <!--Wedding Mass -->
          <v-list-item>
            <RouterLink to="/admin-booking-view" class="router-link">
              <span class>Special Wedding Mass</span>
            </RouterLink>
          </v-list-item>

          <v-divider></v-divider>

          <!--Funeral Mass-->
          <v-list-item>
            <RouterLink to="/funeral-mass-form-bookinglist-view" class="router-link">
              <span>Funeral Mass</span>
            </RouterLink>
          </v-list-item>

          <v-divider></v-divider>

          <!--Batism Mass-->
          <RouterLink to="/baptism-mass-form-bookinglist-view" class="router-link">
            <v-list-item><span>Baptism Mass</span></v-list-item>
          </RouterLink>

          <v-divider></v-divider>

          <!--Thanks Giving Mass-->
          <RouterLink to="/thanksgiving-mass-form-bookinglist-view" class="router-link">
            <v-list-item><span>Thanks Giving Mass</span></v-list-item>
          </RouterLink>
          <v-divider></v-divider>

          <!--Toggle-->
          <v-list-item v-if="mobile" @click="isDark = !isDark">
            <v-icon class="me-2">
              {{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
            </v-icon>
            <span>{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>
          </v-list-item>

          <!--Log out-->
          <v-list-item>
            <v-btn flat @click="onLogout">Log Out</v-btn>
          </v-list-item>
        </v-list>
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
.header-bar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.header-content {
  gap: 16px;
}

.logo-container {
  padding: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.logo-container:hover {
  transform: scale(1.05);
}

.logo-image {
  border-radius: 6px;
}

.title-container {
  display: flex;
  flex-direction: column;
}

.parish-title {
  font-family: 'Jomolhari', serif;
  margin: 0;
  color: #000;
  text-transform: uppercase;
}

.large-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1.5px;
  line-height: 1.2;
}

.small-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 14px;
  color: #424242;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.actions-container {
  gap: 16px;
}

.theme-switch {
  transform: scale(1.2);
  transform-origin: right center;
}

.menu-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* Animation for theme switch */
.v-switch {
  transition: all 0.3s ease;
}

.v-switch:hover {
  transform: scale(1.1) translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .header-bar {
    height: 60px;
  }

  .logo-container {
    padding: 2px;
  }
}
</style>
