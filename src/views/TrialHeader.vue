<!-- <script setup>
import NavBar2 from '@/components/layout/NavBar.vue'
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

const STORAGE_BUCKET = 'event-images'
const events = ref([])
const dialog = ref(false)

const newEvent = ref({
  title: '',
  datePosted: '',
  image: '',
  file: null,
  summary: '',
  details: '',
  type: '',
  priest: '',
  additionalInfo: [],
})

async function loadEvents() {
  // Fetch events from Supabase when the page loads
  const { data, error } = await supabase.from('events').select()
  if (data) {
    events.value = data
  } else {
    console.error(error)
  }
}

async function saveEventToSupabase(event) {
  // Save event to Supabase without the image (no image URL)
  const { error } = await supabase.from('events').insert([
    {
      title: event.title,
      date_posted: event.datePosted,
      summary: event.summary,
      details: event.details,
      type: event.type,
      priest: event.priest,
      additional_info: event.additionalInfo, // Storing as JSON
    },
  ])
  if (error) {
    console.error('Error saving event to Supabase:', error)
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      newEvent.value.image = e.target.result // Save image locally
    }
    reader.readAsDataURL(file)
  }
}

function handleEditFileUpload(e, eventItem) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      eventItem.image = ev.target.result // Save image locally
      saveEvents()
    }
    reader.readAsDataURL(file)
  }
}

async function addEvent() {
  if (newEvent.value.title) {
    // Save event to Supabase
    await saveEventToSupabase(newEvent.value)

    // Push the new event to the events array
    events.value.push({
      id: Date.now(), // Fake ID until we get the Supabase-generated ID
      ...newEvent.value,
      isEditing: false,
    })

    dialog.value = false
    newEvent.value = {
      title: '',
      datePosted: '',
      image: '',
      file: null,
      summary: '',
      details: '',
      type: '',
      priest: '',
      additionalInfo: [],
    }
  }
}

function deleteEvent(id) {
  events.value = events.value.filter((e) => e.id !== id)
  saveEvents()
}

function addAdditionalInfo(event) {
  event.additionalInfo.push({ text: '' })
}

function removeAdditionalInfo(event, index) {
  event.additionalInfo.splice(index, 1)
  saveEvents()
}

function toggleEdit(event) {
  if (event.isEditing) {
    saveEvents()
  }
  event.isEditing = !event.isEditing
}

onMounted(loadEvents)
</script>

