<script setup>
import NavBar2 from '@/components/layout/NavBar2.vue'
import PreloaderView from '@/components/layout/PreloaderView.vue'
</script>

<template>
  <PreloaderView />
  <NavBar2>
    <template #content>
      <h1>Events</h1>
      <p>List of events will be displayed here.</p>
    </template>
  </NavBar2>
</template>

<style scoped></style>
