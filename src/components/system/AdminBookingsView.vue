<script setup>
import AdminHeader from '@/components/layout/AdminHeader.vue'
import { ref } from 'vue'

const events = ref([
  {
    id: 1,
    title: 'HOLY WEEK MASS ACTIVITIES 2025',
    date: 'April 13, 2025',
    time: '7:00 PM',
    massType: 'Triduum',
    expanded: false,
  },
  {
    id: 2,
    title: 'SUNDAY MASS SCHEDULE',
    date: 'April 21, 2025',
    time: '8:00 AM',
    massType: 'Regular Sunday Mass',
    expanded: false,
  },
])

const dialog = ref(false)
const isEditMode = ref(false)
const editedIndex = ref(-1)

const eventForm = ref({
  title: '',
  date: '',
  time: '',
  massType: '',
})

function resetForm() {
  eventForm.value = { title: '', date: '', time: '', massType: '' }
  isEditMode.value = false
  editedIndex.value = -1
}

function saveEvent() {
  if (isEditMode.value && editedIndex.value !== -1) {
    events.value[editedIndex.value] = {
      ...events.value[editedIndex.value],
      ...eventForm.value,
    }
  } else {
    events.value.push({
      id: Date.now(),
      ...eventForm.value,
      expanded: false,
    })
  }

  dialog.value = false
  resetForm()
}

function editEvent(index) {
  eventForm.value = { ...events.value[index] }
  editedIndex.value = index
  isEditMode.value = true
  dialog.value = true
}

function deleteEvent(id) {
  events.value = events.value.filter((e) => e.id !== id)
}

function toggleDetails(index) {
  events.value[index].expanded = !events.value[index].expanded
}
</script>

<template>
  <AdminHeader>
    <template #content>
      <v-container fluid>
        <v-row>
          <v-col><h3>📋 Admin — Mass Event Schedule</h3></v-col>
          <v-col class="text-right">
            <v-btn color="green" @click="openDialog()">➕ Add Mass</v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="(event, index) in events" :key="event.id" cols="12" md="4">
            <v-card class="mx-auto card-shadow" max-width="344">
              <v-card-title @click="toggleDetails(index)" class="cursor-pointer">
                {{ event.title }}
              </v-card-title>

              <v-expand-transition>
                <div v-if="event.expanded">
                  <v-card-text>
                    <p><b>Date:</b> {{ event.date }}</p>
                    <p><b>Time:</b> {{ event.time }}</p>
                    <p><b>Type:</b> {{ event.massType }}</p>
                  </v-card-text>
                </div>
              </v-expand-transition>

              <v-card-actions>
                <v-btn color="blue" @click="editEvent(index)">✏️ Edit</v-btn>
                <v-btn color="red" @click="deleteEvent(event.id)">🗑️ Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- ADD / EDIT MASS DIALOG -->
        <v-dialog v-model="dialog" max-width="500">
          <v-card>
            <v-card-title>{{ isEditMode ? 'Edit Mass Schedule' : 'Add New Mass' }}</v-card-title>
            <v-card-text>
              <v-text-field v-model="eventForm.title" label="Mass Title"></v-text-field>
              <v-text-field v-model="eventForm.date" label="Date"></v-text-field>
              <v-text-field v-model="eventForm.time" label="Time"></v-text-field>
              <v-text-field
                v-model="eventForm.massType"
                label="Type of Mass (e.g. Youth, Healing)"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="saveEvent">{{
                isEditMode ? '💾 Update' : '✅ Save'
              }}</v-btn>
              <v-btn text @click="dialog = false">❌ Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
  </AdminHeader>
</template>

<style scoped>
.card-shadow {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.flex-grow-1 {
  flex-grow: 1;
}
</style>