<template>
  <NavBar2>
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
                <v-btn @click="event.showDetails = !event.showDetails">
                  {{ event.showDetails ? 'Hide' : 'View Details' }}
                </v-btn>
                <v-btn color="primary" @click="toggleEdit(event)">
                  {{ event.isEditing ? 'Done' : 'Edit' }}
                </v-btn>
                <v-btn color="red" @click="deleteEvent(event.id)">🗑️ Delete</v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="event.showDetails" class="pa-4">
                  <template v-if="event.isEditing">
                    <v-text-field v-model="event.title" label="Event Title" dense outlined />
                    <v-text-field v-model="event.datePosted" label="Date Posted" dense outlined />
                    <v-file-input
                      accept="image/*"
                      @change="(e) => handleEditFileUpload(e, event)"
                      label="Image File"
                      dense
                      outlined
                    />
                    <v-text-field v-model="event.type" label="Type of Event" dense outlined />
                    <v-text-field v-model="event.priest" label="Name of Priest" dense outlined />
                    <v-textarea v-model="event.summary" label="Summary" dense outlined />
                    <v-textarea v-model="event.details" label="Full Details" dense outlined />

                    <div
                      v-for="(info, index) in event.additionalInfo"
                      :key="index"
                      class="d-flex align-center mb-2"
                    >
                      <v-text-field
                        v-model="info.text"
                        label="Additional Info"
                        dense
                        outlined
                        class="flex-grow-1"
                      />
                      <v-btn icon @click="removeAdditionalInfo(event, index)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </div>

                    <v-btn color="primary" text small @click="addAdditionalInfo(event)">
                      <v-icon left>mdi-plus</v-icon> Add Info
                    </v-btn>
                  </template>

                  <template v-else>
                    <p><b>Type:</b> {{ event.type }}</p>
                    <p><b>Priest:</b> {{ event.priest }}</p>
                    <p><b>Details:</b> {{ event.details }}</p>
                    <div v-if="event.additionalInfo.length">
                      <p><b>Additional Info:</b></p>
                      <ul>
                        <li v-for="(info, i) in event.additionalInfo" :key="i">{{ info.text }}</li>
                      </ul>
                    </div>
                  </template>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>

       ADD NEW EVENT DIALOG
        <v-dialog v-model="dialog" max-width="600">
          <v-card>
            <v-card-title>Add New Event</v-card-title>
            <v-card-text>
              <v-text-field v-model="newEvent.title" label="Title" />
              <v-text-field v-model="newEvent.datePosted" label="Date Posted" />
              <v-file-input
                accept="image/*"
                @change="handleFileUpload"
                label="Upload Image (jpg/png)"
              />
              <v-text-field v-model="newEvent.type" label="Type of Event" />
              <v-text-field v-model="newEvent.priest" label="Name of Priest" />
              <v-textarea v-model="newEvent.summary" label="Summary" />
              <v-textarea v-model="newEvent.details" label="Full Details" />

              <div
                v-for="(info, index) in newEvent.additionalInfo"
                :key="index"
                class="d-flex align-center mb-2"
              >
                <v-text-field
                  v-model="info.text"
                  label="Additional Info"
                  dense
                  outlined
                  class="flex-grow-1"
                />
                <v-btn icon @click="newEvent.additionalInfo.splice(index, 1)"
                  ><v-icon>mdi-close</v-icon></v-btn
                >
              </div>
              <v-btn color="primary" text small @click="newEvent.additionalInfo.push({ text: '' })">
                <v-icon left>mdi-plus</v-icon> Add Info
              </v-btn>
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="addEvent"> Save Event</v-btn>
              <v-btn text @click="dialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
  </NavBar2>
</template>

