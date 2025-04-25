<script setup>
import AdminHeader from '@/components/layout/AdminHeader.vue'
import { ref, onMounted } from 'vue'
import { useEventStore } from '@/stores/eventStore'
const eventStore = useEventStore()

onMounted(() => {
  eventStore.getEventsFromApi()
  console.log(eventStore.items)
})

// Local states for event data
const newEvent = ref({
  title: '',
  datePosted: '',
  shortDescription: '',
  details: {
    title: '',
    date: '',
    activities: [],
  },
  imageUrl: '',
})
const editedEvent = ref(null)

// Fetch events on mount
onMounted(async () => {
  await eventStore.fetchEvents()
})

// Handling form submission for adding an event
async function handleAddEvent() {
  await eventStore.addEvent(newEvent.value)
  clearForm()
}

// Handling form submission for editing an event
async function handleEditEvent() {
  if (editedEvent.value) {
    await eventStore.editEvent(editedEvent.value.id, editedEvent.value)
    clearForm()
  }
}

// Deleting an event
async function handleDeleteEvent(eventId) {
  await eventStore.deleteEvent(eventId)
}

// Clear form after add or edit
function clearForm() {
  newEvent.value = {
    title: '',
    datePosted: '',
    shortDescription: '',
    details: { title: '', date: '', activities: [] },
    imageUrl: '',
  }
  editedEvent.value = null
}
</script>

<template>
  <AdminHeader>
    <div>
      <h1>Admin Dashboard</h1>

      <!-- Form for adding/editing events -->
      <v-form>
        <v-text-field v-model="newEvent.title" label="Event Title" />
        <v-text-field v-model="newEvent.datePosted" label="Date Posted" />
        <v-textarea v-model="newEvent.shortDescription" label="Short Description" />
        <v-text-field v-model="newEvent.imageUrl" label="Image URL" />
        <v-textarea v-model="newEvent.details.title" label="Details Title" />
        <v-text-field v-model="newEvent.details.date" label="Details Date" />
        <v-textarea v-model="newEvent.details.activities" label="Activities (comma separated)" />

        <v-btn @click="handleAddEvent" color="primary">Add Event</v-btn>
        <v-btn @click="handleEditEvent" color="secondary">Update Event</v-btn>
      </v-form>

      <!-- Display Events -->
      <v-row>
        <v-col v-for="event in eventStore.events" :key="event.id" cols="12" sm="4">
          <v-card>
            <v-img :src="event.imageUrl" height="200px" />
            <v-card-title>{{ event.title }}</v-card-title>
            <v-card-subtitle>{{ event.datePosted }}</v-card-subtitle>
            <v-card-text>{{ event.shortDescription }}</v-card-text>
            <v-btn @click="editedEvent = event" color="orange">Edit</v-btn>
            <v-btn @click="handleDeleteEvent(event.id)" color="red">Delete</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </AdminHeader>
</template>
