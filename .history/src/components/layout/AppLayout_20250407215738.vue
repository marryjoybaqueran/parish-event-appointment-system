<script setup>
import { ref } from 'vue'
const theme = ref(localStorage.getItem('theme') ?? 'light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3" :color="theme === 'light' ? 'blue-darken-1' : 'blue-darken-3'" border>
        <h2 class="ps-5 header">San Isidro Labrador Parish</h2>
        <v-spacer></v-spacer>
        <v-switch
          class="pt-5"
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="onClick"
          variant="elevated"
          :width="100"
        ></v-switch>
      </v-app-bar>
      <!--Toggle-->

      <v-main>
        <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