<style scoped>
.card-shadow {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.flex-grow-1 {
  flex-grow: 1;
}
</style>-->

<!--
<script setup>
import { ref, onMounted } from 'vue'
import { useAnnouncementsStore } from '@/stores/eventStore.js'
import NavBar from '@/components/layout/NavBar.vue'

const announcementsStore = useAnnouncementsStore()
const tableFilters = ref({
  search: '',
})

// On page load, fetch announcements
onMounted(async () => {
  // Fetch announcements if they aren't already loaded
  if (announcementsStore.announcements.length === 0) {
    await announcementsStore.getAnnouncements(tableFilters.value)
  }
})
</script>

<template>
  <NavBar>
    <template #content>
      <v-container fluid>
  Background Video Section
        <div class="bg-wrapper">
          <v-responsive aspect-ratio="16/9">
            <video
              autoplay
              muted
              loop
              playsinline
              style="width: 100%; height: 100%; object-fit: cover"
            >
              <source src="public/homepage-bg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </v-responsive>
          <div class="bg-overlay"></div>
        </div>

        <v-row>
          <v-col><h3 class="uppercase-text">Announcement Dashboard</h3></v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            sm="4"
            v-for="announcement in announcementsStore.announcements"
            :key="announcement.id"
          >
            <v-card class="mx-auto card-shadow" max-width="344">
              <v-img
                :src="announcement.imageUrl || 'public/default.jpg'"
                height="200px"
                cover
              ></v-img>
              <v-card-title class="card-title">
                <b>{{ announcement.title }}</b>
              </v-card-title>
              <v-card-subtitle class="dates">
                <b>Date Posted:</b> {{ announcement.date_posted }}
              </v-card-subtitle>
              <v-card-text class="text2">
                {{ announcement.summary }}
              </v-card-text>
            See More Button
              <v-card-actions>
                <v-btn
                  color="orange-lighten-2"
                  :href="announcement.moreDetailsLink"
                  text="See more ➔"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </NavBar>
</template>

<style scoped>
/* your CSS remains same */
.bg-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.bg-wrapper > .v-responsive {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.card-shadow {
  box-shadow:
    -4px 0px 12px rgba(0, 0, 0, 0.1),
    4px 0px 12px rgba(0, 0, 0, 0.1),
    0px 4px 12px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-family: Cambria, Georgia, serif;
  font-weight: bolder;
}

.dates {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.text2 {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}
.uppercase-text {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 24px;
}
</style>
-->

<!--
<script setup>
import NavBar2 from '@/components/layout/NavBar.vue'
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

const STORAGE_KEY = 'events'
const events = ref([])
const dialog = ref(false)

const newEvent = ref({
  title: '',
  datePosted: '',
  image: '',
  file: null,
  summary: '',
  details: '',
  type: '',
  priest: '',
  additionalInfo: [],
})

async function loadEvents() {
  // Fetch events from Supabase when the page loads
  const { data, error } = await supabase.from('announcements').select()
  if (data) {
    events.value = data
  } else {
    console.error(error)
  }
}

async function saveEventToSupabase(event) {
  try {
    const { data, error } = await supabase.from('announcement').insert([
      {
        title: event.title,
        date_posted: event.datePosted,
        summary: event.summary,
        details: event.details,
        type: event.type,
        priest: event.priest,
        additional_info: event.additionalInfo,
        image: event.image,
      },
    ])

    if (error) throw error

    // Push the new event to the local state with Supabase-generated ID
    events.value.push(data[0])
  } catch (error) {
    console.error('Error saving event to Supabase:', error)
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      newEvent.value.image = e.target.result // Save image locally
    }
    reader.readAsDataURL(file)
  }
}

function handleEditFileUpload(e, eventItem) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      eventItem.image = ev.target.result // Save image locally
    }
    reader.readAsDataURL(file)
  }
}

async function addEvent() {
  if (newEvent.value.title && newEvent.value.datePosted && newEvent.value.image) {
    // Save event to Supabase
    await saveEventToSupabase(newEvent.value)

    // Close dialog and reset form
    dialog.value = false
    resetNewEventForm()
  } else {
    console.error('Please fill in all required fields.')
  }
}

function deleteEvent(id) {
  events.value = events.value.filter((e) => e.id !== id)
  saveEvents()
}

function addAdditionalInfo(event) {
  event.additionalInfo.push({ text: '' })
}

function removeAdditionalInfo(event, index) {
  event.additionalInfo.splice(index, 1)
  saveEvents()
}

function toggleEdit(event) {
  if (event.isEditing) {
    saveEvents()
  }
  event.isEditing = !event.isEditing
}

function resetNewEventForm() {
  newEvent.value = {
    title: '',
    datePosted: '',
    image: '',
    file: null,
    summary: '',
    details: '',
    type: '',
    priest: '',
    additionalInfo: [],
  }
}

onMounted(loadEvents)
</script>

