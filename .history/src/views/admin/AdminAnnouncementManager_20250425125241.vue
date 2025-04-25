<script setup>
import AdminHeader from '@/components/layout/AdminHeader.vue'
import { onMounted } from 'vue'
import { useEventsStore } from '@/stores/eventStore'
const eventStore = useEventsStore() // Initialize the event store

// Fetch events when the component is mounted
onMounted(async () => {
  if (EventsStore.events.length == 0) await eventStore.getEventsFromApi()

  console.log(eventStore.events)
})
</script>
<template>
  <AdminHeader>
    <v-container>
      <v-row>
        <!-- Display Add Event Form -->
        <v-btn color="primary" @click="showForm = !showForm">{{
          showForm ? 'Cancel' : 'Add New Event'
        }}</v-btn>

        <v-form v-if="showForm" @submit.prevent="addEvent">
          <v-text-field v-model="newEvent.title" label="Event Title" required></v-text-field>
          <v-text-field v-model="newEvent.datePosted" label="Date Posted" required></v-text-field>
          <v-textarea v-model="newEvent.shortDescription" label="Event Description"></v-textarea>
          <v-text-field v-model="newEvent.image_url" label="Event Image URL"></v-text-field>
          <v-btn type="submit" color="success">Add Event</v-btn>
        </v-form>

        <!-- Display Events -->
        <v-col v-for="event in eventStore.events" :key="event.id">
          <v-card class="mx-auto" max-width="344">
            <v-img :src="event.image_url" height="200px" cover></v-img>
            <v-card-title>{{ event.title }}</v-card-title>
            <v-card-subtitle>{{ event.datePosted }}</v-card-subtitle>
            <v-card-text>{{ event.shortDescription }}</v-card-text>

            <v-card-actions>
              <v-btn color="red" @click="deleteEvent(event.id)">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </AdminHeader>
</template>
