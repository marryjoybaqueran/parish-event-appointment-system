<script setup>
import { useAuthUser Store } from '@/stores/authUser '
import { onMounted, ref, computed, watch } from 'vue'
import { useDisplay, useTheme } from 'vuetify'

const authStore = useAuthUser Store()
const { mobile, smAndDown } = useDisplay()
const theme = useTheme()

const themeMode = ref(localStorage.getItem('theme') ?? 'light')
const isDark = computed({
  get: () => themeMode.value === 'dark',
  set: (val) => {
    themeMode.value = val ? 'dark' : 'light'
    localStorage.setItem('theme', themeMode.value)
  },
})

watch(themeMode, (val) => {
  theme.global.name.value = val
})

const isLoggedIn = ref(false)
const drawer = ref(false)

function onClick() {
  localStorage.setItem('theme', themeMode.value)
}

function onLogout() {
  authStore.logout()
}

onMounted(async () => {
  isLoggedIn.value = await authStore.isAuthenticated()
  theme.global.name.value = themeMode.value
})
</script>

<template>
  <v-responsive>
    <v-app :theme="theme">
      <!-- Elegant App Bar -->
      <v-app-bar
        class="px-4 app-bar-elegant"
        :color="themeMode === 'light' ? 'light-blue-lighten-1' : 'light-blue-accent-4'"
        elevate-on-scroll
        flat
      >
        <!-- Logo + Title -->
        <div class="d-flex align-center">
          <v-img src="logo.png" :width="mobile ? '36px' : '50px'" class="me-2" cover />
          <div>
            <h2 :class="smAndDown ? 'header-title-sm' : 'header-title-lg'">
              SAN ISIDRO LABRADOR PARISH
            </h2>
            <p v-if="!mobile" class="header-sub">Parish Information System</p>
          </div>
        </div>

        <v-spacer></v-spacer>

        <!-- Theme Toggle (desktop only) -->
        <v-switch
          v-if="!mobile"
          v-model="isDark"
          inset
          hide-details
          class="theme-switch"
          @change="onClick"
        >
          <template #thumb>
            <v-icon size="20">
              {{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
            </v-icon>
          </template>
        </v-switch>

        <!-- Menu Button -->
        <v-btn icon rounded @click="drawer = !drawer">
          <v-icon size="28">mdi-menu</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- Navigation Drawer -->
      <v-navigation-drawer v-model="drawer" temporary location="right" :width="mobile ? 240 : 280">
        <v-list density="comfortable">
          <v-list-item prepend-icon="mdi-view-dashboard">
            <RouterLink to="/admin-dashboard" class="router-link">Dashboard</RouterLink>
          </v-list-item>

          <v-divider class="my-2" />

          <v-list-item prepend-icon="mdi-ring">
            <RouterLink to="/admin-booking-view" class="router-link">Special Wedding Mass</RouterLink>
          </v-list-item>

          <v-list-item prepend-icon="mdi-cross">
            <RouterLink to="/funeral-mass-form-bookinglist-view" class="router-link">Funeral Mass</RouterLink>
          </v-list-item>

          <v-list-item prepend-icon="mdi-water">
            <RouterLink to="/baptism-mass-form-bookinglist-view" class="router-link">Baptism Mass</RouterLink>
          </v-list-item>

          <v-list-item prepend-icon="mdi-church">
            <RouterLink to="/thanksgiving-mass-form-bookinglist-view" class="router-link">Thanksgiving Mass</RouterLink>
          </v-list-item>

          <v-divider class="my-2" />

          <!-- Mobile Theme Toggle -->
          <v-list-item v-if="mobile" @click="isDark = !isDark">
            <v-icon class="me-2">{{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
            <span>{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>
          </v-list-item>

          <!-- Logout -->
          <v-list-item @click="onLogout" prepend-icon="mdi-logout">
            <v-btn variant="text" color="error" block>Log Out</v-btn>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Main -->
      <v-main>
        <v-container fluid>
          <slot name="content"></slot>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.app-bar-elegant {
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-title-lg {
  font-family: 'Jomolhari', serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin: 0;
  color: #fff;
}

.header-title-sm {
  font-family: 'Jomolhari', serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
  margin: 0;
  color: #fff;
}

.header-sub {
  font-size: 12px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.theme-switch {
  transform: scale(1.2);
  margin-right: 12px;
}

.router-link {
  text-decoration: none;
  color: inherit;
}
.router-link:hover {
  text-decoration: underline;
}

/* Custom styles for the navigation drawer */
.v-navigation-drawer {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.v-list-item {
  transition: background 0.3s ease;
}

.v-list-item:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
