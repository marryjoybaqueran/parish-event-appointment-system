<script setup>
import { ref, computed } from 'vue'
const theme = ref(localStorage.getItem('theme') ?? 'light')

const isDark = computed({
  get: () => theme.value === 'dark',
  set: (val) => {
    theme.value = val ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  },
})

function onClick() {
  localStorage.setItem('theme', theme.value)
}
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
const { smAndDown } = useDisplay()
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-6" :color="theme === 'light' ? 'blue-darken-1' : 'blue-darken-3'" border>
        <div class="d-flex align-center">
          <v-img src="logo.png" :width="mobile ? '40px' : '45px'" class="me-2" cover></v-img>
          <h2 :class="smAndDown ? 'text-subtitle-2' : 'text-h5'" class="ma-0 header">
            San Isidro Labrador Parish
          </h2>
        </div>

        <div class="d-flex align-center">
          <h2>Home</h2>
          <h2>Book Event</h2>
        </div>

        <v-spacer></v-spacer>
        <v-switch
          v-model="isDark"
          color="primary"
          hide-details
          class="theme-switch"
          @change="onClick"
          style="transform: scale(1.5); transform-origin: right center"
        >
          <template #thumb>
            <v-icon size="20  ">
              {{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
            </v-icon>
          </template>
        </v-switch>
      </v-app-bar>

      <v-main>
        <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style scoped>
h2 {
  font-family: 'Jomolhari', serif;
  font-weight: 500;
}
</style>
