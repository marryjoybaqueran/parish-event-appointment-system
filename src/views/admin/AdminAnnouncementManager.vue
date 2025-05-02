<!--<script setup>
import { onMounted, ref } from 'vue'
import { useAnnouncementsStore } from '@/stores/eventStore.js'
import AdminAnnouncementDialog from '@/views/admin/AdminAnnouncementDialog.vue'
// import DashboardHeader from '@/components/layout/DashboardHeader.vue'

// Use Pinia Store
const announcementsStore = useAnnouncementsStore()

// Load Variables
const tableFilters = ref({
  search: '',
})
const announcementsData = ref(null)
const isDialogVisible = ref(false)
const isUpdateMode = ref(false)

// Add Items
const onAdd = () => {
  announcementsData.value = null
  isDialogVisible.value = true
}

// When editing existing event
const onEdit = (item) => {
  announcementsData.value = { ...item } // ← clone item to form
  isUpdateMode.value = true
  isDialogVisible.value = true
}

const onRetrieveFromApi = async () => {
  await announcementsStore.getAnnouncementsFromApi()
}

onMounted(async () => {
  if (announcementsStore.announcements.length === 0)
    await announcementsStore.getAnnouncements(tableFilters.value)
})
</script>

<template>
  <!-- <DashboardHeader> -->
<!-- <template #content> 
  <v-row>
    <v-col cols="12" sm="8">
      <v-text-field
        v-model="tableFilters.search"
        variant="outlined"
        label="Search Events"
        density="compact"
        append-inner-icon="mdi-magnify"
        clearable
      />
    </v-col>

    <v-col cols="12" sm="3">
      <v-btn prepend-icon="mdi-plus" color="red-darken-2" @click="onAdd" block class="text-white">
        Add Events
      </v-btn>
    </v-col>

    <v-col cols="12" sm="1">
      <v-btn variant="elevated" density="comfortable" @click="onRetrieveFromApi" icon>
        <v-icon icon="mdi-refresh"></v-icon>
      </v-btn>
    </v-col>
    <v-divider class="mb-3"></v-divider>

    <v-col
      cols="12"
      sm="4"
      v-for="announcement in announcementsStore.announcements ?? []"
      :key="announcement.id"
    >
      <v-card :title="announcement.title">
        <v-card-text>
          {{ announcement.date_posted }}

          {{ announcement.summary }}
        </v-card-text>
        <v-card-actions>
          <v-btn variant="elevated" density="comfortable" @click="onEdit(announcement)" icon>
            <v-icon icon="mdi-pencil"></v-icon>
          </v-btn>
          <v-btn variant="elevated" density="comfortable" icon>
            <v-icon color="error" icon="mdi-delete"></v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <AdminAnnouncementDialog
    v-model="isDialogVisible"
    :announcement-data="announcementData"
    :table-filters="tableFilters"
  ></AdminAnnouncementDialog>
  </template> -->
<!-- </DashboardHeader> 
</template>
-->
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import NavBar2 from '@/components/layout/NavBar.vue'

// For storing events
const announcement = ref([])

// Dialog and new event details
const dialog = ref(false)
const newAnnouncement = ref({
  title: '',
  datePosted: '',
  image: '',
  file: null,
  summary: '',
  details: '',
})

// Fetch events from Supabase
async function loadAnnouncement() {
  const { data, error } = await supabase.from('announcements').select()
  if (data) {
    // Initialize showDetails and isEditing for each announcement
    announcement.value = data.map((item) => ({
      ...item,
      showDetails: false,
      isEditing: false,
    }))
  } else {
    console.error(error)
  }
}

// Upload image
async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(`public/${file.name}`, file)

    if (error) {
      console.error('Error uploading file:', error)
      return
    }

    const { publicURL } = supabase.storage.from('event-images').getPublicUrl(data.path)
    newAnnouncement.value.image = publicURL
  }
}

async function addAnnouncement() {
  if (
    newAnnouncement.value.title &&
    newAnnouncement.value.datePosted &&
    newAnnouncement.value.summary
  ) {
    const { error } = await supabase.from('announcements').insert([
      {
        title: newAnnouncement.value.title,
        date_posted: newAnnouncement.value.datePosted,
        summary: newAnnouncement.value.summary,
        details: newAnnouncement.value.details,
        image: newAnnouncement.value.image,
      },
    ])

    if (error) {
      console.error('Error saving event to Supabase:', error)
    } else {
      console.log('Event saved successfully!') // Log success to console

      // Reload events after adding a new one
      await loadAnnouncement()

      // Close dialog and reset newAnnouncement
      dialog.value = false
      newAnnouncement.value = {
        title: '',
        datePosted: '',
        image: '',
        file: null,
        summary: '',
        details: '',
      }
    }
  } else {
    console.error('Title, Date Posted, and Summary are required.')
  }
}

// Toggle edit
function toggleEdit(announcementItem) {
  announcementItem.isEditing = !announcementItem.isEditing
}

// Optional: You can add editing file upload later if you want
const { data, error } = await supabase
  .from('announcements')
  .insert([{ some_column: 'someValue', other_column: 'otherValue' }])
  .select()

onMounted(async () => {
  await loadAnnouncement()
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
          <v-col v-for="announcement in announcement" :key="announcement.id" cols="12" md="4">
            <v-card class="mx-auto card-shadow" max-width="344">
              <v-img :src="announcement.img_url" height="200px" cover></v-img>

              <v-card-title>{{ announcement.title }}</v-card-title>

              <v-card-subtitle><b>Date Posted:</b> {{ announcement.datePosted }}</v-card-subtitle>

              <v-card-text>{{ announcement.summary }}</v-card-text>

              <v-card-actions>
                <v-btn @click="item.showDetails = !item.showDetails">
                  {{ item.showDetails ? 'Hide' : 'View Details' }}
                </v-btn>
                <v-btn color="red" @click="deleteAnnouncement(item.id)">🗑️ Delete</v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="announcement.showDetails" class="pa-4">
                  <template v-if="announcement.isEditing">
                    <v-text-field v-model="announcement.title" label="Event Title" dense outlined />
                    <v-text-field
                      v-model="announcement.date_posted"
                      label="Date Posted"
                      dense
                      outlined
                    />
                    <v-file-input
                      accept="image/*"
                      @change="(e) => handleEditFileUpload(e, announcement)"
                      label="Image File"
                      dense
                      outlined
                    />
                    <v-textarea v-model="announcement.summary" label="Summary" dense outlined />
                    <v-textarea
                      v-model="announcement.details"
                      label="Full Details"
                      dense
                      outlined
                    />
                  </template>

                  <template v-else>
                    <p><b>Full Details:</b> {{ announcement.details }}</p>
                  </template>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>

        <!-- Add New Event Dialog -->
        <v-dialog v-model="dialog" max-width="600">
          <v-card>
            <v-card-title>Add New Event</v-card-title>
            <v-card-text>
              <v-text-field v-model="newAnnouncement.title" label="Title" />
              <v-text-field v-model="newAnnouncement.datePosted" label="Date Posted" />
              <v-file-input
                accept="image/*"
                @change="handleFileUpload"
                label="Upload Image (jpg/png)"
              />
              <v-textarea v-model="newAnnouncement.summary" label="Summary" />
              <v-textarea v-model="newAnnouncement.details" label="Full Details" />
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="addAnnouncement">Save Event</v-btn>
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
