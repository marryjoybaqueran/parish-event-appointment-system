<script setup>
import NavBar2 from '@/components/layout/NavBar.vue'
import { ref, onMounted, watch } from 'vue'

const LOCAL_STORAGE_KEY = 'events-data'

const events = ref([])

onMounted(() => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (saved) {
    events.value = JSON.parse(saved)
  }
})

watch(
  events,
  (newVal) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true },
)

const dialog = ref(false)
const newEvent = ref({
  title: '',
  datePosted: '',
  image: '',
  summary: '',
  details: '',
  type: '',
  priest: '',
  additionalInfo: [],
})

function handleImageUpload(e, targetEvent = newEvent.value) {
  const file = e.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = () => {
      targetEvent.image = reader.result
    }
    reader.readAsDataURL(file)
  }
}

function addEvent() {
  if (newEvent.value.title) {
    events.value.push({
      id: Date.now(),
      ...newEvent.value,
    })
    dialog.value = false
    newEvent.value = {
      title: '',
      datePosted: '',
      image: '',
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
}

function addAdditionalInfo(event) {
  event.additionalInfo.push({ text: '' })
}

function removeAdditionalInfo(event, index) {
  event.additionalInfo.splice(index, 1)
}
</script>

<template>
  <NavBar2>
    <template #content>
      <v-container fluid>
        <v-row>
          <v-col>
            <h3 class="uppercase-text">📋 Admin — Manage Events</h3>
          </v-col>
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
                <v-btn
                  :icon="event.showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="event.showDetails = !event.showDetails"
                ></v-btn>
                <v-btn color="red" @click="deleteEvent(event.id)">🗑️ Delete</v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="event.showDetails" class="pa-4">
                  <v-text-field
                    v-model="event.title"
                    label="Event Title"
                    dense
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="event.datePosted"
                    label="Date Posted"
                    dense
                    outlined
                  ></v-text-field>

                  <input
                    type="file"
                    @change="(e) => handleImageUpload(e, event)"
                    accept="image/*"
                  />
                  <v-img :src="event.image" height="150" class="my-2"></v-img>

                  <v-text-field
                    v-model="event.type"
                    label="Type of Event"
                    dense
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="event.priest"
                    label="Name of Priest"
                    dense
                    outlined
                  ></v-text-field>
                  <v-textarea v-model="event.summary" label="Summary" dense outlined></v-textarea>
                  <v-textarea
                    v-model="event.details"
                    label="Full Details"
                    dense
                    outlined
                  ></v-textarea>

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
                    ></v-text-field>
                    <v-btn icon @click="removeAdditionalInfo(event, index)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>

                  <v-btn color="primary" text small @click="addAdditionalInfo(event)">
                    <v-icon left>mdi-plus</v-icon> Add Info
                  </v-btn>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>

        <!-- ADD NEW EVENT FORM -->
        <v-dialog v-model="dialog" max-width="600">
          <v-card>
            <v-card-title>Add New Event</v-card-title>
            <v-card-text>
              <v-text-field v-model="newEvent.title" label="Title"></v-text-field>
              <v-text-field v-model="newEvent.datePosted" label="Date Posted"></v-text-field>

              <input type="file" @change="handleImageUpload" accept="image/*" />
              <v-img :src="newEvent.image" height="150" class="my-2" v-if="newEvent.image"></v-img>

              <v-text-field v-model="newEvent.type" label="Type of Event"></v-text-field>
              <v-text-field v-model="newEvent.priest" label="Name of Priest"></v-text-field>
              <v-textarea v-model="newEvent.summary" label="Summary"></v-textarea>
              <v-textarea v-model="newEvent.details" label="Full Details"></v-textarea>

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
                ></v-text-field>
                <v-btn icon @click="newEvent.additionalInfo.splice(index, 1)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>

              <v-btn color="primary" text small @click="newEvent.additionalInfo.push({ text: '' })">
                <v-icon left>mdi-plus</v-icon> Add Info
              </v-btn>
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="addEvent">✅ Save</v-btn>
              <v-btn text @click="dialog = false">❌ Cancel</v-btn>
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
