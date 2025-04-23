<script setup>
import ProfileHeader from '@/components/layout/ProfileHeader.vue'
</script>

<template>
  <ProfileHeader v-if="isLoggedIn">
    <template #content>
      <v-container fluid> hi </v-container>
    </template>
  </ProfileHeader>
</template>
