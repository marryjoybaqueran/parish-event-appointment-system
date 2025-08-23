<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import AdminHeader from '@/components/layout/AdminHeader.vue'
import PreloaderView from '@/components/layout/PreloaderView.vue'

// Data refs
const selectedDate = ref(new Date())
const currentView = ref('overview')
const pendingBookings = ref([])
const events = ref([])
const stats = ref({
  totalBookings: 0,
  pendingApprovals: 0,
  upcomingEvents: 0,
  totalMembers: 0,
})

// Event creation
const newEvent = ref({
  title: '',
  description: '',
  date: '',
  time: '',
  type: 'announcement',
})

const eventDialog = ref(false)
const bookingDialog = ref(false)
const selectedBooking = ref(null)

// Calendar data
const calendarEvents = ref([])
const selectedDateEvents = ref([])

// Event categories (defined in app instead of database)
const eventCategories = ref([
  { name: 'announcement', label: 'Announcement', color: '#9C27B0', icon: 'mdi-bullhorn' },
  { name: 'mass', label: 'Holy Mass', color: '#2196F3', icon: 'mdi-church' },
  { name: 'event', label: 'Parish Event', color: '#4CAF50', icon: 'mdi-calendar-star' },
  { name: 'celebration', label: 'Celebration', color: '#FF9800', icon: 'mdi-party-popper' },
  { name: 'wedding', label: 'Wedding', color: '#E91E63', icon: 'mdi-heart' },
  { name: 'baptism', label: 'Baptism', color: '#00BCD4', icon: 'mdi-water' },
  { name: 'funeral', label: 'Funeral', color: '#424242', icon: 'mdi-cross' },
  { name: 'thanksgiving', label: 'Thanksgiving', color: '#FF5722', icon: 'mdi-hands-pray' },
])

// Load all data
const loadDashboardData = async () => {
  await Promise.all([loadPendingBookings(), loadEvents(), loadStats(), loadCalendarEvents()])
}

const loadPendingBookings = async () => {
  try {
    // Load from multiple booking tables
    const tables = [
      'wedding_bookings',
      'baptism_bookings',
      'funeral_bookings',
      'thanksgiving_bookings',
    ]
    const allBookings = []

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').eq('status', 'pending')

      if (data && !error) {
        const bookingsWithType = data.map((booking) => ({
          ...booking,
          type: table.replace('_bookings', ''),
          table: table,
        }))
        allBookings.push(...bookingsWithType)
      }
    }

    pendingBookings.value = allBookings
    stats.value.pendingApprovals = allBookings.length
  } catch (error) {
    console.error('Error loading pending bookings:', error)
  }
}

const loadEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('parish_events')
      .select('*')
      .order('date', { ascending: true })

    if (data && !error) {
      events.value = data
      stats.value.upcomingEvents = data.filter((e) => new Date(e.date) >= new Date()).length
    }
  } catch (error) {
    console.error('Error loading events:', error)
  }
}

