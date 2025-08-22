<script setup>
import NavBar2 from '@/components/layout/NavBar2.vue'
import PreloaderView from '@/components/layout/PreloaderView.vue'
</script>

<template>
  <PreloaderView />
  <NavBar2>
    <template #content>
      <h1>Notifications</h1>
      <p>List of notifications will be displayed here.</p>
    </template>
  </NavBar2>
</template>

<style scoped></style>
