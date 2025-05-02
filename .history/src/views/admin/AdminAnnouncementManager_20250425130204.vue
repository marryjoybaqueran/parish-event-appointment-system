<script setup>
import AdminHeader from '@/components/layout/AdminHeader.vue'
import { onMounted } from 'vue'
import { useEventsStore } from '@/stores/eventStore'

const eventsStore = useEventsStore()

onMounted(async () => {
  if (eventsStore.events.length === 0) {
    await eventsStore.getEventsFromApi()
  }
})
</script>

<template>
    <v-h1>Hi!</v-h1>
    <v-row>
      <v-col cols="12" sm="8">
        <v-text-field
          variant="outlined"
          label="Search Events"
          density="compact"
          append-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>

      <v-col cols="12" sm="4">
        <v-btn prepend-icon="mdi-plus" color="red-darken-2" block class="text-white">
          Add Item
        </v-btn>
      </v-col>
    </v-row>
  </AdminHeader>
</template>
