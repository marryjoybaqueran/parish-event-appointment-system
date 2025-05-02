<script setup>
import AdminHeader from '@/components/layout/AdminHeader.vue'
import { ref, onMounted } from 'vue'
import { useEventsStore } from '@/stores/eventStore'
const eventStore = useEventsStore() // Initialize the event store

// Reactive variable to hold form data for adding a new event
const newEvent = ref({
  title: '',
  datePosted: '',
  shortDescription: '',
  image_url: '', // You can replace this with an actual image URL or add a file upload feature
})

const showForm = ref(false) // To toggle the visibility of the form

// Fetch events when the component is mounted
onMounted(() => {
  eventStore.getEventsFromApi()
  console.log(eventStore.events)
})

// Function to add a new event
const addEvent = () => {
  if (newEvent.value.title && newEvent.value.datePosted) {
    eventStore.addEvent(newEvent.value) // Add the event using the Pinia store
    newEvent.value = { title: '', datePosted: '', shortDescription: '', image_url: '' } // Reset form
    showForm.value = false // Hide the form after adding the event
  } else {
    alert('Please fill in the required fields!')
  }
}

// Function to delete an event
const deleteEvent = (eventId) => {
  eventStore.deleteEvent(eventId) // Delete the event using the Pinia store
}
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