<template>
  <NavBar2>
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
                <v-btn @click="event.showDetails = !event.showDetails">
                  {{ event.showDetails ? 'Hide' : 'View Details' }}
                </v-btn>
                <v-btn color="primary" @click="toggleEdit(event)">
                  {{ event.isEditing ? 'Done' : 'Edit' }}
                </v-btn>
                <v-btn color="red" @click="deleteEvent(event.id)">🗑️ Delete</v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="event.showDetails" class="pa-4">
                  <template v-if="event.isEditing">
                    <v-text-field v-model="event.title" label="Event Title" dense outlined />
                    <v-text-field v-model="event.datePosted" label="Date Posted" dense outlined />
                    <v-file-input
                      accept="image/*"
                      @change="(e) => handleEditFileUpload(e, event)"
                      label="Image File"
                      dense
                      outlined
                    />
                    <v-text-field v-model="event.type" label="Type of Event" dense outlined />
                    <v-text-field v-model="event.priest" label="Name of Priest" dense outlined />
                    <v-textarea v-model="event.summary" label="Summary" dense outlined />
                    <v-textarea v-model="event.details" label="Full Details" dense outlined />

                    <div
                      v-for="(info, index) in event.additionalInfo"
                      :key="index"
                      class="d-flex align-center mb-2"
                    >
                      <v-text-field
                        v-model="info.text"
                        label="Additional Info"
                        dense
                        outlined
                        class="flex-grow-1"
                      />
                      <v-btn icon @click="removeAdditionalInfo(event, index)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </div>

                    <v-btn color="primary" text small @click="addAdditionalInfo(event)">
                      <v-icon left>mdi-plus</v-icon> Add Info
                    </v-btn>
                  </template>

                  <template v-else>
                    <p><b>Type:</b> {{ event.type }}</p>
                    <p><b>Priest:</b> {{ event.priest }}</p>
                    <p><b>Details:</b> {{ event.details }}</p>
                    <div v-if="event.additionalInfo.length">
                      <p><b>Additional Info:</b></p>
                      <ul>
                        <li v-for="(info, i) in event.additionalInfo" :key="i">{{ info.text }}</li>
                      </ul>
                    </div>
                  </template>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="600">
          <v-card>
            <v-card-title>Add New Event</v-card-title>
            <v-card-text>
              <v-text-field v-model="newEvent.title" label="Title" />
              <v-text-field v-model="newEvent.datePosted" label="Date Posted" />
              <v-file-input
                accept="image/*"
                @change="handleFileUpload"
                label="Upload Image (jpg/png)"
              />
              <v-text-field v-model="newEvent.type" label="Type of Event" />
              <v-text-field v-model="newEvent.priest" label="Name of Priest" />
              <v-textarea v-model="newEvent.summary" label="Summary" />
              <v-textarea v-model="newEvent.details" label="Full Details" />

              <div
                v-for="(info, index) in newEvent.additionalInfo"
                :key="index"
                class="d-flex align-center mb-2"
              >
                <v-text-field
                  v-model="info.text"
                  label="Additional Info"
                  dense
                  outlined
                  class="flex-grow-1"
                />
                <v-btn icon @click="newEvent.additionalInfo.splice(index, 1)"
                  ><v-icon>mdi-close</v-icon></v-btn
                >
              </div>
              <v-btn color="primary" text small @click="newEvent.additionalInfo.push({ text: '' })">
                <v-icon left>mdi-plus</v-icon> Add Info
              </v-btn>
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="addEvent"> Save Event</v-btn>
              <v-btn text @click="dialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
  </NavBar2>
</template>

<style scoped>
.card-shadow {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.flex-grow-1 {
  flex-grow: 1;
}
</style>
-->

<!--
<script setup>
import NavBar2 from '@/components/layout/NavBar.vue'
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

const STORAGE_BUCKET = 'events-image'
const events = ref([])
const dialog = ref(false)

const newEvent = ref({
  title: '',
  datePosted: '',
  image_url: '',
  file: null,
  summary: '',
  details: '',
})

// Fetch the authenticated user
const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
  }
  return user
}

// Load all events
const loadEvents = async () => {
  const { data, error } = await supabase.from('announcements').select('*')

  if (error) {
    console.error('Error loading events:', error)
    return []
  }

  console.log('Loaded events:', data)
  return data
}

