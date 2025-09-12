<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import AdminHeader from '@/components/layout/AdminHeader.vue'
import PreloaderView from '@/components/layout/PreloaderView.vue'

const loading = ref(true)
const allEvents = ref([])
const selectedEvent = ref(null)
const editDialog = ref(false)
const deleteDialog = ref(false)
const actionLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const filterType = ref('all')
const searchQuery = ref('')

// Event categories for display
const eventCategories = ref([
  { name: 'announcement', label: 'Announcement', color: '#9C27B0', icon: 'mdi-bullhorn' },
  { name: 'meeting', label: 'Meeting', color: '#9C27B0', icon: 'mdi-bullhorn' },
  { name: 'mass', label: 'Holy Mass', color: '#f093fb', icon: 'mdi-church' },
  { name: 'event', label: 'Parish Event', color: '#43e97b', icon: 'mdi-calendar-star' },
  { name: 'celebration', label: 'Celebration', color: '#FF9800', icon: 'mdi-party-popper' },
  { name: 'wedding', label: 'Wedding', color: '#667eea', icon: 'mdi-heart' },
  { name: 'baptism', label: 'Baptism', color: '#4facfe', icon: 'mdi-water' },
  { name: 'funeral', label: 'Funeral', color: '#424242', icon: 'mdi-cross' },
  { name: 'thanksgiving', label: 'Thanksgiving', color: '#FF5722', icon: 'mdi-hands-pray' },
])

const editForm = ref({
  title: '',
  description: '',
  date: '',
  starting_time: '',
  ending_time: '',
  type: 'announcement',
})

// Helper functions
const getEventColor = (type) => {
  const category = eventCategories.value.find((cat) => cat.name === type)
  return category?.color || '#757575'
}

const getEventIcon = (type) => {
  const category = eventCategories.value.find((cat) => cat.name === type)
  return category?.icon || 'mdi-calendar'
}

const formatEventTitle = (event) => {
  if (event.source === 'announcement') {
    return event.title
  }

  // Format booking titles based on type
  switch (event.type) {
    case 'wedding':
      return `Wedding: ${event.bride_firstname || ''} ${event.bride_lastname || ''} & ${event.groom_firstname || ''} ${event.groom_lastname || ''}`
    case 'baptism':
      return `Baptism: ${event.child_firstname || ''} ${event.child_lastname || ''}`
    case 'funeral':
      return `Funeral Service: ${event.deceased_firstname || ''} ${event.deceased_lastname || ''}`
    case 'thanksgiving':
      return `Thanksgiving: ${event.participant_firstname || ''} ${event.participant_lastname || ''}`
    default:
      return event.title || 'Event'
  }
}

const formatEventDescription = (event) => {
  if (event.source === 'announcement') {
    return event.description || 'No description provided'
  }

  // Generate descriptions for bookings
  switch (event.type) {
    case 'wedding':
      return (
        event.title ||
        `Wedding ceremony for ${event.bride_firstname || ''} and ${event.groom_firstname || ''}`
      )
    case 'baptism':
      return (
        event.additional_notes ||
        `Baptism ceremony for ${event.child_firstname || ''} ${event.child_lastname || ''}`
      )
    case 'funeral':
      return (
        event.comment ||
        `Funeral service for ${event.deceased_firstname || ''} ${event.deceased_lastname || ''}`
      )
    case 'thanksgiving':
      return (
        event.reason_for_thanksgiving ||
        `Thanksgiving service for ${event.participant_firstname || ''} ${event.participant_lastname || ''}`
      )
    default:
      return 'No description available'
  }
}

// Computed properties
const filteredEvents = computed(() => {
  let filtered = allEvents.value

  // Filter by type
  if (filterType.value !== 'all') {
    filtered = filtered.filter((event) => event.type === filterType.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (event) =>
        formatEventTitle(event).toLowerCase().includes(query) ||
        formatEventDescription(event).toLowerCase().includes(query),
    )
  }

  return filtered
})

const eventTypeOptions = computed(() => [
  { value: 'all', title: 'All Events' },
  ...eventCategories.value.map((cat) => ({ value: cat.name, title: cat.label })),
])