const loadStats = async () => {
  try {
    const tables = [
      'wedding_bookings',
      'baptism_bookings',
      'funeral_bookings',
      'thanksgiving_bookings',
    ]
    let totalBookings = 0

    for (const table of tables) {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact' })

      if (!error) {
        totalBookings += count || 0
      }
    }

    stats.value.totalBookings = totalBookings
    stats.value.totalMembers = Math.floor(totalBookings * 1.5) // Estimated
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const loadCalendarEvents = async () => {
  try {
    const tables = [
      'wedding_bookings',
      'baptism_bookings',
      'funeral_bookings',
      'thanksgiving_bookings',
    ]
    const allEvents = []

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').eq('status', 'approved')

      if (data && !error) {
        const events = data.map((booking) => {
          let date, time, title

          if (table === 'wedding_bookings') {
            date = booking.wedding_date
            time = booking.wedding_time
            title = `Wedding: ${booking.bride_firstname} & ${booking.groom_firstname}`
          } else if (table === 'baptism_bookings') {
            date = booking.date_selected
            time = booking.time_selected
            title = `Baptism: ${booking.first_name} ${booking.last_name}`
          } else {
            date = booking.date_selected || booking.selected_date
            time = booking.time_selected || booking.selected_time
            title = `${table.replace('_bookings', '').toUpperCase()}: ${booking.first_name || booking.name}`
          }

          return {
            date,
            time,
            title,
            type: table.replace('_bookings', ''),
            color: getEventColor(table.replace('_bookings', '')),
          }
        })
        allEvents.push(...events)
      }
    }

    // Add parish events
    const { data: parishEvents, error } = await supabase.from('parish_events').select('*')

    if (parishEvents && !error) {
      const events = parishEvents.map((event) => ({
        date: event.date,
        time: event.time,
        title: event.title,
        type: 'event',
        color: '#9C27B0',
      }))
      allEvents.push(...events)
    }

    calendarEvents.value = allEvents
    updateSelectedDateEvents()
  } catch (error) {
    console.error('Error loading calendar events:', error)
  }
}

const getEventColor = (type) => {
  const category = eventCategories.value.find((cat) => cat.name === type)
  return category?.color || '#757575'
}

// Removed unused function getCategoryLabel

const updateSelectedDateEvents = () => {
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  selectedDateEvents.value = calendarEvents.value.filter((event) => event.date === dateStr)
}

const approveBooking = async (booking) => {
  try {
    const { error } = await supabase
      .from(booking.table)
      .update({ status: 'approved' })
      .eq('id', booking.id)

    if (!error) {
      await loadDashboardData()
      bookingDialog.value = false
    }
  } catch (error) {
    console.error('Error approving booking:', error)
  }
}

const denyBooking = async (booking) => {
  try {
    const { error } = await supabase
      .from(booking.table)
      .update({ status: 'denied' })
      .eq('id', booking.id)

    if (!error) {
      await loadDashboardData()
      bookingDialog.value = false
    }
  } catch (error) {
    console.error('Error denying booking:', error)
  }
}

const createEvent = async () => {
  try {
    const { error } = await supabase.from('parish_events').insert([
      {
        title: newEvent.value.title,
        description: newEvent.value.description,
        date: newEvent.value.date,
        time: newEvent.value.time,
        type: newEvent.value.type,
        created_at: new Date().toISOString(),
      },
    ])

    if (!error) {
      await loadDashboardData()
      eventDialog.value = false
      resetEventForm()
    }
  } catch (error) {
    console.error('Error creating event:', error)
  }
}

const resetEventForm = () => {
  newEvent.value = {
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'announcement',
  }
}

const openBookingDetails = (booking) => {
  selectedBooking.value = booking
  bookingDialog.value = true
}

const formatBookingDetails = (booking) => {
  if (booking.type === 'wedding') {
    return {
      title: `Wedding Booking`,
      subtitle: `${booking.bride_firstname} ${booking.bride_lastname} & ${booking.groom_firstname} ${booking.groom_lastname}`,
      date: booking.wedding_date,
      time: booking.wedding_time,
      details: [
        { label: 'Bride', value: `${booking.bride_firstname} ${booking.bride_lastname}` },
        { label: 'Groom', value: `${booking.groom_firstname} ${booking.groom_lastname}` },
        { label: 'Date', value: booking.wedding_date },
        { label: 'Time', value: booking.wedding_time },
      ],
    }
  } else if (booking.type === 'baptism') {
    return {
      title: `Baptism Booking`,
      subtitle: `${booking.first_name} ${booking.last_name}`,
      date: booking.date_selected,
      time: booking.time_selected,
      details: [
        { label: 'Child', value: `${booking.first_name} ${booking.last_name}` },
        { label: 'Mother', value: booking.mother_fullname },
        { label: 'Father', value: booking.father_fullname },
        { label: 'Date', value: booking.date_selected },
        { label: 'Time', value: booking.time_selected },
      ],
    }
  }
  return {
    title: `${booking.type.toUpperCase()} Booking`,
    subtitle: booking.name || 'Details',
    date: booking.date_selected || booking.selected_date,
    time: booking.time_selected || booking.selected_time,
    details: [],
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <PreloaderView />
  <AdminHeader>
    <template #content>
      <v-container fluid class="pa-6">
        <!-- Dashboard Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h3 font-weight-bold text-primary mb-2">Admin Dashboard</h1>
            <p class="text-h6 text-grey-darken-1">Parish Information Management System</p>
          </div>
          <div class="d-flex gap-3">
            <v-btn
              color="primary"
              prepend-icon="mdi-calendar-plus"
              @click="eventDialog = true"
              size="large"
            >
              Create Event
            </v-btn>
            <v-btn
              :color="currentView === 'overview' ? 'primary' : 'grey'"
              @click="currentView = 'overview'"
              variant="outlined"
            >
              Overview
            </v-btn>
            <v-btn
              :color="currentView === 'calendar' ? 'primary' : 'grey'"
              @click="currentView = 'calendar'"
              variant="outlined"
            >
              Calendar
            </v-btn>
            <v-btn
              :color="currentView === 'bookings' ? 'primary' : 'grey'"
              @click="currentView = 'bookings'"
              variant="outlined"
            >
              Bookings
            </v-btn>
          </div>
        </div>

        <!-- Stats Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card class="stat-card" elevation="3">
              <v-card-text class="text-center">
                <v-icon size="40" color="primary" class="mb-3">mdi-book-multiple</v-icon>
                <h2 class="text-h4 font-weight-bold">{{ stats.totalBookings }}</h2>
                <p class="text-grey-darken-1">Total Bookings</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class="stat-card" elevation="3">
              <v-card-text class="text-center">
                <v-icon size="40" color="orange" class="mb-3">mdi-clock-alert</v-icon>
                <h2 class="text-h4 font-weight-bold">{{ stats.pendingApprovals }}</h2>
                <p class="text-grey-darken-1">Pending Approvals</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class="stat-card" elevation="3">
              <v-card-text class="text-center">
                <v-icon size="40" color="green" class="mb-3">mdi-calendar-check</v-icon>
                <h2 class="text-h4 font-weight-bold">{{ stats.upcomingEvents }}</h2>
                <p class="text-grey-darken-1">Upcoming Events</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class="stat-card" elevation="3">
              <v-card-text class="text-center">
                <v-icon size="40" color="purple" class="mb-3">mdi-account-group</v-icon>
                <h2 class="text-h4 font-weight-bold">{{ stats.totalMembers }}</h2>
                <p class="text-grey-darken-1">Parish Members</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Main Content Based on View -->
        <div v-if="currentView === 'overview'">
          <v-row>
            <!-- Calendar Section -->
            <v-col cols="12" lg="8">
              <v-card elevation="3" class="mb-4">
                <v-card-title class="d-flex align-center">
                  <v-icon class="me-2">mdi-calendar</v-icon>
                  Schedule Calendar
                </v-card-title>
                <v-card-text>
                  <v-date-picker
                    v-model="selectedDate"
                    @update:model-value="updateSelectedDateEvents"
                    show-adjacent-months
                    multiple="range"
                    class="calendar-picker"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Selected Date Events -->
            <v-col cols="12" lg="4">
              <v-card elevation="3" class="h-100">
                <v-card-title class="d-flex align-center">
                  <v-icon class="me-2">mdi-calendar-today</v-icon>
                  Today's Schedule
                </v-card-title>
                <v-card-text>
                  <div
                    v-if="selectedDateEvents.length === 0"
                    class="text-center text-grey-darken-1 py-8"
                  >
                    <v-icon size="64" color="grey-lighten-2">mdi-calendar-blank</v-icon>
                    <p class="mt-3">No events scheduled</p>
                  </div>
                  <div v-else>
                    <v-list>
                      <v-list-item
                        v-for="(event, index) in selectedDateEvents"
                        :key="index"
                        class="mb-2"
                      >
                        <template v-slot:prepend>
                          <v-chip :color="event.color" size="small" class="me-3">
                            {{ event.type }}
                          </v-chip>
                        </template>
                        <v-list-item-title>{{ event.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ event.time }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Recent Bookings -->
          <v-card elevation="3" class="mt-4">
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon class="me-2">mdi-clipboard-list</v-icon>
                Pending Approvals
              </div>
              <v-chip color="orange" variant="outlined">
                {{ pendingBookings.length }} pending
              </v-chip>
            </v-card-title>
            <v-card-text>
              <div v-if="pendingBookings.length === 0" class="text-center text-grey-darken-1 py-8">
                <v-icon size="64" color="grey-lighten-2">mdi-check-all</v-icon>
                <p class="mt-3">No pending approvals</p>
              </div>
              <v-list v-else>
                <v-list-item
                  v-for="(booking, index) in pendingBookings.slice(0, 5)"
                  :key="index"
                  @click="openBookingDetails(booking)"
                  class="booking-item"
                >
                  <template v-slot:prepend>
                    <v-chip :color="getEventColor(booking.type)" size="small" class="me-3">
                      {{ booking.type }}
                    </v-chip>
                  </template>
                  <v-list-item-title>
                    {{ formatBookingDetails(booking).subtitle }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ formatBookingDetails(booking).date }} -
                    {{ formatBookingDetails(booking).time }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <v-btn icon="mdi-chevron-right" variant="text" size="small"></v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </div>

        <!-- Calendar View -->
        <div v-if="currentView === 'calendar'">
          <v-card elevation="3">
            <v-card-title>Full Calendar View</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="8">
                  <v-date-picker
                    v-model="selectedDate"
                    @update:model-value="updateSelectedDateEvents"
                    show-adjacent-months
                    multiple="range"
                    class="w-100"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <h3 class="mb-4">All Events</h3>
                  <v-list>
                    <v-list-item
                      v-for="(event, index) in calendarEvents.slice(0, 10)"
                      :key="index"
                      class="mb-2"
                    >
                      <template v-slot:prepend>
                        <v-chip :color="event.color" size="small" class="me-3">
                          {{ event.type }}
                        </v-chip>
                      </template>
                      <v-list-item-title>{{ event.title }}</v-list-item-title>
                      <v-list-item-subtitle
                        >{{ event.date }} - {{ event.time }}</v-list-item-subtitle
                      >
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- Bookings Management View -->
        <div v-if="currentView === 'bookings'">
          <v-card elevation="3">
            <v-card-title>Booking Management</v-card-title>
            <v-card-text>
              <v-data-table
                :items="pendingBookings"
                :headers="[
                  { title: 'Type', key: 'type' },
                  { title: 'Details', key: 'details' },
                  { title: 'Date', key: 'date' },
                  { title: 'Time', key: 'time' },
                  { title: 'Actions', key: 'actions', sortable: false },
                ]"
                class="booking-table"
              >
                <template >
                  <v-chip :color="getEventColor(item.type)" size="small">
                    {{ item.type }}
                  </v-chip>
                </template>
                <template >
                  {{ formatBookingDetails(item).subtitle }}
                </template>
                <template >
                  {{ formatBookingDetails(item).date }}
                </template>
                <template>
                  {{ formatBookingDetails(item).time }}
                </template>
                <template #item.actions="{ item }">
                  <v-btn
                    color="green"
                    size="small"
                    variant="outlined"
                    class="me-2"
                    @click="approveBooking(item)"
                  >
                    Approve
                  </v-btn>
                  <v-btn color="red" size="small" variant="outlined" @click="denyBooking(item)">
                    Deny
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </div>
      </v-container>

      <!-- Event Creation Dialog -->
      <v-dialog v-model="eventDialog" max-width="600">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="me-2">mdi-calendar-plus</v-icon>
            Create New Event
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="newEvent.title"
                label="Event Title"
                prepend-icon="mdi-format-title"
                required
              />
              <v-textarea
                v-model="newEvent.description"
                label="Description"
                prepend-icon="mdi-text"
                rows="3"
              />
              <v-text-field
                v-model="newEvent.date"
                label="Date"
                type="date"
                prepend-icon="mdi-calendar"
                required
              />
              <v-text-field
                v-model="newEvent.time"
                label="Time"
                type="time"
                prepend-icon="mdi-clock"
                required
              />
              <v-select
                v-model="newEvent.type"
                :items="eventCategories.map((cat) => ({ value: cat.name, title: cat.label }))"
                label="Event Type"
                prepend-icon="mdi-tag"
                item-title="title"
                item-value="value"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="eventDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="createEvent">Create Event</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Booking Details Dialog -->
      <v-dialog v-model="bookingDialog" max-width="600">
        <v-card v-if="selectedBooking">
          <v-card-title class="d-flex align-center">
            <v-chip :color="getEventColor(selectedBooking.type)" class="me-3">
              {{ selectedBooking.type }}
            </v-chip>
            {{ formatBookingDetails(selectedBooking).title }}
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="detail in formatBookingDetails(selectedBooking).details"
                :key="detail.label"
              >
                <v-list-item-title>{{ detail.label }}:</v-list-item-title>
                <v-list-item-subtitle>{{ detail.value }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="bookingDialog = false">Close</v-btn>
            <v-btn color="red" @click="denyBooking(selectedBooking)">Deny</v-btn>
            <v-btn color="green" @click="approveBooking(selectedBooking)">Approve</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </AdminHeader>
</template>

<style scoped>
.stat-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border-radius: 16px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.calendar-picker {
  width: 100%;
  max-width: none;
}

.booking-item {
  transition: background-color 0.3s ease;
  border-radius: 8px;
  margin-bottom: 8px;
}

.booking-item:hover {
  background-color: rgba(66, 165, 245, 0.1);
  cursor: pointer;
}

.booking-table {
  border-radius: 8px;
}

.text-h3 {
  background: linear-gradient(45deg, #1976d2, #42a5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.v-card {
  border-radius: 16px;
}

.v-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
}

.gap-3 {
  gap: 12px;
}

/* Animation for stat cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  animation: fadeInUp 0.6s ease forwards;
}

.stat-card:nth-child(1) {
  animation-delay: 0.1s;
}
.stat-card:nth-child(2) {
  animation-delay: 0.2s;
}
.stat-card:nth-child(3) {
  animation-delay: 0.3s;
}
.stat-card:nth-child(4) {
  animation-delay: 0.4s;
}
</style>