// Add new event (after uploading image)
const addEvent = async () => {
  const user = await getUser()
  if (!user) {
    console.error('User not authenticated')

    return
  }

  const { data, error } = await supabase.from('announcements').insert([
    {
      user_id: user.id,
      title: newEvent.value.title,
      datePosted: newEvent.value.datePosted,
      image_url: newEvent.value.image_url,
      summary: newEvent.value.summary,
      details: newEvent.value.details,
    },
  ])

  if (error) {
    console.error('Error adding event:', error)
  } else {
    console.log('Event added successfully:', data)

    // Reload the events to update the list!
    events.value = await loadEvents()

    // Close dialog and reset form
    dialog.value = false
    newEvent.value = {
      title: '',
      datePosted: '',
      file: null,
      summary: '',
      details: '',
      image_url: '',
    }
  }
}

// Save edited event
const saveEditedEvent = async (eventItem) => {
  const { error } = await supabase
    .from('announcements')
    .update({
      title: eventItem.title,
      datePosted: eventItem.datePosted,
      summary: eventItem.summary,
      details: eventItem.details,
    })
    .eq('id', eventItem.id)

  if (error) {
    console.error('Error saving edited event:', error)
  } else {
    console.log('Event updated successfully.')
    eventItem.isEditing = false
  }
}

// Delete an event
const deleteEvent = async (eventId) => {
  const { error } = await supabase.from('announcements').delete().eq('id', eventId)

  if (error) {
    console.error('Error deleting event:', error)
  } else {
    console.log(`Event with ID ${eventId} deleted successfully.`)
  }
}

const handleFileUpload = async (event) => {
  const file = event.target?.files?.[0] || event // handle both event and direct file
  if (file) {
    const uploadedUrl = await uploadImage(file)
    newEvent.value.image_url = uploadedUrl
    console.log('Uploaded image URL:', uploadedUrl)
  } else {
    console.error('No file selected')
  }
}

// Upload image to storage
const uploadImage = async (file) => {
  if (!file) {
    console.error('No file provided for upload.')
    return null
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage.from('event-images').upload(filePath, file)

  if (uploadError) {
    console.error('Error uploading image:', uploadError)
    return null
  }

  const { data: publicUrlData } = supabase.storage.from('event-images').getPublicUrl(filePath)

  return publicUrlData?.publicUrl || null
}

onMounted(async () => {
  events.value = await loadEvents()
})
</script>

<template>
  <NavBar2>
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
              <v-img :src="event.image_url" height="200px" cover></v-img>
              <v-card-title>{{ event.title }}</v-card-title>
              <v-card-subtitle><b>Date Posted:</b> {{ event.datePosted }}</v-card-subtitle>
              <v-card-text>{{ event.summary }}</v-card-text>

              <v-card-actions>
                <v-btn @click="event.showDetails = !event.showDetails">
                  {{ event.showDetails ? 'Hide' : 'View Details' }}
                </v-btn>
                <v-btn
                  color="primary"
                  @click="event.isEditing ? saveEditedEvent(event) : (event.isEditing = true)"
                >
                  {{ event.isEditing ? 'Save' : 'Edit' }}
                </v-btn>
                <v-btn color="red" @click="deleteEvent(event.id)">🗑️ Delete</v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="event.showDetails" class="pa-4">
                  <template v-if="event.isEditing">
                    <v-text-field v-model="event.title" label="Title" dense outlined />
                    <v-text-field v-model="event.datePosted" label="Date Posted" dense outlined />
                    <v-textarea v-model="event.summary" label="Summary" dense outlined />
                    <v-textarea v-model="event.details" label="Details" dense outlined />
                  </template>
                  <template v-else>
                    <p><b>Summary:</b> {{ event.summary }}</p>
                    <p><b>Details:</b> {{ event.details }}</p>
                  </template>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="600">
          <v-card>
            <v-card-title>Add New Event</v-card-title>
            <v-card-text>
              <v-text-field v-model="newEvent.title" label="Title" />
              <v-text-field v-model="newEvent.datePosted" label="Date Posted" />
              <v-file-input accept="image/*" label="Upload Image" @change="handleFileUpload" />
              <v-textarea v-model="newEvent.summary" label="Summary" />
              <v-textarea v-model="newEvent.details" label="Full Details" />
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="addEvent">Save Event</v-btn>
              <v-btn text @click="dialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
  </NavBar2>
</template>

<style scoped>
.card-shadow {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
-->
<!--
<script setup>
import NavBar2 from '@/components/layout/NavBar.vue'
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/utils/supabase.js'

const events = ref([])
const dialog = ref(false)

const newEvent = ref({
  title: '',
  datePosted: '',
  summary: '',
  details: '',
})

// Watch the dialog value
watch(dialog, (newVal) => {
  if (newVal) {
    newEvent.value.datePosted = getTodayDate()
  }
})

// Fetch the authenticated user
const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
  }
  return user
}

