<script setup>
import AdminHeader from '@/components/layout/AdminHeader.vue'
import { ref, onMounted } from 'vue'
import { useEventStore } from '@/stores/eventStore'
const eventStore = useEventStore()

onMounted(() => {
  eventStore.getEventsFromApi()
  console.log(eventStore.items)
})

const events = ref([
  {
    id: 1,
    title: 'HOLY WEEK MASS ACTIVITIES 2025',
    datePosted: 'April 10, 2025',
    image: 'public/holyweek.jpg',
    summary:
      'We invite everyone to join us in remembering the passion, death, and resurrection of Jesus Christ this Holy Week.',
    details: 'Holy Week full schedule and activities...',
  },
  {
    id: 2,
    title: 'SUNDAY MASS SCHEDULE',
    datePosted: 'April 21, 2025',
    image: 'public/banner-sunday-mass.jpg',
    summary: 'Join us every Sunday to celebrate the Holy Mass!',
    details: 'Mass times for Fr. Nilo & Fr. Robin...',
  },
])

const dialog = ref(false)
const newEvent = ref({
  title: '',
  datePosted: '',
  image: '',
  summary: '',
  details: '',
})

function addEvent() {
  if (newEvent.value.title) {
    events.value.push({
      id: Date.now(),
      ...newEvent.value,
    })
    dialog.value = false
    newEvent.value = { title: '', datePosted: '', image: '', summary: '', details: '' }
  }
}

function deleteEvent(id) {
  events.value = events.value.filter((e) => e.id !== id)
}
</script>

<template>
  <AdminHeader>
    <template #content>
      <v-container fluid>
        <v-row>
          <v-col><h3 class="uppercase-text">📋 Admin — Manage Events</h3></v-col>
          <v-col class="text-right">
            <v-btn color="green" @click="dialog = true">➕ Add New Event</v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="event in events" :key="event.id" cols="12" md="4">
            <v-card class="mx-auto card-shadow" max-width="344">
              <v-img :src="event.image" height="200px" cover></v-img>

              <v-card-title>{{ event.title }}</v-card-title>
              <v-card-subtitle><b>Date Posted:</b> {{ event.datePosted }}</v-card-subtitle>
              <v-card-text>{{ event.summary }}</v-card-text>

              <v-card-actions>
                <v-btn color="red" @click="deleteEvent(event.id)">🗑️ Delete</v-btn>
                <!-- Optional: Edit button -->
                <v-btn color="blue">✏️ Edit</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- ADD NEW EVENT FORM -->
        <v-dialog v-model="dialog" max-width="500">
          <v-card>
            <v-card-title>Add New Event</v-card-title>
            <v-card-text>
              <v-text-field v-model="newEvent.title" label="Title"></v-text-field>
              <v-text-field v-model="newEvent.datePosted" label="Date Posted"></v-text-field>
              <v-text-field v-model="newEvent.image" label="Image Path (public/)"></v-text-field>
              <v-textarea v-model="newEvent.summary" label="Summary"></v-textarea>
              <v-textarea v-model="newEvent.details" label="Full Details"></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="addEvent">✅ Save</v-btn>
              <v-btn text @click="dialog = false">❌ Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
  </AdminHeader>
</template>
