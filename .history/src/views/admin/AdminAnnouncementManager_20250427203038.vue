<script setup>
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
const announcementData = ref(null)
const isDialogVisible = ref(false)

// Add Items
const addAnnouncement = () => {
  announcementData.value = null
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
  <!-- <template #content> -->
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
      <v-btn
        prepend-icon="mdi-plus"
        color="red-darken-2"
        @click="addAnnouncement"
        block
        class="text-white"
      >
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
          <v-btn variant="elevated" density="comfortable" icon>
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
  <!-- </template> -->
  <!-- </DashboardHeader> -->
</template>
