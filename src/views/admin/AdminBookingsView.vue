<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import AdminHeader from '@/components/layout/AdminHeader.vue'
import { useAuthUserStore } from '@/stores/authUser.js'

const authStore = useAuthUserStore()

const loading = ref(true)
const currentView = ref('all')
const selectedBooking = ref(null)
const bookingDialog = ref(false)
const bookingActionLoading = ref(false)

// Booking data
const weddingBookings = ref([])
const baptismBookings = ref([])
const funeralBookings = ref([])
const thanksgivingBookings = ref([])
const announcements = ref([])

// Filters and search
const searchQuery = ref('')
const statusFilter = ref('all')
const dateFilter = ref('')

// Load all bookings
const loadBookings = async () => {
  loading.value = true
  try {
    const [weddings, baptisms, funerals, thanksgivings, events] = await Promise.all([
      supabase.from('wedding_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('baptism_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('funeral_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('thanksgiving_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
    ])

    weddingBookings.value = weddings.data?.map((booking) => ({ ...booking, type: 'wedding' })) || []
    baptismBookings.value = baptisms.data?.map((booking) => ({ ...booking, type: 'baptism' })) || []
    funeralBookings.value = funerals.data?.map((booking) => ({ ...booking, type: 'funeral' })) || []
    thanksgivingBookings.value =
      thanksgivings.data?.map((booking) => ({ ...booking, type: 'thanksgiving' })) || []
    announcements.value =
      events.data?.map((event) => ({ ...event, type: event.type || 'announcement' })) || []
  } catch (error) {
    console.error('Error loading bookings:', error)
  } finally {
    loading.value = false
  }
}

// Combined bookings list
const allBookings = computed(() => {
  return [
    ...weddingBookings.value,
    ...baptismBookings.value,
    ...funeralBookings.value,
    ...thanksgivingBookings.value,
  ]
})

// Filtered bookings based on current view
const filteredBookings = computed(() => {
  let bookings = []

  switch (currentView.value) {
    case 'wedding':
      bookings = weddingBookings.value
      break
    case 'baptism':
      bookings = baptismBookings.value
      break
    case 'funeral':
      bookings = funeralBookings.value
      break
    case 'thanksgiving':
      bookings = thanksgivingBookings.value
      break
    case 'announcements':
      bookings = announcements.value
      break
    default:
      bookings = allBookings.value
  }

  // Apply search filter
  if (searchQuery.value) {
    bookings = bookings.filter((booking) => {
      const searchTerm = searchQuery.value.toLowerCase()
      const details = authStore.formatBookingDetails(booking)
      return (
        details.title.toLowerCase().includes(searchTerm) ||
        details.subtitle.toLowerCase().includes(searchTerm)
      )
    })
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    bookings = bookings.filter((booking) => {
      const isApproved = booking.is_approved || booking.is_approved
      return statusFilter.value === 'approved' ? isApproved : !isApproved
    })
  }

  // Apply date filter
  if (dateFilter.value) {
    bookings = bookings.filter((booking) => {
      const bookingDate = getBookingDate(booking)
      return bookingDate === dateFilter.value
    })
  }

  return bookings
})

const getBookingDate = (booking) => {
  switch (booking.type) {
    case 'wedding':
      return booking.wedding_date
    case 'baptism':
      return booking.baptism_date
    case 'funeral':
      return booking.funeral_date
    case 'thanksgiving':
      return booking.thanksgiving_date
    case 'announcement':
      return booking.date
    default:
      return null
  }
}

const getBookingTime = (booking) => {
  switch (booking.type) {
    case 'wedding':
      return '10:00 AM'
    case 'baptism':
      return '2:00 PM'
    case 'funeral':
      return booking.funeral_time || '9:00 AM'
    case 'thanksgiving':
      return '4:00 PM'
    case 'announcement':
      return booking.time
    default:
      return 'TBD'
  }
}

const openBookingDetails = (booking) => {
  selectedBooking.value = booking
  bookingDialog.value = true
}

const closeBookingDialog = () => {
  bookingDialog.value = false
  selectedBooking.value = null
}

const handleApproveBooking = async () => {
  if (!selectedBooking.value) return

  bookingActionLoading.value = true
  try {
    const result = await authStore.approveBooking(selectedBooking.value)
    if (result.success) {
      await loadBookings()
      closeBookingDialog()
    } else if (result.conflicts) {
      // Handle conflicts - you can add a conflict dialog here
      console.log('Conflicts detected:', result.conflicts)
    }
  } catch (error) {
    console.error('Error approving booking:', error)
  } finally {
    bookingActionLoading.value = false
  }
}

const handleDenyBooking = async () => {
  if (!selectedBooking.value) return

  bookingActionLoading.value = true
  try {
    const result = await authStore.denyBooking(selectedBooking.value)
    if (result.success) {
      await loadBookings()
      closeBookingDialog()
    }
  } catch (error) {
    console.error('Error denying booking:', error)
  } finally {
    bookingActionLoading.value = false
  }
}

const getStatusColor = (booking) => {
  const isApproved = booking.is_approved || booking.is_approved
  return isApproved ? 'success' : 'warning'
}

const getStatusText = (booking) => {
  const isApproved = booking.is_approved || booking.is_approved
  return isApproved ? 'Approved' : 'Pending'
}

onMounted(async () => {
  await loadBookings()
})
</script>

<template>
  <AdminHeader>
    <template #content>
      <div class="animated-bg"></div>

      <v-container fluid class="pa-4 pa-md-8">
        <!-- Header Section -->
        <div class="glass-card pa-4 pa-md-6 mb-6">
          <div
            class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center ga-4"
          >
            <div>
              <h1 class="header-gradient mb-2 text-h4 text-md-h3">Booking Management</h1>
              <p class="text-subtitle-1 text-grey">Manage all parish bookings and events</p>
            </div>

            <div class="d-flex ga-2 flex-wrap">
              <v-btn color="primary" variant="outlined" @click="loadBookings" :loading="loading">
                <v-icon class="me-2">mdi-refresh</v-icon>
                Refresh
              </v-btn>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="d-flex ga-2 mt-6 overflow-x-auto">
            <v-btn
              :class="['nav-tab', currentView === 'all' ? 'active' : '']"
              @click="currentView = 'all'"
              variant="text"
            >
              <v-icon class="me-2">mdi-view-list</v-icon>
              All Bookings
            </v-btn>
            <v-btn
              :class="['nav-tab', currentView === 'wedding' ? 'active' : '']"
              @click="currentView = 'wedding'"
              variant="text"
            >
              <v-icon class="me-2">mdi-heart</v-icon>
              Weddings
            </v-btn>
            <v-btn
              :class="['nav-tab', currentView === 'baptism' ? 'active' : '']"
              @click="currentView = 'baptism'"
              variant="text"
            >
              <v-icon class="me-2">mdi-water</v-icon>
              Baptisms
            </v-btn>
            <v-btn
              :class="['nav-tab', currentView === 'funeral' ? 'active' : '']"
              @click="currentView = 'funeral'"
              variant="text"
            >
              <v-icon class="me-2">mdi-cross</v-icon>
              Funerals
            </v-btn>
            <v-btn
              :class="['nav-tab', currentView === 'thanksgiving' ? 'active' : '']"
              @click="currentView = 'thanksgiving'"
              variant="text"
            >
              <v-icon class="me-2">mdi-hands-pray</v-icon>
              Thanksgiving
            </v-btn>
            <v-btn
              :class="['nav-tab', currentView === 'announcements' ? 'active' : '']"
              @click="currentView = 'announcements'"
              variant="text"
            >
              <v-icon class="me-2">mdi-bullhorn</v-icon>
              Announcements
            </v-btn>
          </div>
        </div>

        <!-- Filters Section -->
        <div class="glass-card pa-4 mb-6">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchQuery"
                label="Search bookings..."
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="statusFilter"
                :items="[
                  { title: 'All Status', value: 'all' },
                  { title: 'Pending', value: 'pending' },
                  { title: 'Approved', value: 'approved' },
                ]"
                label="Filter by Status"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="dateFilter"
                label="Filter by Date"
                type="date"
                variant="outlined"
                clearable
              />
            </v-col>
          </v-row>
        </div>

        <!-- Bookings List -->
        <div class="glass-card">
          <v-card-title class="d-flex align-center">
            <v-icon class="me-2">mdi-clipboard-list</v-icon>
            {{
              currentView === 'all'
                ? 'All Bookings'
                : currentView.charAt(0).toUpperCase() + currentView.slice(1)
            }}
            <v-spacer />
            <v-chip color="primary" variant="outlined">
              {{ filteredBookings.length }} items
            </v-chip>
          </v-card-title>

          <v-card-text class="pa-0">
            <div v-if="loading" class="text-center py-8">
              <v-progress-circular indeterminate color="primary" size="64" />
              <p class="mt-4">Loading bookings...</p>
            </div>

            <div v-else-if="filteredBookings.length === 0" class="text-center py-8">
              <v-icon size="64" color="grey-lighten-2">mdi-calendar-blank</v-icon>
              <p class="mt-3 text-grey">No bookings found</p>
            </div>

            <div v-else>
              <v-list>
                <v-list-item
                  v-for="(booking, index) in filteredBookings"
                  :key="index"
                  @click="openBookingDetails(booking)"
                  class="booking-item"
                  :style="{ borderLeftColor: authStore.getEventColor(booking.type) }"
                >
                  <template #prepend>
                    <v-avatar :color="authStore.getEventColor(booking.type)" size="40">
                      <v-icon color="white">
                        {{
                          booking.type === 'wedding'
                            ? 'mdi-heart'
                            : booking.type === 'baptism'
                              ? 'mdi-water'
                              : booking.type === 'funeral'
                                ? 'mdi-cross'
                                : booking.type === 'thanksgiving'
                                  ? 'mdi-hands-pray'
                                  : 'mdi-bullhorn'
                        }}
                      </v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-semibold">
                    {{ authStore.formatBookingDetails(booking).title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ authStore.formatBookingDetails(booking).subtitle }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="text-right">
                      <div class="text-body-2 font-weight-medium">
                        {{ authStore.formatBookingDetails(booking).date }}
                      </div>
                      <div class="text-caption text-grey">
                        {{ getBookingTime(booking) }}
                      </div>
                      <v-chip
                        :color="getStatusColor(booking)"
                        size="small"
                        variant="tonal"
                        class="mt-1"
                      >
                        {{ getStatusText(booking) }}
                      </v-chip>
                    </div>
                    <v-icon class="ms-2">mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>

                <v-divider v-if="index < filteredBookings.length - 1" :key="`divider-${index}`" />
              </v-list>
            </div>
          </v-card-text>
        </div>
      </v-container>

      <!-- Booking Details Dialog -->
      <v-dialog v-model="bookingDialog" max-width="800" persistent>
        <v-card v-if="selectedBooking" class="glass-card">
          <v-card-title class="d-flex align-center justify-space-between pa-6">
            <div class="d-flex align-center">
              <v-icon class="me-3" :color="authStore.getEventColor(selectedBooking.type)" size="32">
                {{
                  selectedBooking.type === 'wedding'
                    ? 'mdi-heart'
                    : selectedBooking.type === 'baptism'
                      ? 'mdi-water'
                      : selectedBooking.type === 'funeral'
                        ? 'mdi-cross'
                        : selectedBooking.type === 'thanksgiving'
                          ? 'mdi-hands-pray'
                          : 'mdi-bullhorn'
                }}
              </v-icon>
              <div>
                <h2 class="text-h5 mb-1">
                  {{ authStore.formatBookingDetails(selectedBooking).title }}
                </h2>
                <v-chip
                  :color="authStore.getEventColor(selectedBooking.type)"
                  size="small"
                  class="text-capitalize"
                >
                  {{ selectedBooking.type }}
                </v-chip>
              </div>
            </div>
            <v-btn icon="mdi-close" variant="text" @click="closeBookingDialog" />
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-6">
            <v-row>
              <!-- Basic Information -->
              <v-col cols="12" md="6">
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon class="me-2" color="primary">mdi-information</v-icon>
                  Basic Information
                </h3>

                <div class="mb-4">
                  <div class="text-caption text-grey-darken-1 mb-1">Event Date & Time</div>
                  <div class="text-body-1 font-weight-medium">
                    <v-icon class="me-2" size="18">mdi-calendar</v-icon>
                    {{ authStore.formatBookingDetails(selectedBooking).date }}
                    <v-icon class="me-2 ms-4" size="18">mdi-clock</v-icon>
                    {{ getBookingTime(selectedBooking) }}
                  </div>
                </div>

                <div class="mb-4">
                  <div class="text-caption text-grey-darken-1 mb-1">Created On</div>
                  <div class="text-body-2">
                    {{ new Date(selectedBooking.created_at).toLocaleDateString() }}
                  </div>
                </div>

                <div class="mb-4">
                  <div class="text-caption text-grey-darken-1 mb-1">Status</div>
                  <v-chip :color="getStatusColor(selectedBooking)" size="small" variant="tonal">
                    {{ getStatusText(selectedBooking) }}
                  </v-chip>
                </div>
              </v-col>

              <!-- Detailed Information -->
              <v-col cols="12" md="6">
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon class="me-2" color="secondary">mdi-account-details</v-icon>
                  Details
                </h3>

                <!-- Wedding Details -->
                <div v-if="selectedBooking.type === 'wedding'">
                  <div class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Bride</div>
                    <div class="text-body-1">
                      {{ selectedBooking.bride_firstname }} {{ selectedBooking.bride_lastname }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Groom</div>
                    <div class="text-body-1">
                      {{ selectedBooking.groom_firstname }} {{ selectedBooking.groom_lastname }}
                    </div>
                  </div>
                  <div v-if="selectedBooking.title" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Event Title</div>
                    <div class="text-body-1">{{ selectedBooking.title }}</div>
                  </div>
                  <div v-if="selectedBooking.comments" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Comments</div>
                    <div class="text-body-2">{{ selectedBooking.comments }}</div>
                  </div>
                </div>

                <!-- Baptism Details -->
                <div v-if="selectedBooking.type === 'baptism'">
                  <div class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Child</div>
                    <div class="text-body-1">
                      {{ selectedBooking.child_firstname }} {{ selectedBooking.child_lastname }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Date of Birth</div>
                    <div class="text-body-2">
                      {{ new Date(selectedBooking.child_dob).toLocaleDateString() }}
                    </div>
                  </div>
                  <div v-if="selectedBooking.parent_father_firstname" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Father</div>
                    <div class="text-body-2">
                      {{ selectedBooking.parent_father_firstname }}
                      {{ selectedBooking.parent_father_lastname }}
                    </div>
                  </div>
                  <div v-if="selectedBooking.parent_mother_firstname" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Mother</div>
                    <div class="text-body-2">
                      {{ selectedBooking.parent_mother_firstname }}
                      {{ selectedBooking.parent_mother_lastname }}
                    </div>
                  </div>
                  <div v-if="selectedBooking.godparent_firstname" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Godparent</div>
                    <div class="text-body-2">
                      {{ selectedBooking.godparent_firstname }}
                      {{ selectedBooking.godparent_lastname }}
                    </div>
                  </div>
                </div>

                <!-- Funeral Details -->
                <div v-if="selectedBooking.type === 'funeral'">
                  <div class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Deceased</div>
                    <div class="text-body-1">
                      {{ selectedBooking.deceased_firstname }}
                      {{ selectedBooking.deceased_lastname }}
                    </div>
                  </div>
                  <div v-if="selectedBooking.deceased_dob" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Date of Birth</div>
                    <div class="text-body-2">
                      {{ new Date(selectedBooking.deceased_dob).toLocaleDateString() }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Date of Death</div>
                    <div class="text-body-2">
                      {{ new Date(selectedBooking.deceased_dod).toLocaleDateString() }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Contact Person</div>
                    <div class="text-body-1">
                      {{ selectedBooking.contact_firstname }} {{ selectedBooking.contact_lastname }}
                    </div>
                  </div>
                  <div v-if="selectedBooking.contact_phone" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Phone</div>
                    <div class="text-body-2">{{ selectedBooking.contact_phone }}</div>
                  </div>
                  <div v-if="selectedBooking.contact_email" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Email</div>
                    <div class="text-body-2">{{ selectedBooking.contact_email }}</div>
                  </div>
                </div>

                <!-- Thanksgiving Details -->
                <div v-if="selectedBooking.type === 'thanksgiving'">
                  <div class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Participant</div>
                    <div class="text-body-1">
                      {{ selectedBooking.participant_firstname }}
                      {{ selectedBooking.participant_lastname }}
                    </div>
                  </div>
                  <div v-if="selectedBooking.type_of_thanksgiving" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Type of Thanksgiving</div>
                    <div class="text-body-2 text-capitalize">
                      {{ selectedBooking.type_of_thanksgiving }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Reason</div>
                    <div class="text-body-2">{{ selectedBooking.reason_for_thanksgiving }}</div>
                  </div>
                </div>

                <!-- Announcement Details -->
                <div
                  v-if="
                    selectedBooking.type === 'announcement' ||
                    selectedBooking.type === 'mass' ||
                    selectedBooking.type === 'event' ||
                    selectedBooking.type === 'celebration'
                  "
                >
                  <div v-if="selectedBooking.description" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Description</div>
                    <div class="text-body-2">{{ selectedBooking.description }}</div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-6">
            <v-spacer />
            <v-btn variant="outlined" @click="closeBookingDialog" class="me-3"> Close </v-btn>
            <template
              v-if="
                selectedBooking.type !== 'announcement' &&
                selectedBooking.type !== 'mass' &&
                selectedBooking.type !== 'event' &&
                selectedBooking.type !== 'celebration'
              "
            >
              <v-btn
                color="error"
                variant="outlined"
                @click="handleDenyBooking"
                class="me-3"
                :disabled="bookingActionLoading"
                v-if="!selectedBooking.is_approved && !selectedBooking.is_approved"
              >
                <v-icon class="me-1">mdi-close</v-icon>
                Deny
              </v-btn>
              <v-btn
                color="success"
                @click="handleApproveBooking"
                :loading="bookingActionLoading"
                v-if="!selectedBooking.is_approved && !selectedBooking.is_approved"
              >
                <v-icon class="me-1">mdi-check</v-icon>
                Approve
              </v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </AdminHeader>
</template>

<style scoped>
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  z-index: -2;
  opacity: 0.05;
}

.glass-card {
  background: rgba(var(--v-theme-surface), 0.85) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
}

.header-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-tab {
  border-radius: 12px;
  transition: all 0.3s ease;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin: 0 4px;
}

.nav-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.booking-item {
  border-left: 4px solid;
  transition: all 0.3s ease;
  cursor: pointer;
}

.booking-item:hover {
  background: rgba(var(--v-theme-primary), 0.05);
  transform: translateX(4px);
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
