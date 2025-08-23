<script setup>
import { useDisplay } from 'vuetify'
import WeddingHeader from './weddingHeaderLayout/WeddingHeader.vue'
import { useWeddingHeader } from './weddingHeaderLayout/weddingHeader'

const { mobile } = useDisplay()
const { userBookings } = useWeddingHeader()
</script>

<template>
  <v-row>
    <v-col cols="12">
      <WeddingHeader />
      
      <!-- Fallback card when no data -->
      <v-card
        v-if="!userBookings.length"
        :class="mobile ? 'pa-6' : 'pa-8'"
        class="text-center mt-4"
        rounded="xl"
        elevation="0"
      >
        <v-icon :size="mobile ? 80 : 96" color="primary" class="mb-3"> mdi-information-outline </v-icon>
        <h3 :class="mobile ? 'text-h6 mb-2' : 'text-h5 mb-3'">No data available</h3>
        <p :class="mobile ? 'text-body-2 mb-4' : 'text-body-1 mb-4'" class="text-medium-emphasis">
          Please check back later for updates or contact support if you have any concerns.
        </p>
        <v-btn
          color="primary"
          :size="mobile ? 'default' : 'large'"
          prepend-icon="mdi-refresh"
          rounded="pill"
          class="px-6"
          @click="$router.go(0)"
        >
          Refresh
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>
