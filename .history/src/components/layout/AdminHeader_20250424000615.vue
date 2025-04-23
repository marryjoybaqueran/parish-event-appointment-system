<script setup>
import { useAuthUserStore } from '@/stores/authUser'
import { onMounted, ref, computed, watch } from 'vue'
import { useDisplay, useTheme } from 'vuetify'

// Store and display breakpoint
const authStore = useAuthUserStore()
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
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <!-- Inside v-app-bar -->

      <!--Toggle-->
      <v-app-bar
        class="px-6"
        :color="themeMode === 'light' ? 'light-blue-lighten-1' : 'light-blue-accent-4'"
        border
      >
        <!--Header Title-->
        <div class="d-flex align-center">
          <v-img src="logo.png" :width="mobile ? '40px' : '45px'" class="me-2" cover />
          <h2 :class="smAndDown ? 'small-header' : 'large-header'" class="ma-0 header">
            SAN ISIDRO LABRADOR PARISH
          </h2>
        </div>

        <v-spacer></v-spacer>

        <!-- Only show toggle on desktop -->
        <div v-if="!mobile" class="d-flex align-center">
          <v-switch
            v-model="isDark"
            color="primary"
            hide-details
            class="theme-switch pl-7"
            @change="onClick"
            style="transform: scale(1.5); transform-origin: right center"
          >
            <template #thumb>
              <v-icon size="20">
                {{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
              </v-icon>
            </template>
          </v-switch>
        </div>

        <!-- Hamburger -->
        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- DRAWER MENU -->
      <v-navigation-drawer v-model="drawer" temporary location="right">
        <v-list>
          <!-- Only show toggle in drawer for mobile -->

          <v-divider></v-divider>

          <!-- Links -->
          <RouterLink to="/admin-booking-view" class="router-link">
            <v-list-item>
              <span class>Special Wedding Mass</span>
            </v-list-item>
          </RouterLink>

          <v-divider></v-divider>

          <RouterLink to="/funeral-mass-form-bookinglist-view" class="router-link">
            <v-list-item>
              <span>Funeral Mass</span>
            </v-list-item>
          </RouterLink>

          <v-divider></v-divider>
          <RouterLink to="/funeral-mass-form-bookinglist-view" class="router-link">
            <v-list-item><span>Baptism Mass</span></v-list-item>
          </RouterLink>
          <v-divider></v-divider>
          <v-list-item><span>Thanks Giving Mass</span></v-list-item>
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
.header {
  font-family: 'Jomolhari', serif;
  font-weight: 500;
  color: black;
}

.large-header {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
}

.small-header {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.router-link {
  text-decoration: none;
  color: inherit;
}

.router-link:hover {
  text-decoration: none;
}
</style>
