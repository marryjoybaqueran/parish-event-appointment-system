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
  totalMembers: 0
})

// Event creation
const newEvent = ref({
  title: '',
  description: '',
  date: '',
  time: '',
  type: 'announcement'
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
  { name: 'thanksgiving', label: 'Thanksgiving', color: '#FF5722', icon: 'mdi-hands-pray' }
])

// Load all data
const loadDashboardData = async () => {
  await Promise.all([
    loadPendingBookings(),
    loadEvents(),
    loadStats(),
    loadCalendarEvents()
  ])
}

const loadPendingBookings = async () => {
  try {
    // Load from multiple booking tables
    const tables = ['wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings']
    const allBookings = []

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('status', 'pending')

      if (data && !error) {
        const bookingsWithType = data.map(booking => ({
          ...booking,
          type: table.replace('_bookings', ''),
          table: table
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
      stats.value.upcomingEvents = data.filter(e => new Date(e.date) >= new Date()).length
    }
  } catch (error) {
    console.error('Error loading events:', error)
  }
}

const loadStats = async () => {
  try {
    const tables = ['wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings']
    let totalBookings = 0

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact' })

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
    const tables = ['wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings']
    const allEvents = []

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('status', 'approved')

      if (data && !error) {
        const events = data.map(booking => {
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
            color: getEventColor(table.replace('_bookings', ''))
          }
        })
        allEvents.push(...events)
      }
    }

    // Add parish events
    const { data: parishEvents, error } = await supabase
      .from('parish_events')
      .select('*')

    if (parishEvents && !error) {
      const events = parishEvents.map(event => ({
        date: event.date,
        time: event.time,
        title: event.title,
        type: 'event',
        color: '#9C27B0'
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
  const category = eventCategories.value.find(cat => cat.name === type)
  return category?.color || '#757575'
}

const updateSelectedDateEvents = () => {
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  selectedDateEvents.value = calendarEvents.value.filter(event =>
    event.date === dateStr
  )
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
    const { error } = await supabase
      .from('parish_events')
      .insert([{
        title: newEvent.value.title,
        description: newEvent.value.description,
        date: newEvent.value.date,
        time: newEvent.value.time,
        type: newEvent.value.type,
        created_at: new Date().toISOString()
      }])

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
    type: 'announcement'
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
        { label: 'Time', value: booking.wedding_time }
      ]
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
        { label: 'Time', value: booking.time_selected }
      ]
    }
  }
  return {
    title: `${booking.type.toUpperCase()} Booking`,
    subtitle: booking.name || 'Details',
    date: booking.date_selected || booking.selected_date,
    time: booking.time_selected || booking.selected_time,
    details: []
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
      <div class="dashboard-background">
        <v-container fluid class="pa-8">
          <!-- Modern Dashboard Header -->
          <div class="header-section">
            <div class="header-content">
              <div class="header-text">
                <div class="title-wrapper">
                  <h1 class="main-title">Admin Dashboard</h1>
                  <div class="title-accent"></div>
                </div>
                <p class="subtitle">Parish Information Management System</p>
                <div class="header-stats">
                  <div class="quick-stat">
                    <v-icon size="small" color="primary">mdi-clock-outline</v-icon>
                    <span>{{ new Date().toLocaleTimeString() }}</span>
                  </div>
                  <div class="quick-stat">
                    <v-icon size="small" color="green">mdi-check-circle</v-icon>
                    <span>System Online</span>
                  </div>
                </div>
              </div>
              <div class="header-actions">
                <v-btn
                  class="create-event-btn"
                  size="large"
                  @click="eventDialog = true"
                >
                  <v-icon start>mdi-plus</v-icon>
                  Create Event
                </v-btn>
                <div class="view-toggles">
                  <v-btn-toggle
                    v-model="currentView"
                    color="primary"
                    variant="outlined"
                    divided
                    mandatory
                    class="modern-toggle"
                  >
                    <v-btn value="overview" class="toggle-btn">
                      <v-icon start>mdi-view-dashboard</v-icon>
                      Overview
                    </v-btn>
                    <v-btn value="calendar" class="toggle-btn">
                      <v-icon start>mdi-calendar-month</v-icon>
                      Calendar
                    </v-btn>
                    <v-btn value="bookings" class="toggle-btn">
                      <v-icon start>mdi-bookmark-multiple</v-icon>
                      Bookings
                    </v-btn>
                  </v-btn-toggle>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card primary-card">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">
                  <v-icon size="32">mdi-book-multiple</v-icon>
                </div>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalBookings }}</div>
                <div class="stat-label">Total Bookings</div>
                <div class="stat-trend">
                  <v-icon size="small" color="success">mdi-trending-up</v-icon>
                  <span>+12% this month</span>
                </div>
              </div>
            </div>

            <div class="stat-card orange-card">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">
                  <v-icon size="32">mdi-clock-alert</v-icon>
                </div>
                <div class="stat-pulse"></div>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.pendingApprovals }}</div>
                <div class="stat-label">Pending Approvals</div>
                <div class="stat-trend urgent">
                  <v-icon size="small" color="warning">mdi-alert</v-icon>
                  <span>Needs attention</span>
                </div>
              </div>
            </div>

            <div class="stat-card green-card">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">
                  <v-icon size="32">mdi-calendar-check</v-icon>
                </div>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.upcomingEvents }}</div>
                <div class="stat-label">Upcoming Events</div>
                <div class="stat-trend">
                  <v-icon size="small" color="info">mdi-calendar</v-icon>
                  <span>Next 30 days</span>
                </div>
              </div>
            </div>

            <div class="stat-card purple-card">
              <div class="stat-icon-wrapper">
                <div class="stat-icon">
                  <v-icon size="32">mdi-account-group</v-icon>
                </div>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalMembers }}</div>
                <div class="stat-label">Parish Members</div>
                <div class="stat-trend">
                  <v-icon size="small" color="success">mdi-account-plus</v-icon>
                  <span>Growing community</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Views -->
          <div class="content-area">
            <!-- Overview Section -->
            <div v-if="currentView === 'overview'" class="overview-grid">
              <div class="calendar-section">
                <v-card class="modern-card calendar-card">
                  <div class="card-header">
                    <div class="header-icon">
                      <v-icon color="primary">mdi-calendar-month</v-icon>
                    </div>
                    <div class="header-info">
                      <h3>Schedule Calendar</h3>
                      <p>Manage your parish schedule</p>
                    </div>
                  </div>
                  <v-card-text class="pa-6">
                    <v-date-picker
                      v-model="selectedDate"
                      @update:model-value="updateSelectedDateEvents"
                      show-adjacent-months
                      color="primary"
                      class="modern-calendar elevation-0"
                    />
                  </v-card-text>
                </v-card>
              </div>

              <div class="events-section">
                <v-card class="modern-card events-card">
                  <div class="card-header">
                    <div class="header-icon">
                      <v-icon color="secondary">mdi-calendar-today</v-icon>
                    </div>
                    <div class="header-info">
                      <h3>Today's Schedule</h3>
                      <p>{{ selectedDate.toLocaleDateString() }}</p>
                    </div>
                  </div>
                  <v-card-text class="events-content">
                    <div v-if="selectedDateEvents.length === 0" class="empty-state">
                      <div class="empty-icon">
                        <v-icon size="48" color="grey-lighten-2">mdi-calendar-blank-outline</v-icon>
                      </div>
                      <h4>No events scheduled</h4>
                      <p>This day is available for new bookings</p>
                    </div>
                    <div v-else class="events-list">
                      <div
                        v-for="(event, index) in selectedDateEvents"
                        :key="index"
                        class="event-item"
                      >
                        <div class="event-time">{{ event.time }}</div>
                        <div class="event-details">
                          <div class="event-title">{{ event.title }}</div>
                          <v-chip :color="event.color" size="small" variant="flat">
                            {{ event.type }}
                          </v-chip>
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>

              <div class="bookings-section">
                <v-card class="modern-card bookings-card">
                  <div class="card-header">
                    <div class="header-icon">
                      <v-icon color="warning">mdi-clipboard-check-multiple</v-icon>
                    </div>
                    <div class="header-info">
                      <h3>Pending Approvals</h3>
                      <v-chip color="orange" variant="flat" size="small">
                        {{ pendingBookings.length }} pending
                      </v-chip>
                    </div>
                  </div>
                  <v-card-text class="bookings-content">
                    <div v-if="pendingBookings.length === 0" class="empty-state">
                      <div class="empty-icon">
                        <v-icon size="48" color="green">mdi-check-all</v-icon>
                      </div>
                      <h4>All caught up!</h4>
                      <p>No pending approvals</p>
                    </div>
                    <div v-else class="bookings-list">
                      <div
                        v-for="(booking, index) in pendingBookings.slice(0, 5)"
                        :key="index"
                        class="booking-item"
                        @click="openBookingDetails(booking)"
                      >
                        <div class="booking-type">
                          <v-chip :color="getEventColor(booking.type)" size="small" variant="flat">
                            {{ booking.type }}
                          </v-chip>
                        </div>
                        <div class="booking-info">
                          <div class="booking-title">
                            {{ formatBookingDetails(booking).subtitle }}
                          </div>
                          <div class="booking-datetime">
                            {{ formatBookingDetails(booking).date }} • {{ formatBookingDetails(booking).time }}
                          </div>
                        </div>
                        <div class="booking-action">
                          <v-btn icon variant="text" size="small">
                            <v-icon>mdi-chevron-right</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </div>

            <!-- Calendar View -->
            <div v-if="currentView === 'calendar'">
              <v-card class="modern-card">
                <div class="card-header">
                  <div class="header-icon">
                    <v-icon color="primary">mdi-calendar-month</v-icon>
                  </div>
                  <div class="header-info">
                    <h3>Full Calendar View</h3>
                    <p>Complete schedule overview</p>
                  </div>
                </div>
                <v-card-text class="pa-6">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-date-picker
                        v-model="selectedDate"
                        @update:model-value="updateSelectedDateEvents"
                        show-adjacent-months
                        color="primary"
                        class="w-100 modern-calendar elevation-0"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="events-sidebar">
                        <h4 class="mb-4">All Events</h4>
                        <div class="events-list">
                          <div
                            v-for="(event, index) in calendarEvents.slice(0, 10)"
                            :key="index"
                            class="event-item"
                          >
                            <div class="event-time">{{ event.time }}</div>
                            <div class="event-details">
                              <div class="event-title">{{ event.title }}</div>
                              <div class="event-meta">
                                <v-chip :color="event.color" size="x-small" variant="flat">
                                  {{ event.type }}
                                </v-chip>
                                <span class="event-date">{{ event.date }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>

            <!-- Bookings Management View -->
            <div v-if="currentView === 'bookings'">
              <v-card class="modern-card">
                <div class="card-header">
                  <div class="header-icon">
                    <v-icon color="primary">mdi-clipboard-list-outline</v-icon>
                  </div>
                  <div class="header-info">
                    <h3>Booking Management</h3>
                    <p>Manage all booking requests</p>
                  </div>
                </div>
                <v-card-text class="pa-6">
                  <v-data-table
                    :items="pendingBookings"
                    :headers="[
                      { title: 'Type', key: 'type' },
                      { title: 'Details', key: 'details' },
                      { title: 'Date', key: 'date' },
                      { title: 'Time', key: 'time' },
                      { title: 'Actions', key: 'actions', sortable: false }
                    ]"
                    class="modern-table elevation-0"
                  >
                    <template v-slot:item.type="{ item }">
                      <v-chip :color="getEventColor(item.type)" size="small" variant="flat">
                        {{ item.type }}
                      </v-chip>
                    </template>
                    <template v-slot:item.details="{ item }">
                      <div class="booking-details">
                        <div class="detail-title">{{ formatBookingDetails(item).subtitle }}</div>
                      </div>
                    </template>
                    <template v-slot:item.date="{ item }">
                      <div class="booking-date">
                        {{ formatBookingDetails(item).date }}
                      </div>
                    </template>
                    <template v-slot:item.time="{ item }">
                      <div class="booking-time">
                        {{ formatBookingDetails(item).time }}
                      </div>
                    </template>
                    <template v-slot:item.actions="{ item }">
                      <div class="action-buttons">
                        <v-btn
                          color="success"
                          size="small"
                          variant="flat"
                          class="me-2"
                          @click="approveBooking(item)"
                        >
                          <v-icon start size="small">mdi-check</v-icon>
                          Approve
                        </v-btn>
                        <v-btn
                          color="error"
                          size="small"
                          variant="outlined"
                          @click="denyBooking(item)"
                        >
                          <v-icon start size="small">mdi-close</v-icon>
                          Deny
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-container>

        <!-- Enhanced Event Creation Dialog -->
        <v-dialog v-model="eventDialog" max-width="600" class="modern-dialog">
          <v-card class="dialog-card">
            <div class="dialog-header">
              <div class="dialog-icon">
                <v-icon color="primary" size="24">mdi-calendar-plus</v-icon>
              </div>
              <div class="dialog-title">
                <h3>Create New Event</h3>
                <p>Add a new event to the parish calendar</p>
              </div>
            </div>
            <v-card-text class="pa-6">
              <v-form class="event-form">
                <v-text-field
                  v-model="newEvent.title"
                  label="Event Title"
                  variant="outlined"
                  prepend-inner-icon="mdi-format-title"
                  required
                  class="mb-4"
                />
                <v-textarea
                  v-model="newEvent.description"
                  label="Description"
                  variant="outlined"
                  prepend-inner-icon="mdi-text"
                  rows="3"
                  class="mb-4"
                />
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="newEvent.date"
                      label="Date"
                      type="date"
                      variant="outlined"
                      prepend-inner-icon="mdi-calendar"
                      required
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="newEvent.time"
                      label="Time"
                      type="time"
                      variant="outlined"
                      prepend-inner-icon="mdi-clock"
                      required
                    />
                  </v-col>
                </v-row>
                <v-select
                  v-model="newEvent.type"
                  :items="eventCategories.map(cat => ({ value: cat.name, title: cat.label }))"
                  label="Event Type"
                  variant="outlined"
                  prepend-inner-icon="mdi-tag"
                  item-title="title"
                  item-value="value"
                  class="mt-4"
                />
              </v-form>
            </v-card-text>
            <v-card-actions class="pa-6 pt-0">
              <v-spacer />
              <v-btn @click="eventDialog = false" variant="outlined">
                Cancel
              </v-btn>
              <v-btn color="primary" @click="createEvent" variant="flat">
                <v-icon start>mdi-plus</v-icon>
                Create Event
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Enhanced Booking Details Dialog -->
        <v-dialog v-model="bookingDialog" max-width="600" class="modern-dialog">
          <v-card v-if="selectedBooking" class="dialog-card">
            <div class="dialog-header">
              <v-chip :color="getEventColor(selectedBooking.type)" variant="flat" class="me-3">
                {{ selectedBooking.type }}
              </v-chip>
              <div class="dialog-title">
                <h3>{{ formatBookingDetails(selectedBooking).title }}</h3>
                <p>Review booking details and take action</p>
              </div>
            </div>
            <v-card-text class="pa-6">
              <div class="booking-details-list">
                <div
                  v-for="detail in formatBookingDetails(selectedBooking).details"
                  :key="detail.label"
                  class="detail-row"
                >
                  <div class="detail-label">{{ detail.label }}:</div>
                  <div class="detail-value">{{ detail.value }}</div>
                </div>
              </div>
            </v-card-text>
            <v-card-actions class="pa-6 pt-0">
              <v-spacer />
              <v-btn @click="bookingDialog = false" variant="outlined">
                Close
              </v-btn>
              <v-btn color="error" @click="denyBooking(selectedBooking)" variant="outlined">
                <v-icon start>mdi-close</v-icon>
                Deny
              </v-btn>
              <v-btn color="success" @click="approveBooking(selectedBooking)" variant="flat">
                <v-icon start>mdi-check</v-icon>
                Approve
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </AdminHeader>
</template>