// Load all events
const loadEvents = async () => {
  const { data, error } = await supabase.from('announcements').select('*')

  if (error) {
    console.error('Error loading events:', error)
    return []
  }

  console.log('Loaded events:', data)
  events.value = data
}

// Add new event (no image)
const addEvent = async () => {
  const user = await getUser()
  if (!user) {
    console.error('User not authenticated')
    return
  }

  const { data, error } = await supabase.from('announcements').insert([
    {
      user_id: user.id,
      title: newEvent.value.title,
      datePosted: newEvent.value.datePosted,
      summary: newEvent.value.summary,
      details: newEvent.value.details,
    },
  ])

  if (error) {
    console.error('Error adding event:', error)
  } else {
    console.log('Event added successfully:', data)

    // Reload events
    events.value = await loadEvents()

    // Close dialog and reset form
    dialog.value = false
    newEvent.value = {
      title: '',
      datePosted: '',
      summary: '',
      details: '',
    }
  }
}

// Save edited event
const saveEditedEvent = async (eventItem) => {
  const { error } = await supabase
    .from('announcements')
    .update({
      title: eventItem.title,
      datePosted: eventItem.datePosted,
      summary: eventItem.summary,
      details: eventItem.details,
    })
    .eq('id', eventItem.id)

  if (error) {
    console.error('Error saving edited event:', error)
  } else {
    console.log('Event updated successfully.')
    eventItem.isEditing = false
  }
}

// Delete an event
const deleteEvent = async (eventId) => {
  const { error } = await supabase.from('announcements').delete().eq('id', eventId)

  if (error) {
    console.error('Error deleting event:', error)
  } else {
    console.log(`Event with ID ${eventId} deleted successfully.`)
    // Refresh list
    events.value = await loadEvents()
  }
}

// Helper to get today's date
const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

onMounted(async () => {
  events.value = await loadEvents()
})
</script>

<template>
  <NavBar2>
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
              <v-card-title>{{ event.title }}</v-card-title>
              <v-card-subtitle><b>Date Posted:</b> {{ event.datePosted }}</v-card-subtitle>
              <v-card-text>{{ event.summary }}</v-card-text>

              <v-card-actions>
                <v-btn @click="event.showDetails = !event.showDetails">
                  {{ event.showDetails ? 'Hide' : 'View Details' }}
                </v-btn>
                <v-btn
                  color="primary"
                  @click="event.isEditing ? saveEditedEvent(event) : (event.isEditing = true)"
                >
                  {{ event.isEditing ? 'Save' : 'Edit' }}
                </v-btn>
                <v-btn color="red" @click="deleteEvent(event.id)">🗑️ Delete</v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="event.showDetails" class="pa-4">
                  <template v-if="event.isEditing">
                    <v-text-field v-model="event.title" label="Title" dense outlined />
                    <v-text-field v-model="event.datePosted" label="Date Posted" dense outlined />
                    <v-textarea v-model="event.summary" label="Summary" dense outlined />
                    <v-textarea v-model="event.details" label="Details" dense outlined />
                  </template>
                  <template v-else>
                    <p><b>Summary:</b> {{ event.summary }}</p>
                    <p><b>Details:</b> {{ event.details }}</p>
                  </template>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="600">
          <v-card>
            <v-card-title>Add New Event</v-card-title>
            <v-card-text>
              <v-text-field v-model="newEvent.title" label="Title" />
              <v-text-field v-model="newEvent.datePosted" label="Date Posted" />
              <v-textarea v-model="newEvent.summary" label="Summary" />
              <v-textarea v-model="newEvent.details" label="Full Details" />
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="addEvent">Save Event</v-btn>
              <v-btn text @click="dialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
  </NavBar2>
