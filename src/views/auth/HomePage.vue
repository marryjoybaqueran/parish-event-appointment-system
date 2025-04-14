<script setup>
import HomePage from '@/views/auth/HomePage.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <h3 class="uppercase-text">Book Event</h3>
      </v-container>
    </template>
  </AppLayout>
</template>