<style scoped>
.dashboard-background {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.dashboard-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="80" cy="80" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="70" r="1" fill="white" opacity="0.1"/><circle cx="70" cy="30" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

/* Header Section */
.header-section {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-text {
  flex: 1;
}

.title-wrapper {
  position: relative;
  margin-bottom: 0.5rem;
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(45deg, #ffffff, #f8f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.1;
}

.title-accent {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  border-radius: 2px;
  margin-top: 0.5rem;
}

.subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0 1rem 0;
  font-weight: 400;
}

.header-stats {
  display: flex;
  gap: 1.5rem;
}

.quick-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.create-event-btn {
  background: linear-gradient(45deg, #4CAF50, #45a049) !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.create-event-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.modern-toggle {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toggle-btn {
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 500;
  text-transform: none;
  border-radius: 10px !important;
  transition: all 0.3s ease;
}

.toggle-btn.v-btn--active {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--card-accent);
  border-radius: 20px 20px 0 0;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.primary-card {
  --card-accent: linear-gradient(90deg, #2196F3, #1976D2);
}

.orange-card {
  --card-accent: linear-gradient(90deg, #FF9800, #F57C00);
}

.green-card {
  --card-accent: linear-gradient(90deg, #4CAF50, #388E3C);
}

.purple-card {
  --card-accent: linear-gradient(90deg, #9C27B0, #7B1FA2);
}

.stat-icon-wrapper {
  position: relative;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.2));
  color: #1976D2;
}

.orange-card .stat-icon {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.2));
  color: #F57C00;
}

.green-card .stat-icon {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.2));
  color: #388E3C;
}

.purple-card .stat-icon {
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.2));
  color: #7B1FA2;
}