// Methods
const loadAllEvents = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    // Load announcements
    const { data: announcements, error: announcementsError } = await supabase
      .from('announcements')
      .select('*')
      .order('date', { ascending: false })

    if (announcementsError) throw announcementsError

    // Load approved bookings from all tables
    const [
      { data: weddings, error: weddingError },
      { data: baptisms, error: baptismError },
      { data: funerals, error: funeralError },
      { data: thanksgivings, error: thanksgivingError },
    ] = await Promise.all([
      supabase.from('wedding_bookings').select('*').eq('is_approved', true),
      supabase.from('baptism_bookings').select('*').eq('is_approved', true),
      supabase.from('funeral_bookings').select('*').eq('is_approved', true),
      supabase.from('thanksgiving_bookings').select('*').eq('is_approved', true),
    ])

    if (weddingError) throw weddingError
    if (baptismError) throw baptismError
    if (funeralError) throw funeralError
    if (thanksgivingError) throw thanksgivingError

    const events = []

    // Process announcements
    if (announcements) {
      events.push(
        ...announcements.map((event) => ({
          ...event,
          source: 'announcement',
          event_date: event.date,
          table_name: 'announcements',
        })),
      )
    }

    // Process wedding bookings
    if (weddings) {
      events.push(
        ...weddings.map((booking) => ({
          ...booking,
          source: 'booking',
          type: 'wedding',
          event_date: booking.wedding_date,
          table_name: 'wedding_bookings',
        })),
      )
    }

    // Process baptism bookings
    if (baptisms) {
      events.push(
        ...baptisms.map((booking) => ({
          ...booking,
          source: 'booking',
          type: 'baptism',
          event_date: booking.baptism_date,
          table_name: 'baptism_bookings',
        })),
      )
    }

    // Process funeral bookings
    if (funerals) {
      events.push(
        ...funerals.map((booking) => ({
          ...booking,
          source: 'booking',
          type: 'funeral',
          event_date: booking.funeral_date,
          table_name: 'funeral_bookings',
        })),
      )
    }

    // Process thanksgiving bookings
    if (thanksgivings) {
      events.push(
        ...thanksgivings.map((booking) => ({
          ...booking,
          source: 'booking',
          type: 'thanksgiving',
          event_date: booking.thanksgiving_date,
          table_name: 'thanksgiving_bookings',
        })),
      )
    }

    // Sort by date (latest first) and then by created_at
    allEvents.value = events
      .filter((event) => event.event_date) // Only include events with dates
      .sort((a, b) => {
        const dateA = new Date(a.event_date)
        const dateB = new Date(b.event_date)
        if (dateA.getTime() === dateB.getTime()) {
          // If same date, sort by creation time (latest first)
          return new Date(b.created_at) - new Date(a.created_at)
        }
        return dateB - dateA
      })
  } catch (error) {
    console.error('Error loading events:', error)
    errorMessage.value = 'Failed to load events. Please refresh the page.'
  } finally {
    loading.value = false
  }
}

const openEditDialog = (event) => {
  if (event.source !== 'announcement') {
    errorMessage.value =
      'Only announcements can be edited. Bookings must be managed through the booking system.'
    return
  }

  selectedEvent.value = event
  editForm.value = {
    title: event.title || '',
    description: event.description || '',
    date: event.date || '',
    starting_time: event.starting_time || '',
    ending_time: event.ending_time || '',
    type: event.type || 'announcement',
  }
  editDialog.value = true
}

const openDeleteDialog = (event) => {
  selectedEvent.value = event
  deleteDialog.value = true
}

const closeDialogs = () => {
  editDialog.value = false
  deleteDialog.value = false
  selectedEvent.value = null
  editForm.value = {
    title: '',
    description: '',
    date: '',
    starting_time: '',
    ending_time: '',
    type: 'announcement',
  }
}

const updateEvent = async () => {
  if (!selectedEvent.value || selectedEvent.value.source !== 'announcement') return

  try {
    actionLoading.value = true
    errorMessage.value = ''

    const { error } = await supabase
      .from('announcements')
      .update({
        title: editForm.value.title,
        description: editForm.value.description,
        date: editForm.value.date,
        starting_time: editForm.value.starting_time,
        ending_time: editForm.value.ending_time,
        type: editForm.value.type,
      })
      .eq('id', selectedEvent.value.id)

    if (error) throw error

    successMessage.value = 'Event updated successfully!'
    closeDialogs()
    await loadAllEvents()

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error updating event:', error)
    errorMessage.value = 'Failed to update event. Please try again.'
  } finally {
    actionLoading.value = false
  }
}

