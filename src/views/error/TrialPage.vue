<script setup>
import NavBar2 from '@/components/layout/NavBar.vue'
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

const events = ref([])
const dialog = ref(false)

const newEvent = ref({
  title: '',
  date_posted: '',
  image: '',
  summary: '',
  details: '',
  type: '',
  priest: '',
  additional_info: [],
})

async function loadEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) console.error(error)
  else events.value = data
}

async function addEvent() {
  // Validation (optional)
  if (!newEvent.value.title || !newEvent.value.date_posted) {
    alert('Please complete all required fields.')
    return
  }

  const { data, error } = await supabase.from('events').insert([
    {
      title: newEvent.value.title,
      date_posted: newEvent.value.date_posted,
      image: newEvent.value.image,
      summary: newEvent.value.summary,
      details: newEvent.value.details,
      type: newEvent.value.type,
      priest: newEvent.value.priest,
      additional_info: newEvent.value.additional_info,
    },
  ])

  if (error) {
    console.error('Insert error:', error)
    alert('Failed to add event.')
  } else {
    console.log('Insert success:', data)
    dialog.value = false
    resetNewEvent()
    await loadEvents()
  }
}

function resetNewEvent() {
  newEvent.value = {
    title: '',
    date_posted: '',
    image: '',
    summary: '',
    details: '',
    type: '',
    priest: '',
    additional_info: [],
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      newEvent.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function deleteEvent(id) {
  const { error } = await supabase.from('events').delete().eq('id', id)

  if (error) console.error('Delete error:', error)
  else loadEvents()
}

onMounted(() => {
  loadEvents()
})
</script>

<template>
  <NavBar2>
    <template #content>
      <v-container>
        <v-row>
          <v-col cols="12" class="d-flex justify-space-between align-center">
            <h2>📋 Admin - Manage Events</h2>
            <v-btn color="primary" @click="dialog = true">➕ Add Event</v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="event in events" :key="event.id" cols="12" sm="6" md="4">
            <v-card>
              <v-img :src="event.image" height="200px" />
              <v-card-title>{{ event.title }}</v-card-title>
              <v-card-subtitle>{{ event.date_posted }}</v-card-subtitle>
              <v-card-text>{{ event.summary }}</v-card-text>
              <v-card-actions>
                <v-btn color="error" text @click="deleteEvent(event.id)">🗑️ Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- ADD EVENT DIALOG -->
        <v-dialog v-model="dialog" max-width="600">
          <v-card>
            <v-card-title>Add New Event</v-card-title>
            <v-card-text>
              <v-text-field v-model="newEvent.title" label="Title" outlined />
              <v-text-field v-model="newEvent.date_posted" label="Date Posted" outlined />
              <v-file-input
                label="Upload Image"
                @change="handleFileUpload"
                outlined
                accept="image/*"
              />
              <v-text-field v-model="newEvent.type" label="Type of Event" outlined />
              <v-text-field v-model="newEvent.priest" label="Priest" outlined />
              <v-textarea v-model="newEvent.summary" label="Summary" outlined />
              <v-textarea v-model="newEvent.details" label="Details" outlined />
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="addEvent">💾 Save</v-btn>
              <v-btn text @click="dialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
  </NavBar2>
</template>

<style scoped>
h2 {
  text-transform: uppercase;
}
</style>
