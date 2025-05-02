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
  <AdminHeader>
    <template #content>
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

        <v-col cols="12" sm="3">
          <v-btn prepend-icon="mdi-plus" color="red-darken-2" block class="text-white">
            Add Item
          </v-btn>
        </v-col>

        <v-col cols="12" sm="1">
          <v-btn variant="elevated" density="comfortable" icon>
            <v-icon icon="mdi-refresh"></v-icon>
          </v-btn>
        </v-col>
        <v-divider class="mb-3"></v-divider>

        <v-col cols="12" sm="4" v-for="events in eventsStore.events" :key="events.id">
          <v-card :title="event.name">
            <v-card-text> Char </v-card-text>
            <v-card-actions>
              <v-btn variant="elevated" density="comfortable" icon>
                <v-icon icon="mdi-pencil"></v-icon>
              </v-btn>
              <v-btn variant="elevated" density="comfortable" icon>
                <v-icon color="error" icon="mdi-delete"></v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AdminHeader>
</template>
