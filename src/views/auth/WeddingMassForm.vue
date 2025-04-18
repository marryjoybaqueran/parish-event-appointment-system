<script setup>
import NavBar2 from '@/components/layout/NavBar2.vue'
import WeddingForm from '@/components/auth/WeddingForm.vue'

import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay()
</script>

<template>
  <NavBar2>
    <template #content>
      <v-container fluid>
        <div class="bg-wrapper">
          <v-img src="wedding mass background image.jpg" class="bg-image" cover></v-img>
        </div>

        <div class="overlay-content pa-10">
          <h1 :class="smAndDown ? 'small-header' : 'large-header'">
            <i>Special Wedding Mass Form</i>
          </h1>
        </div>

        <v-card class="mt-15" :width="smAndDown ? '100%' : '100%'">
          <WeddingForm></WeddingForm>
        </v-card>
      </v-container>
    </template>
  </NavBar2>
</template>

<style scoped>
.bg-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(3px);
}

.overlay-content {
  position: absolute;
  top: 50px; /* you can adjust this value */
  left: 0;
  right: 0;
  z-index: 1;
  text-align: center;
  color: white;
  padding-top: 20px;
}

h1 {
  font-family: 'Segoe Script', cursive;
  text-shadow:
    -2px 0 2px white,
    0 2px 2px white,
    2px 0 2px white,
    0 -2px 2px;
  text-align: center;
  color: #000;
}

.large-header {
  font-size: 40px;
}

.small-header {
  font-size: 22px;
}
</style>
