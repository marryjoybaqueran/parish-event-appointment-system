<script setup>
import NavBar from '@/components/layout/NavBar.vue';
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <Nav>
    <template #content>
      <v-container fluid>



        <h3 class="uppercase-text">Book Event</h3>
      </v-container>
    </template>
  </Nav
</template>
