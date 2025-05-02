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

import { reactive, ref } from 'vue'

const showModal = ref(false)
const editMode = ref(false)
const selectedId = ref(null)

const events = reactive([
  {
    id: 1,
    title: 'Holy Week Mass Activities',
    date_posted: '2025-04-10',
    image_url: 'https://via.placeholder.com/400x200?text=Holy+Week',
    summary: 'Join us as we reflect on the passion of Christ this Holy Week.',
    details: 'Palm Sunday at 7AM, Holy Monday, Holy Tuesday...',
    type: 'Holy Week',
    priest: 'Fr. Nilo',
    expanded: false,
  },
  {
    id: 2,
    title: 'Sunday Mass Schedule',
    date_posted: '2025-04-21',
    image_url: 'https://via.placeholder.com/400x200?text=Sunday+Mass',
    summary: 'Celebrate the Holy Mass every Sunday.',
    details: 'Fr. Robin at 9AM, Fr. Nilo at 11AM...',
    type: 'Regular Mass',
    priest: 'Fr. Robin',
    expanded: false,
  },
])

const form = reactive({
  title: '',
  date_posted: '',
  image_url: '',
  summary: '',
  details: '',
  type: '',
  priest: '',
})

function openModal(event = null) {
  showModal.value = true
  if (event) {
    editMode.value = true
    selectedId.value = event.id
    Object.assign(form, { ...event })
  } else {
    editMode.value = false
    selectedId.value = null
    Object.assign(form, {
      title: '',
      date_posted: '',
      image_url: '',
      summary: '',
      details: '',
      type: '',
      priest: '',
    })
  }
}

function closeModal() {
  showModal.value = false
}

function saveEvent() {
  if (editMode.value) {
    const index = events.findIndex((e) => e.id === selectedId.value)
    if (index !== -1) {
      Object.assign(events[index], { ...form, expanded: false })
    }
  } else {
    events.push({
      id: Date.now(),
      ...form,
      expanded: false,
    })
  }
  closeModal()
}

function deleteEvent(id) {
  const index = events.findIndex((e) => e.id === id)
  if (index !== -1) {
    events.splice(index, 1)
  }
}
</script>

<template>
  <AdminHeader>
    <template #content>
      <div class="p-6 bg-sky-100 min-h-screen">
        <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>

        <button
          @click="openModal()"
          class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add New Event
        </button>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="event in events" :key="event.id" class="bg-white rounded-xl shadow p-4">
            <img
              :src="event.image_url"
              alt="Event Image"
              class="w-full h-40 object-cover rounded mb-2"
            />
            <h2 class="text-lg font-bold">{{ event.title }}</h2>
            <p class="text-sm text-gray-600">Date Posted: {{ event.date_posted }}</p>
            <p class="mt-2">{{ event.summary }}</p>

            <button
              @click="event.expanded = !event.expanded"
              class="text-sm text-blue-600 mt-2 hover:underline"
            >
              {{ event.expanded ? 'Hide Details ▲' : 'See More ▼' }}
            </button>

            <div v-if="event.expanded" class="mt-2 text-sm text-gray-700">
              <p><strong>Details:</strong> {{ event.details }}</p>
              <p><strong>Type:</strong> {{ event.type }}</p>
              <p><strong>Priest:</strong> {{ event.priest }}</p>
            </div>

            <div class="flex justify-end mt-4 gap-2">
              <button
                @click="openModal(event)"
                class="text-sm px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                @click="deleteEvent(event.id)"
                class="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Modal -->
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div class="bg-white rounded-lg p-6 w-full max-w-xl">
            <h2 class="text-xl font-bold mb-4">
              {{ editMode ? 'Edit Event' : 'Add Event' }}
            </h2>

            <div class="grid gap-3">
              <input v-model="form.title" placeholder="Title" class="input" />
              <input v-model="form.date_posted" type="date" class="input" />
              <input v-model="form.image_url" placeholder="Image URL" class="input" />
              <input v-model="form.summary" placeholder="Summary" class="input" />
              <textarea v-model="form.details" placeholder="Details" class="input"></textarea>
              <input v-model="form.type" placeholder="Type" class="input" />
              <input v-model="form.priest" placeholder="Priest" class="input" />
            </div>

            <div class="mt-4 flex justify-end gap-2">
              <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button
                @click="saveEvent"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AdminHeader>
</template>
