<script setup>
import AdminHeader from '@/components/layout/AdminHeader.vue'
import { onMounted } from 'vue'
import { useEventsStore } from '@/stores/eventStore'
const eventStore = useEventsStore() // Initialize the event store

// Fetch events when the component is mounted
onMounted(async () => {
  if (eventStore.events.length == 0) await eventStore.getEventsFromApi()
})
</script>
<template>
  <AdminHeader>
    <v-container>
      <v-row>
        <v-col cols="12" sm="8">
          <v-text-field
            variant="outlined"
            label="Label"
            density="compact"
            append-inner-icon="Q"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-btn prepend-icon="+" color="red-darken-2" block> Add Item </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </AdminHeader>
</template>