</template>

<style scoped>
.card-shadow {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>

 -->

<!--
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/utils/supabase.js'
import AlertNotification from '@/components/common/AlertNotification.vue'

const dialog = ref(false)
const valid = ref(false)
const refVform = ref()

const formData = ref({
  title: '',
  summary: '',
  details: '',
  image: null,
  dateposted: '',
})

const imagePreview = ref(null) // For immediate image display

const formAction = ref({
  formProcess: false,
  formErrorMessage: '',
  formSuccessMessage: '',
})

const announcements = ref([])

const fetchAnnouncements = async () => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('dateposted', { ascending: false })

  if (error) {
    console.error('Error fetching announcements:', error.message)
  } else {
    announcements.value = data
  }
}

onMounted(() => {
  fetchAnnouncements()
})

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString('en-US')
}

watch(
  () => formData.value.image,
  (file) => {
    if (file) {
      imagePreview.value = URL.createObjectURL(file)
    } else {
      imagePreview.value = null
    }
  },
)

const onSubmit = async () => {
  formAction.value.formProcess = true

  const user = await getUser()
  if (!user) {
    formAction.value.formErrorMessage = 'User not authenticated'
    return
  }

  const { data, error } = await supabase.from('announcements').insert([
    {
      title: formData.value.title,
      summary: formData.value.summary,
      details: formData.value.details,
      user_id: user.id,
      dateposted: new Date().toISOString(),
    },
  ])

  if (error) {
    formAction.value.formErrorMessage = error.message
  } else {
    formAction.value.formSuccessMessage = 'Announcement submitted successfully!'
    fetchAnnouncements()
    dialog.value = false
  }

  formAction.value.formProcess = false
}

const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
  }
  return user
}

const viewDetails = (announcement) => {
  alert(`Details of ${announcement.title}: ${announcement.details}`)
}
</script>

