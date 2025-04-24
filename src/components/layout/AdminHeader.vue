<script setup>
import { useAuthUserStore } from '@/stores/authUser'
import { onMounted } from 'vue'

// Use Pinia Store
const authStore = useAuthUserStore()

import { ref, computed } from 'vue'
const theme = ref(localStorage.getItem('theme') ?? 'light')

const isDark = computed({
  get: () => theme.value === 'dark',
  set: (val) => {
    theme.value = val ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  },
})

const isLoggedIn = ref(false)
const drawer = ref(false)

function onClick() {
  localStorage.setItem('theme', theme.value)
}
import { useDisplay } from 'vuetify'
const { mobile, smAndDown } = useDisplay()

// Load Functions during component rendering
onMounted(async () => {
  isLoggedIn.value = await authStore.isAuthenticated()
  isMobileLogged.value = mobile.value && isLoggedIn.value
  isDesktop.value = !mobile.value && (isLoggedIn.value || !isLoggedIn.value)
})
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar
        class="px-6"
        :color="theme === 'light' ? 'light-blue-lighten-1' : 'light-blue-accent-4'"
        border
      >
        <!-- LOGO + HEADER -->
        <div class="d-flex align-center">
          <v-img src="logo.png" :width="mobile ? '40px' : '45px'" class="me-2" cover />
          <h2 :class="smAndDown ? 'small-header' : 'large-header'" class="ma-0 header">
            SAN ISIDRO LABRADOR PARISH
          </h2>
        </div>

        <v-spacer></v-spacer>

        <div class="d-flex align-center nav">
          <div class="d-flex nav"></div>
          <v-spacer></v-spacer>

          <!--Toggle-->
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

          <!--(Hamburger) -->
          <div>
            <v-btn icon @click="drawer = !drawer">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </div>
        </div>
      </v-app-bar>

      <!-- DRAWER MENU -->
      <v-navigation-drawer v-model="drawer" temporary location="right">
        <v-list>
          <!-- Wedding Mass -->
          <v-list-item>
            <span>Special Wedding Mass</span>
          </v-list-item>

          <v-divider></v-divider>

          <!-- Funeral Mass -->
          <v-list-item>
            <span>Funeral Mass</span>
          </v-list-item>

          <v-divider></v-divider>

          <!-- Baptism Mass -->
          <v-list-item>
            <span>Baptism Mass</span>
          </v-list-item>

          <v-divider></v-divider>

          <!-- Thanks Giving Mass -->
          <v-list-item>
            <span>Thanks Giving Mass</span>
          </v-list-item>

          <divider></divider>

          <v-list-item>
            <v-btn flat @click="onLogout"> Log Out</v-btn>
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
</style>
