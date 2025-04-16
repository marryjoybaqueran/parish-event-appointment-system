<script setup>
import NavBar2 from '@/components/layout/NavBar2.vue'
import { useDisplay } from 'vuetify'
import { ref, onMounted, onUnmounted } from 'vue'

const { mobile } = useDisplay()
const images = [
  '@/wedding mass background image.jpg',
  '@/thanksgiving mass background image.png',
  '@/funeral mass background image.jpg',
  '@/baptism mass background image.jpg',
]

const currentIndex = ref(0)
let intervalId = null

const items = [
  {
    name: '💍 Special Wedding Mass',
  },
  {
    name: '⚰️ Funeral Mass',
  },
  {
    name: '🎁 Thanksgiving Mass',
  },
  {
    name: '✝️ Baptism Mass (Christening)',
  },
]

function itemProps(item) {
  return {
    title: item.name,
    subtitle: item.department,
  }
}

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

onMounted(() => {
  intervalId = setInterval(nextImage, 3000) // every 3 seconds
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <NavBar2>
    <template #content>
      <v-container fluid>
        <div class="bg-wrapper">
          <div class="carousel">
            <img :src="images[currentIndex]" alt="Carousel Image" />

            <div class="indicators">
              <span
                v-for="(img, index) in images"
                :key="index"
                :class="{ active: index === currentIndex }"
              ></span>
            </div>
          </div>
          <div class="bg-overlay"></div>
        </div>
        <v-row>
          <v-col></v-col>
          <v-col class="centered-select">
            <v-card elevation="10" class="pa-10 text-center">
              <v-card-text>
                <h2 class="text-center welcome">Welcome!</h2>
                <v-select
                  v-model="selectedEvent"
                  :items="items"
                  :item-props="itemProps"
                  placeholder="Choose events you want to book"
                  outlined
                  dense
                  style="width: 300px; margin-top: 20px"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col></v-col>
        </v-row>
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
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 25% black */
  z-index: 1;
}

.centered-select {
  padding-top: 50px;
}
</style>
