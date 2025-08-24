<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import AdminHeader from '@/components/layout/AdminHeader.vue'
import { useAuthUserStore } from '@/stores/authUser.js'

const authUser = useAuthUserStore()

const loading = ref(true)
const currentView = ref('all')
const selectedBooking = ref(null)
const bookingDialog = ref(false)
const bookingActionLoading = ref(false)
const bookingConflicts = ref([])
const conflictDialog = ref(false)
const pendingApprovalBooking = ref(null)
const denialDialog = ref(false)
const denialComment = ref('')
const imageViewerDialog = ref(false)
const selectedImages = ref([])
const currentImageIndex = ref(0)

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

// Use store functions
const formatBookingDetails = authUser.formatBookingDetails
const getEventColor = authUser.getEventColor

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

    weddingBookings.value =
      weddings.data?.map((booking) => ({
        ...booking,
        type: 'wedding',
        table: 'wedding_bookings',
        status: booking.is_approved ? 'approved' : 'pending',
      })) || []

    baptismBookings.value =
      baptisms.data?.map((booking) => ({
        ...booking,
        type: 'baptism',
        table: 'baptism_bookings',
        status: booking.is_approved ? 'approved' : 'pending',
      })) || []

    funeralBookings.value =
      funerals.data?.map((booking) => ({
        ...booking,
        type: 'funeral',
        table: 'funeral_bookings',
        status: booking.is_approved ? 'approved' : 'pending',
      })) || []

    thanksgivingBookings.value =
      thanksgivings.data?.map((booking) => ({
        ...booking,
        type: 'thanksgiving',
        table: 'thanksgiving_bookings',
        status: booking.is_approved ? 'approved' : 'pending',
      })) || []

    announcements.value =
      events.data?.map((event) => ({
        ...event,
        type: event.type || 'announcement',
        status: 'confirmed',
      })) || []
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
      const details = formatBookingDetails(booking)
      return (
        details.title.toLowerCase().includes(searchTerm) ||
        details.subtitle.toLowerCase().includes(searchTerm)
      )
    })
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    bookings = bookings.filter((booking) => {
      const isApproved = booking.is_approved || booking.status === 'approved'
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

const closeBookingDialog = () => {
  bookingDialog.value = false
  selectedBooking.value = null
  bookingConflicts.value = []
}

const openBookingDetails = async (booking) => {
  selectedBooking.value = booking
  bookingDialog.value = true

  // Check for conflicts when opening booking details
  let bookingDate, bookingStartTime, bookingEndTime

  switch (booking.type) {
    case 'wedding':
      bookingDate = booking.wedding_date
      bookingStartTime = booking.starting_time || '10:00'
      bookingEndTime = booking.ending_time || '12:00'
      break
    case 'baptism':
      bookingDate = booking.baptism_date
      bookingStartTime = booking.starting_time || '14:00'
      bookingEndTime = booking.ending_time || '15:00'
      break
    case 'funeral':
      bookingDate = booking.funeral_date
      bookingStartTime = booking.starting_time || booking.funeral_time || '09:00'
      bookingEndTime = booking.ending_time || '10:00'
      break
    case 'thanksgiving':
      bookingDate = booking.thanksgiving_date
      bookingStartTime = booking.starting_time || '16:00'
      bookingEndTime = booking.ending_time || '17:00'
      break
  }

  if (bookingDate && bookingStartTime && bookingEndTime) {
    bookingConflicts.value = await authUser.checkConflicts(
      bookingDate,
      bookingStartTime,
      bookingEndTime,
    )
  }
}

const cancelConflictDialog = () => {
  conflictDialog.value = false
  pendingApprovalBooking.value = null
  bookingConflicts.value = []
}

const handleApproveBooking = async () => {
  if (!selectedBooking.value) return

  bookingActionLoading.value = true

  try {
    const result = await authUser.approveBooking(selectedBooking.value)

    if (result.success) {
      authUser.addNotification({
        message: `${selectedBooking.value.type} booking approved successfully`,
        type: 'success',
      })
      await loadBookings()
      closeBookingDialog()
    } else if (result.conflicts) {
      bookingConflicts.value = result.conflicts
      pendingApprovalBooking.value = selectedBooking.value
      conflictDialog.value = true
      closeBookingDialog()
    } else {
      console.error('Error approving booking:', result.error)
      authUser.addNotification({
        message: `Failed to approve booking: ${result.error?.message || 'Unknown error'}`,
        type: 'error',
      })
    }
  } catch (error) {
    console.error('Error in approval process:', error)
    authUser.addNotification({
      message: 'An error occurred while approving the booking',
      type: 'error',
    })
  } finally {
    bookingActionLoading.value = false
  }
}

const handleDenyBooking = async () => {
  if (!selectedBooking.value) return

  // Open denial dialog to get comment
  denialDialog.value = true
}

const confirmDenyBooking = async () => {
  if (!selectedBooking.value || !denialComment.value.trim()) return

  bookingActionLoading.value = true

  try {
    const result = await authUser.denyBookingWithComment(
      selectedBooking.value,
      denialComment.value.trim(),
    )

    if (result.success) {
      authUser.addNotification({
        message: `${selectedBooking.value.type} booking denied`,
        type: 'info',
      })
      denialDialog.value = false
      denialComment.value = ''
      await loadBookings()
      closeBookingDialog()
    } else {
      console.error('Error denying booking:', result.error)
      authUser.addNotification({
        message: `Failed to deny booking: ${result.error?.message || 'Unknown error'}`,
        type: 'error',
      })
    }
  } catch (error) {
    console.error('Error in denial process:', error)
    authUser.addNotification({
      message: 'An error occurred while denying the booking',
      type: 'error',
    })
  } finally {
    bookingActionLoading.value = false
  }
}

const cancelDenialDialog = () => {
  denialDialog.value = false
  denialComment.value = ''
}

const viewImages = (booking) => {
  const images = authUser.getBookingAttachedImages(booking)
  if (images.length > 0) {
    selectedImages.value = images
    currentImageIndex.value = 0
    imageViewerDialog.value = true
  }
}

const closeImageViewer = () => {
  imageViewerDialog.value = false
  selectedImages.value = []
  currentImageIndex.value = 0
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (currentImageIndex.value < selectedImages.value.length - 1) {
    currentImageIndex.value++
  }
}

const forceApproveBooking = async () => {
  if (!pendingApprovalBooking.value) return

  bookingActionLoading.value = true

  try {
    const result = await authUser.forceApproveBooking(pendingApprovalBooking.value)

    if (result.success) {
      authUser.addNotification({
        message: `${pendingApprovalBooking.value.type} booking approved despite conflicts`,
        type: 'warning',
      })
      await loadBookings()
      conflictDialog.value = false
      pendingApprovalBooking.value = null
      bookingConflicts.value = []
    } else {
      console.error('Error force approving booking:', result.error)
      authUser.addNotification({
        message: 'Failed to force approve booking',
        type: 'error',
      })
    }
  } catch (error) {
    console.error('Error force approving:', error)
    authUser.addNotification({
      message: 'An error occurred while force approving the booking',
      type: 'error',
    })
  } finally {
    bookingActionLoading.value = false
  }
}

const getStatusColor = (booking) => {
  const isApproved = booking.is_approved || booking.status === 'approved'
  return isApproved ? 'success' : 'warning'
}

const getStatusText = (booking) => {
  const isApproved = booking.is_approved || booking.status === 'approved'
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
                  :style="{ borderLeftColor: getEventColor(booking.type) }"
                >
                  <template #prepend>
                    <v-avatar :color="getEventColor(booking.type)" size="40">
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
                    {{ formatBookingDetails(booking).title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ formatBookingDetails(booking).subtitle }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="text-right">
                      <div class="text-body-2 font-weight-medium">
                        {{ formatBookingDetails(booking).date }}
                      </div>
                      <div class="text-caption text-grey">
                        {{ formatBookingDetails(booking).starting_time }} -
                        {{ formatBookingDetails(booking).ending_time }}
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

      <!-- Use the same Booking Details Dialog from AdminDashboard -->
      <v-dialog v-model="bookingDialog" max-width="800" persistent>
        <v-card v-if="selectedBooking" class="glass-card">
          <v-card-title class="d-flex align-center justify-space-between pa-6">
            <div class="d-flex align-center">
              <v-icon class="me-3" :color="getEventColor(selectedBooking.type)" size="32">
                {{
                  selectedBooking.type === 'wedding'
                    ? 'mdi-ring'
                    : selectedBooking.type === 'baptism'
                      ? 'mdi-water'
                      : selectedBooking.type === 'funeral'
                        ? 'mdi-cross'
                        : 'mdi-hands-pray'
                }}
              </v-icon>
              <div>
                <h2 class="text-h5 mb-1">{{ formatBookingDetails(selectedBooking).title }}</h2>
                <v-chip
                  :color="getEventColor(selectedBooking.type)"
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
                    {{ formatBookingDetails(selectedBooking).date }}
                    <v-icon class="me-2 ms-4" size="18">mdi-clock</v-icon>
                    {{ formatBookingDetails(selectedBooking).starting_time }} -
                    {{ formatBookingDetails(selectedBooking).ending_time }}
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

                <!-- Denial Reason (if booking was denied) -->
                <div v-if="selectedBooking.is_denied && selectedBooking.comment" class="mb-4">
                  <div class="text-caption text-grey-darken-1 mb-1">Denial Reason</div>
                  <v-alert
                    type="error"
                    variant="tonal"
                    density="compact"
                    :text="selectedBooking.comment"
                  />
                </div>
              </v-col>

              <!-- Type-specific Details (same as AdminDashboard) -->
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
                  <div v-if="selectedBooking.comment && !selectedBooking.is_denied" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Comments</div>
                    <div class="text-body-2">{{ selectedBooking.comment }}</div>
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
                  <div v-if="selectedBooking.additional_notes" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Additional Notes</div>
                    <div class="text-body-2">{{ selectedBooking.additional_notes }}</div>
                  </div>
                  <div v-if="selectedBooking.comment && !selectedBooking.is_denied" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Comments</div>
                    <div class="text-body-2">{{ selectedBooking.comment }}</div>
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
                  <div v-if="selectedBooking.relationship_to_deceased" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Relationship</div>
                    <div class="text-body-2">{{ selectedBooking.relationship_to_deceased }}</div>
                  </div>
                  <div v-if="selectedBooking.contact_phone" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Phone</div>
                    <div class="text-body-2">{{ selectedBooking.contact_phone }}</div>
                  </div>
                  <div v-if="selectedBooking.contact_email" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Email</div>
                    <div class="text-body-2">{{ selectedBooking.contact_email }}</div>
                  </div>
                  <div v-if="selectedBooking.comment && !selectedBooking.is_denied" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Comments</div>
                    <div class="text-body-2">{{ selectedBooking.comment }}</div>
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
                  <div v-if="selectedBooking.family_members_count" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Family Members Count</div>
                    <div class="text-body-2">{{ selectedBooking.family_members_count }}</div>
                  </div>
                  <div v-if="selectedBooking.comment && !selectedBooking.is_denied" class="mb-3">
                    <div class="text-caption text-grey-darken-1 mb-1">Comments</div>
                    <div class="text-body-2">{{ selectedBooking.comment }}</div>
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

            <!-- Conflict Warning -->
            <v-alert
              v-if="bookingConflicts && bookingConflicts.length > 0"
              type="warning"
              variant="tonal"
              class="mt-4"
              prominent
            >
              <v-alert-title class="d-flex align-center">
                <v-icon class="me-2">mdi-alert</v-icon>
                Schedule Conflict Detected!
              </v-alert-title>
              <div class="mt-2">
                <p class="mb-2">This booking conflicts with:</p>
                <div
                  v-for="conflict in bookingConflicts"
                  :key="conflict.id"
                  class="d-flex align-center mb-1"
                >
                  <v-chip :color="getEventColor(conflict.type)" size="small" class="me-2">
                    {{ conflict.type }}
                  </v-chip>
                  <span class="text-body-2"
                    >{{ conflict.name }} - {{ conflict.date }} at {{ conflict.starting_time }} -
                    {{ conflict.ending_time }}</span
                  >
                </div>
                <p class="mt-2 text-caption">
                  Please consider rescheduling or contact the conflicting party to resolve this
                  issue.
                </p>
              </div>
            </v-alert>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-6">
            <v-btn
              v-if="authUser.getBookingAttachedImages(selectedBooking).length > 0"
              color="info"
              variant="outlined"
              @click="viewImages(selectedBooking)"
              class="me-3"
            >
              <v-icon class="me-1">mdi-image-multiple</v-icon>
              View Images ({{ authUser.getBookingAttachedImages(selectedBooking).length }})
            </v-btn>
            <v-spacer />
            <v-btn variant="outlined" @click="closeBookingDialog" class="me-3"> Close </v-btn>
            <template
              v-if="
                selectedBooking.type !== 'announcement' &&
                selectedBooking.type !== 'mass' &&
                selectedBooking.type !== 'event' &&
                selectedBooking.type !== 'celebration' &&
                !selectedBooking.is_approved
              "
            >
              <v-btn
                color="error"
                variant="outlined"
                @click="handleDenyBooking"
                class="me-3"
                :disabled="bookingActionLoading"
              >
                <v-icon class="me-1">mdi-close</v-icon>
                Deny
              </v-btn>
              <v-btn color="success" @click="handleApproveBooking" :loading="bookingActionLoading">
                <v-icon class="me-1">mdi-check</v-icon>
                Approve
              </v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Conflict Dialog (same as AdminDashboard) -->
      <v-dialog v-model="conflictDialog" max-width="600" persistent>
        <v-card class="glass-card">
          <v-card-title class="d-flex align-center text-warning">
            <v-icon class="me-2" color="warning" size="32">mdi-alert-circle</v-icon>
            Schedule Conflict Detected
          </v-card-title>

          <v-card-text class="pa-6">
            <p class="mb-4">
              The booking you're trying to approve conflicts with existing scheduled events:
            </p>

            <v-list class="mb-4">
              <v-list-item
                v-for="conflict in bookingConflicts"
                :key="conflict.id"
                class="conflict-item pa-3 mb-2"
                :style="{ borderLeft: `4px solid ${getEventColor(conflict.type)}` }"
              >
                <template #prepend>
                  <v-chip :color="getEventColor(conflict.type)" size="small" class="me-3">
                    {{ conflict.type }}
                  </v-chip>
                </template>

                <v-list-item-title class="font-weight-semibold">
                  {{ conflict.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ conflict.date }} at {{ conflict.starting_time }} - {{ conflict.ending_time }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <p class="text-body-2 text-grey-darken-1">
              You can either reschedule one of the events or proceed with approval if you believe
              the conflict can be managed.
            </p>
          </v-card-text>

          <v-card-actions class="pa-6">
            <v-spacer />
            <v-btn variant="outlined" @click="cancelConflictDialog" class="me-3"> Cancel </v-btn>
            <v-btn color="warning" @click="forceApproveBooking" :loading="bookingActionLoading">
              <v-icon class="me-1">mdi-check-bold</v-icon>
              Approve Anyway
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Denial Comment Dialog -->
      <v-dialog v-model="denialDialog" max-width="500" persistent>
        <v-card class="glass-card">
          <v-card-title class="d-flex align-center text-error">
            <v-icon class="me-2" color="error" size="32">mdi-close-circle</v-icon>
            Deny Booking
          </v-card-title>

          <v-card-text class="pa-6">
            <p class="mb-4">
              Please provide a reason for denying this {{ selectedBooking?.type }} booking:
            </p>

            <v-textarea
              v-model="denialComment"
              label="Reason for denial"
              placeholder="Enter the reason why this booking is being denied..."
              rows="4"
              required
              :rules="[(v) => !!v || 'Reason is required']"
              variant="outlined"
            />
          </v-card-text>

          <v-card-actions class="pa-6">
            <v-spacer />
            <v-btn variant="outlined" @click="cancelDenialDialog" class="me-3"> Cancel </v-btn>
            <v-btn
              color="error"
              @click="confirmDenyBooking"
              :loading="bookingActionLoading"
              :disabled="!denialComment.trim()"
            >
              <v-icon class="me-1">mdi-close</v-icon>
              Confirm Denial
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Image Viewer Dialog -->
      <v-dialog v-model="imageViewerDialog" max-width="800">
        <v-card class="glass-card">
          <v-card-title class="d-flex align-center justify-space-between pa-4">
            <div class="d-flex align-center">
              <v-icon class="me-2" color="primary">mdi-image-multiple</v-icon>
              Attached Images ({{ currentImageIndex + 1 }} of {{ selectedImages.length }})
            </div>
            <v-btn icon="mdi-close" variant="text" @click="closeImageViewer" />
          </v-card-title>

          <v-card-text class="pa-0">
            <div class="d-flex justify-center align-center" style="min-height: 400px">
              <v-img
                v-if="selectedImages[currentImageIndex]"
                :src="selectedImages[currentImageIndex]"
                :alt="`Attached image ${currentImageIndex + 1}`"
                contain
                max-height="500"
                class="mx-auto"
              />
            </div>
          </v-card-text>

          <v-card-actions class="pa-4" v-if="selectedImages.length > 1">
            <v-btn @click="previousImage" :disabled="currentImageIndex === 0" variant="outlined">
              <v-icon>mdi-chevron-left</v-icon>
              Previous
            </v-btn>
            <v-spacer />
            <div class="text-center">
              <v-pagination
                v-model="currentImageIndex"
                :length="selectedImages.length"
                :total-visible="3"
                density="compact"
                @update:model-value="(val) => (currentImageIndex = val - 1)"
              />
            </div>
            <v-spacer />
            <v-btn
              @click="nextImage"
              :disabled="currentImageIndex === selectedImages.length - 1"
              variant="outlined"
            >
              Next
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </AdminHeader>
</template>

<style scoped>
.conflict-item {
  background: rgba(var(--v-theme-surface), 0.8);
  border-radius: 8px;
  border-left-width: 4px;
  border-left-style: solid;
}

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
</style>