.stat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(255, 152, 0, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 1rem;
  color: #666;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #888;
}

.stat-trend.urgent {
  color: #F57C00;
}

/* Content Area */
.content-area {
  margin-top: 2rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
  gap: 1.5rem;
  grid-template-areas:
    "calendar events"
    "bookings bookings";
}

.calendar-section {
  grid-area: calendar;
}

.events-section {
  grid-area: events;
}

.bookings-section {
  grid-area: bookings;
}

/* Modern Cards */
.modern-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-radius: 20px !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease;
  overflow: hidden;
}

.modern-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

.header-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.header-info p {
  font-size: 0.875rem;
  color: #666;
  margin: 0.25rem 0 0 0;
}

/* Calendar Styling */
.modern-calendar {
  border-radius: 16px !important;
  background: transparent !important;
}

/* Events Styling */
.events-content {
  padding: 0 1.5rem 1.5rem !important;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  margin-bottom: 1rem;
}

.empty-state h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  font-size: 0.875rem;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.event-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
}

.event-time {
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
  min-width: 60px;
}

.event-details {
  flex: 1;
}

.event-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-date {
  font-size: 0.75rem;
  color: #888;
}

/* Bookings Styling */
.bookings-content {
  padding: 0 1.5rem 1.5rem !important;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.booking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.booking-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.booking-info {
  flex: 1;
}

.booking-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.booking-datetime {
  font-size: 0.875rem;
  color: #666;
}

/* Events Sidebar */
.events-sidebar h4 {
  font-weight: 700;
  color: #333;
}

/* Modern Table */
.modern-table {
  border-radius: 16px !important;
  background: transparent !important;
}

.booking-details .detail-title {
  font-weight: 600;
  color: #333;
}

.booking-date,
.booking-time {
  font-weight: 500;
  color: #555;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Dialog Styling */
.modern-dialog .dialog-card {
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px);
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

.dialog-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-title h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.dialog-title p {
  font-size: 0.875rem;
  color: #666;
  margin: 0.25rem 0 0 0;
}

.event-form .v-field {
  border-radius: 12px !important;
}

.booking-details-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.detail-label {
  font-weight: 600;
  color: #555;
}

.detail-value {
  color: #333;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-actions {
    align-items: flex-start;
    width: 100%;
  }

  .overview-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "calendar"
      "events"
      "bookings";
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }

  .header-stats {
    flex-direction: column;
    gap: 0.75rem;
  }

  .view-toggles {
    width: 100%;
  }

  .modern-toggle {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Animation Classes */
.stat-card {
  animation: slideInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(30px);
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-card {
  animation: fadeIn 0.8s ease forwards;
  opacity: 0;
}

.calendar-card { animation-delay: 0.2s; }
.events-card { animation-delay: 0.4s; }
.bookings-card { animation-delay: 0.6s; }

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
<style></style>
