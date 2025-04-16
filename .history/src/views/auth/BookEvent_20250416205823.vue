<script setup>
import NavBar2 from '@/components/layout/NavBar2.vue'
import { useDisplay } from 'vuetify'
import { ref, onMounted } from 'vue'

const selectedEvent = ref('')
const { mobile } = useDisplay()

const eventOptions = ['Baptism', 'Wedding Mass', 'Funeral Mass', 'Thanksgiving Mass']

const images = [
  '/wedding mass background image.jpg',
  '/thanksgiving mass background image.png',
  '/funeral mass background image.jpg',
  '/baptism mass background image.jpg',
]

const imageLoop = [...images, images[0]]

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
</script>

<template>
  <NavBar2>
    <template #content>
      <v-container fluid>
        <div class="bg-wrapper">
          <div
            class="carousel"
            :style="{
              transform: `translateX(-${currentIndex * 100}vw)`,
              transitionDuration: transitionSpeed,
            }"
          >
            <img v-for="(image, index) in imageLoop" :key="index" :src="image" class="bg-image" />
          </div>
          <div class="bg-overlay"></div>
        </div>

        <v-row>
          <v-col></v-col>
          <v-col class="centered-select">
            <v-card elevation="10" class="pa-7 text-center" v-bind:width="mobile ? '110%' : '120%'">
              <v-card-text>
                <h2 class="text-center welcome">Welcome!</h2>
                <v-select
                  v-model="selectedEvent"
                  :items="items"
                  :item-props="itemProps"
                  placeholder="Choose events you want to book"
                  outlined
                  dense
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
/* Scoped styles for the carousel */
.bg-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.carousel {
  display: flex;
  transition: transform 1s ease-in-out;
  width: 400%; /* 100% for each image */
  height: 100%;
}

.bg-image {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  flex-shrink: 0;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.indicators span {
  width: 10px;
  height: 10px;
  background: white;
  opacity: 0.5;
  border-radius: 50%;
  display: block;
}

.indicators .active {
  opacity: 1;
}

.centered-select {
  padding-top: 200px;
}

@media (max-width: 768px) {
  .centered-select {
    padding-top: 50px;
  }
  .v-card {
    padding: 20px !important;
  }
}
</style>
