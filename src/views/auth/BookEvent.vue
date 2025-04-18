<script setup>
import NavBar2 from '@/components/layout/NavBar2.vue'
import { useDisplay } from 'vuetify'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { mdAndDown } = useDisplay()
const images = [
  '/wedding mass background image.jpg',
  '/thanksgiving mass background image.png',
  '/funeral mass background image.jpg',
  '/baptism mass background image.jpg',
]

const imageLoop = [...images, images[0]]

const currentIndex = ref(0)
const transitionSpeed = ref('1s')
let intervalId = null

const items = [
  {
    name: '💍 Special Wedding Mass',
    route: '/wedding-mass-form',
  },
  {
    name: '⚰️ Funeral Mass',
  },
  {
    name: '🎁 Thanksgiving Mass',
  },
  {
    name: '✝️ Baptism Mass (Christening)',
    route: '/baptism-mass',
  },
]

function itemProps(item) {
  return {
    title: item.name,
    subtitle: item.department,
  }
}

const selectedEvent = ref(null)

function handleEventSelect(selectedName) {
  const selected = items.find((item) => item.name === selectedName)
  if (selected?.route) {
    router.push(selected.route)
  }
}

function nextImage() {
  if (currentIndex.value < images.length) {
    currentIndex.value++
  } else {
    // Instantly reset without animation, then move to 1st image smoothly
    transitionSpeed.value = '0s'
    currentIndex.value = 0
    setTimeout(() => {
      transitionSpeed.value = '1s'
      currentIndex.value = 1
    }, 50)
  }
}
onMounted(() => {
  intervalId = setInterval(nextImage, 3000) // every 3 seconds
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
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
          <v-col cols="12" sm="8" md="6" lg="5" class="centered-select text-center">
            <v-card elevation="10" class="pa-7 text-center">
              <v-card-text>
                <h2 class="text-center welcome pb-5">Welcome!</h2>

                <v-select
                  v-model="selectedEvent"
                  :items="items"
                  :item-props="itemProps"
                  item-title="name"
                  item-value="name"
                  v-blind:width="mdAndDown ? '80%' : '100%'"
                  placeholder="Choose events you want to book"
                  outlined
                  dense
                  @update:modelValue="handleEventSelect"
                />
              </v-card-text>
            </v-card>
          </v-col>
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
  width: calc(100vw * 5);
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
    padding-top: 200px;
  }
  .v-card {
    padding: 20px !important;
  }
}

.text-center {
  margin-left: auto;
  margin-right: auto;
}
</style>