<template>
  <v-container>
    <v-row justify="end" class="mb-4">
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
          Add Announcement
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card elevation="6">
        <v-card-title class="text-h6 font-weight-bold"> Announcement Form </v-card-title>

        <v-divider />

        <v-card-text>
          <AlertNotification
            :form-success-message="formAction.formSuccessMessage"
            :form-error-message="formAction.formErrorMessage"
          />

          <v-form v-model="valid" ref="refVform" @submit.prevent="onSubmit">
            <v-row class="mt-2">
              <v-col cols="12">
                <v-text-field v-model="formData.title" :rules="nameRules" label="Title" required />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.summary"
                  :rules="nameRules"
                  label="Summary"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-textarea v-model="formData.details" label="Details" required />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-img v-if="imagePreview" :src="imagePreview" height="200px" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="justify-center">
          <v-btn
            color="primary"
            size="large"
            type="submit"
            :disabled="formAction.formProcess"
            :loading="formAction.formProcess"
            @click="onSubmit"
          >
            Submit Announcement
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row v-if="announcements.length" class="my-5">
      <v-col v-for="announcement in announcements" :key="announcement.id" cols="12" md="4">
        <v-card>
          <v-img :src="announcement.image_url" height="200px" />
          <v-card-title>{{ announcement.title }}</v-card-title>
          <v-card-subtitle>{{ announcement.dateposted | formatDate }}</v-card-subtitle>
          <v-card-text>{{ announcement.summary }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="viewDetails(announcement)">View Details</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
 -->

<template>
  <div class="card-container" :style="{ '--surface-color': surfaceColor, '--curve': curve + 'px' }">
    <ul class="card-list">
      <li v-for="(card, index) in cards" :key="index">
        <a href="#" class="card">
          <img :src="card.image" class="card__image" alt="" />
          <div class="card__overlay">
            <div class="card__header">
              <svg class="card__arc" xmlns="http://www.w3.org/2000/svg">
                <path />
              </svg>
              <img :src="card.thumb" class="card__thumb" alt="" />
              <div class="card__header-text">
                <h3 class="card__title">{{ card.title }}</h3>
                <span v-if="card.tagline" class="card__tagline">{{ card.tagline }}</span>
                <span class="card__status">{{ card.status }}</span>
              </div>
            </div>
            <p class="card__description">{{ card.description }}</p>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
const surfaceColor = '#fff'
const curve = 40
const cards = [
  {
    image: 'https://i.imgur.com/oYiTqum.jpg',
    thumb: 'https://i.imgur.com/7D7I6dI.png',
    title: 'Jessica Parker',
    status: '1 hour ago',
    tagline: null,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?',
  },
  {
    image: 'https://i.imgur.com/2DhmtJ4.jpg',
    thumb: 'https://i.imgur.com/sjLMNDM.png',
    title: 'Kim Cattrall',
    status: '3 hours ago',
    tagline: null,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?',
  },
  {
    image: 'https://i.imgur.com/oYiTqum.jpg',
    thumb: 'https://i.imgur.com/7D7I6dI.png',
    title: 'Jessica Parker',
    status: '1 hour ago',
    tagline: 'Lorem ipsum dolor sit amet consectetur',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?',
  },
  {
    image: 'https://i.imgur.com/2DhmtJ4.jpg',
    thumb: 'https://i.imgur.com/sjLMNDM.png',
    title: 'Kim Cattrall',
    status: '3 hours ago',
    tagline: null,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?',
  },
]
</script>

<style scoped>
:root {
  --surface-color: #fff;
  --curve: 40;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 4rem 5vw;
  padding: 0;
  list-style-type: none;
}

.card {
  position: relative;
  display: block;
  height: 100%;
  border-radius: calc(var(--curve) * 1px);
  overflow: hidden;
  text-decoration: none;
  background-color: white;
}

.card__image {
  width: 100%;
  height: auto;
}

.card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  border-radius: calc(var(--curve) * 1px);
  background-color: var(--surface-color);
  transform: translateY(100%);
  transition: 0.2s ease-in-out;
}

.card:hover .card__overlay {
  transform: translateY(0);
}

.card__header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2em;
  padding: 2em;
  border-radius: calc(var(--curve) * 1px) 0 0 0;
  background-color: var(--surface-color);
  transform: translateY(-100%);
  transition: 0.2s ease-in-out;
}

.card:hover .card__header {
  transform: translateY(0);
}

.card__arc {
  width: 80px;
  height: 80px;
  position: absolute;
  bottom: 100%;
  right: 0;
  z-index: 1;
}

.card__arc path {
  fill: var(--surface-color);
  d: path('M 40 80 c 22 0 40 -22 40 -40 v 40 Z');
}

.card__thumb {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.card__title {
  font-size: 1em;
  margin: 0 0 0.3em;
  color: #6a515e;
}

.card__tagline {
  display: block;
  margin: 1em 0;
  font-size: 0.8em;
  color: #d7bdca;
}

.card__status {
  font-size: 0.8em;
  color: #d7bdca;
}

.card__description {
  padding: 0 2em 2em;
  margin: 0;
  color: #d7bdca;
  font-size: 0.8em;
  display: -webkit-box;
  --webkit-box-orient: vertical;
  --webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