const deleteEvent = async () => {
  if (!selectedEvent.value) return

  try {
    actionLoading.value = true
    errorMessage.value = ''

    const { error } = await supabase
      .from(selectedEvent.value.table_name)
      .delete()
      .eq('id', selectedEvent.value.id)

    if (error) throw error

    successMessage.value = `${selectedEvent.value.source === 'announcement' ? 'Announcement' : 'Event'} deleted successfully!`
    closeDialogs()
    await loadAllEvents()

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error deleting event:', error)
    errorMessage.value = 'Failed to delete event. Please try again.'
  } finally {
    actionLoading.value = false
  }
}

const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const formatTime = (time) => {
  if (!time) return 'Time not set'

  // Handle both time formats
  if (time.includes(':')) {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return time
}

const isEventPassed = (eventDate) => {
  return new Date(eventDate) < new Date()
}

onMounted(() => {
  loadAllEvents()
})
</script>

<template>
  <PreloaderView v-if="loading" />
  <AdminHeader v-else>
    <template #content>
      <!-- Animated Background -->
      <div class="animated-bg"></div>
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>

      <v-container fluid class="pa-4 pa-md-8">
        <!-- Header Section -->
        <div class="glass-card pa-6 mb-8">
          <div
            class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center ga-4"
          >
            <div>
              <h1 class="header-gradient mb-2 text-h4 text-md-h3">Events Management</h1>
              <p class="text-subtitle-1 text-grey">
                Manage all parish events, announcements, and approved bookings
              </p>
            </div>

            <div class="d-flex align-center ga-2">
              <v-chip color="primary" variant="tonal">
                <v-icon start>mdi-calendar-multiple</v-icon>
                {{ filteredEvents.length }} Events
              </v-chip>
            </div>
          </div>
        </div>

        <!-- Alerts -->
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          closable
          @click:close="clearMessages"
          class="mb-4"
        >
          {{ errorMessage }}
        </v-alert>

        <v-alert
          v-if="successMessage"
          type="success"
          variant="tonal"
          closable
          @click:close="clearMessages"
          class="mb-4"
        >
          {{ successMessage }}
        </v-alert>

        <!-- Filters and Search -->
        <v-card class="glass-card mb-6">
          <v-card-text class="pa-4">
            <v-row align="center">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  prepend-inner-icon="mdi-magnify"
                  label="Search events..."
                  variant="outlined"
                  clearable
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterType"
                  :items="eventTypeOptions"
                  label="Filter by type"
                  variant="outlined"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="5" class="text-right">
                <v-btn @click="loadAllEvents" :loading="loading" color="primary">
                  <v-icon start>mdi-refresh</v-icon>
                  Refresh
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Events Feed -->
        <div v-if="filteredEvents.length === 0 && !loading" class="text-center py-12">
          <v-icon size="120" color="grey-lighten-2">mdi-calendar-blank</v-icon>
          <h3 class="text-h5 mt-4 text-grey">No events found</h3>
          <p class="text-grey">Try adjusting your search or filter criteria</p>
        </div>

        <div v-else class="events-feed">
          <v-row>
            <v-col v-for="event in filteredEvents" :key="`${event.source}-${event.id}`" cols="12">
              <v-card
                class="event-card glass-card"
                :class="{ 'event-passed': isEventPassed(event.event_date) }"
              >
                <v-card-text class="pa-6">
                  <div class="d-flex justify-space-between align-start">
                    <div class="flex-grow-1">
                      <!-- Event Header -->
                      <div class="d-flex align-center mb-3">
                        <div
                          class="event-icon me-3"
                          :style="{ backgroundColor: getEventColor(event.type) }"
                        >
                          <v-icon color="white" size="20">{{ getEventIcon(event.type) }}</v-icon>
                        </div>
                        <div>
                          <h3 class="text-h6 mb-1">{{ formatEventTitle(event) }}</h3>
                          <div class="d-flex align-center ga-2">
                            <v-chip :color="getEventColor(event.type)" size="small" variant="tonal">
                              {{
                                eventCategories.find((cat) => cat.name === event.type)?.label ||
                                event.type
                              }}
                            </v-chip>
                            <v-chip
                              :color="event.source === 'announcement' ? 'blue' : 'green'"
                              size="small"
                              variant="outlined"
                            >
                              {{ event.source === 'announcement' ? 'Announcement' : 'Booking' }}
                            </v-chip>
                            <v-chip
                              v-if="isEventPassed(event.event_date)"
                              color="grey"
                              size="small"
                              variant="tonal"
                            >
                              Past Event
                            </v-chip>
                          </div>
                        </div>
                      </div>

                      <!-- Event Details -->
                      <div class="mb-4">
                        <p class="text-body-1 mb-2">{{ formatEventDescription(event) }}</p>

                        <div class="d-flex flex-wrap align-center ga-4 text-grey-darken-1">
                          <div class="d-flex align-center">
                            <v-icon class="me-2" size="18">mdi-calendar</v-icon>
                            <span>{{
                              new Date(event.event_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            }}</span>
                          </div>

                          <div v-if="event.starting_time" class="d-flex align-center">
                            <v-icon class="me-2" size="18">mdi-clock-outline</v-icon>
                            <span>{{ formatTime(event.starting_time) }}</span>
                            <span v-if="event.ending_time">
                              - {{ formatTime(event.ending_time) }}</span
                            >
                          </div>

                          <div class="d-flex align-center">
                            <v-icon class="me-2" size="18">mdi-calendar-plus</v-icon>
                            <span
                              >Created {{ new Date(event.created_at).toLocaleDateString() }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="d-flex flex-column ga-2 ms-4">
                      <v-btn
                        v-if="event.source === 'announcement'"
                        @click="openEditDialog(event)"
                        color="primary"
                        variant="tonal"
                        size="small"
                        icon="mdi-pencil"
                      />
                      <v-btn
                        @click="openDeleteDialog(event)"
                        color="error"
                        variant="tonal"
                        size="small"
                        icon="mdi-delete"
                      />
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>

      <!-- Edit Dialog (Only for announcements) -->
      <v-dialog v-model="editDialog" max-width="600" persistent>
        <v-card class="glass-card">
          <v-card-title class="d-flex align-center">
            <v-icon class="me-2" color="primary">mdi-pencil</v-icon>
            Edit Announcement
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-6">
            <v-form @submit.prevent="updateEvent">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editForm.title"
                    label="Title"
                    variant="outlined"
                    required
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="editForm.description"
                    label="Description"
                    variant="outlined"
                    rows="3"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editForm.date"
                    label="Date"
                    type="date"
                    variant="outlined"
                    required
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editForm.starting_time"
                    label="Start Time"
                    type="time"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="editForm.ending_time"
                    label="End Time"
                    type="time"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="editForm.type"
                    :items="eventCategories"
                    item-title="label"
                    item-value="name"
                    label="Event Type"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-6">
            <v-spacer />
            <v-btn @click="closeDialogs" variant="outlined">Cancel</v-btn>
            <v-btn @click="updateEvent" color="primary" :loading="actionLoading">
              Update Event
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Dialog -->
      <v-dialog v-model="deleteDialog" max-width="500" persistent>
        <v-card class="glass-card">
          <v-card-title class="d-flex align-center text-error">
            <v-icon class="me-2" color="error">mdi-alert-circle</v-icon>
            Delete {{ selectedEvent?.source === 'announcement' ? 'Announcement' : 'Event' }}
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-6">
            <p class="mb-4">
              Are you sure you want to delete this
              {{ selectedEvent?.source === 'announcement' ? 'announcement' : 'event' }}?
            </p>

            <v-alert type="warning" variant="tonal" class="mb-4">
              <strong>{{ formatEventTitle(selectedEvent || {}) }}</strong
              ><br />
              {{ new Date(selectedEvent?.event_date || '').toLocaleDateString() }}
              {{
                selectedEvent?.starting_time ? `at ${formatTime(selectedEvent.starting_time)}` : ''
              }}
            </v-alert>

            <p class="text-caption text-grey">
              This action cannot be undone.
              {{
                selectedEvent?.source === 'booking'
                  ? 'Note: This will delete the approved booking record.'
                  : ''
              }}
            </p>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-6">
            <v-spacer />
            <v-btn @click="closeDialogs" variant="outlined">Cancel</v-btn>
            <v-btn @click="deleteEvent" color="error" :loading="actionLoading">
              Delete {{ selectedEvent?.source === 'announcement' ? 'Announcement' : 'Event' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </AdminHeader>
</template>


