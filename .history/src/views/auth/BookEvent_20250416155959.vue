<script setup>
import NavBar2 from '@/components/layout/NavBar2.vue'
import { useDisplay } from 'vuetify'
import { ref, onMounted, onUnmounted } from 'vue'

const { mobile } = useDisplay()
const images = ['@/wedding mass background image.jpg', '@/images/pic2.jpg', '/images/pic3.jpg']

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
</script>

<template>
  <NavBar2>
    <template #content>
      <v-container fluid>
        <div class="bg-wrapper">
          <v-img src="public/bookevent-bg.jpg" class="bg-image" cover> </v-img>
          <div class="bg-overlay"></div>
        </div>
        <v-row>
          <v-col></v-col>
          <v-col class="centered-select">
            <v-card elevation="10" class="pa-10 text-center" :style="cardStyle">
              <v-card-text>
                <h2 class="text-center welcome">Welcome!</h2>
                <v-select
                  v-model="selectedEvent"
                  :items="items"
                  :item-props="itemProps"
                  placeholder="🖊️Choose events you want to book"
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
