
Toggle Sidebar

BLACKBOXAI

New

Share


New Chat

History

Image To App

Agents

BLACKBOX IDE

API Platform

Docs

Partnership

Careers

Log Out
Jun Kyle Gulay
Jun Kyle Gulay
brosgamers307@gmail.com



992 lines

            background: var(--booking-color);
        }
        .booking-card:hover {
            transform: translateX(8px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }
        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        .modal-overlay.active {
            display: flex;
        }
        .modal-content {
            background: white;
            border-radius: 24px;
            padding: 32px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }

<script setup> import { ref, computed, onMounted, onUnmounted } from 'vue' import { supabase } from '@/utils/supabase.js' import AdminHeader from '@/components/layout/AdminHeader.vue' import PreloaderView from '@/components/layout/PreloaderView.vue' // Data refs const notifications = ref([]) const notificationDialog = ref(false) const selectedDate = ref(new Date()) const currentView = ref('overview') const pendingBookings = ref([]) const events = ref([]) const stats = ref({ totalBookings: 0, pendingApprovals: 0, upcomingEvents: 0, totalMembers: 0, }) // Event creation const newEvent = ref({ title: '', description: '', date: '', time: '', type: 'announcement', }) const eventDialog = ref(false) const bookingDialog = ref(false) const selectedBooking = ref(null) // Calendar data const calendarEvents = ref([]) const selectedDateEvents = ref([]) // Event categories (defined in app instead of database) const eventCategories = ref([ { name: 'announcement', label: 'Announcement', color: '#9C27B0', icon: 'mdi-bullhorn' }, { name: 'mass', label: 'Holy Mass', color: '#2196F3', icon: 'mdi-church' }, { name: 'event', label: 'Parish Event', color: '#4CAF50', icon: 'mdi-calendar-star' }, { name: 'celebration', label: 'Celebration', color: '#FF9800', icon: 'mdi-party-popper' }, { name: 'wedding', label: 'Wedding', color: '#E91E63', icon: 'mdi-heart' }, { name: 'baptism', label: 'Baptism', color: '#00BCD4', icon: 'mdi-water' }, { name: 'funeral', label: 'Funeral', color: '#424242', icon: 'mdi-cross' }, { name: 'thanksgiving', label: 'Thanksgiving', color: '#FF5722', icon: 'mdi-hands-pray' }, ]) const subscribeToBookingUpdates = () => { const tables = [ 'wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings', ] const subscriptions = [] tables.forEach((tableName) => { const subscription = supabase .channel(`public:${tableName}`) .on( 'postgres_changes', { event: 'INSERT', schema: 'public', table: tableName, }, (payload) => { const newBooking = payload.new // Add to notifications notifications.value.unshift({ id: Date.now(), message: `New ${tableName.replace('_bookings', '')} booking from ${newBooking.first_name || newBooking.bride_firstname}`, timestamp: new Date(), type: 'booking', data: newBooking, read: false, }) // Refresh dashboard data loadDashboardData() // Show browser notification if permission granted if (Notification.permission === 'granted') { new Notification('New Booking Received', { body: `New ${tableName.replace('_bookings', '')} booking submitted`, icon: '/logo.png', }) } }, ) .subscribe() subscriptions.push(subscription) }) return subscriptions } const requestNotificationPermission = async () => { if ('Notification' in window) { const permission = await Notification.requestPermission() console.log('Notification permission:', permission) } } let subscriptions = [] // Load all data const loadDashboardData = async () => { await Promise.all([loadPendingBookings(), loadEvents(), loadStats(), loadCalendarEvents()]) } const markAsRead = (notificationId) => { const notification = notifications.value.find((n) => n.id === notificationId) if (notification) { notification.read = true } } const unreadCount = computed(() => { return notifications.value.filter((n) => !n.read).length }) // Show notification dialog (using the previously unused variables) const showNotifications = () => { notificationDialog.value = true } // Get unread notifications count for display const getUnreadCount = () => { return unreadCount.value } // Mark notification as read when clicked const handleNotificationClick = (notificationId) => { markAsRead(notificationId) } const loadPendingBookings = async () => { try { // Load from multiple booking tables const tables = [ 'wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings', ] const allBookings = [] for (const table of tables) { const { data, error } = await supabase.from(table).select('*').eq('status', 'pending') if (data && !error) { const bookingsWithType = data.map((booking) => ({ ...booking, type: table.replace('_bookings', ''), table: table, })) allBookings.push(...bookingsWithType) } } pendingBookings.value = allBookings stats.value.pendingApprovals = allBookings.length } catch (error) { console.error('Error loading pending bookings:', error) } } const loadEvents = async () => { try { const { data, error } = await supabase .from('parish_events') .select('*') .order('date', { ascending: true }) if (data && !error) { events.value = data stats.value.upcomingEvents = data.filter((e) => new Date(e.date) >= new Date()).length } } catch (error) { console.error('Error loading events:', error) } } const loadStats = async () => { try { const tables = [ 'wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings', ] let totalBookings = 0 for (const table of tables) { const { count, error } = await supabase.from(table).select('*', { count: 'exact' }) if (!error) { totalBookings += count || 0 } } stats.value.totalBookings = totalBookings stats.value.totalMembers = Math.floor(totalBookings * 1.5) // Estimated } catch (error) { console.error('Error loading stats:', error) } } const loadCalendarEvents = async () => { try { const tables = [ 'wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings', ] const allEvents = [] for (const table of tables) { const { data, error } = await supabase.from(table).select('*').eq('status', 'approved') if (data && !error) { const events = data.map((booking) => { let date, time, title, location if (table === 'wedding_bookings') { date = booking.wedding_date time = booking.wedding_time title = `Wedding: ${booking.bride_firstname} & ${booking.groom_firstname}` location = 'Parish Church' } else if (table === 'baptism_bookings') { date = booking.date_selected time = booking.time_selected title = `Baptism: ${booking.first_name} ${booking.last_name}` location = 'Parish Church' } else if (table === 'funeral_bookings') { date = booking.funeral_date time = booking.funeral_time title = `Funeral: ${booking.first_name} ${booking.last_name}` location = 'Parish Church' } else if (table === 'thanksgiving_bookings') { date = booking.date time = booking.time title = `Thanksgiving: ${booking.first_name} ${booking.last_name}` location = booking.venue } return { id: booking.id, date, time, title, location, type: table.replace('_bookings', ''), color: getEventColor(table.replace('_bookings', '')), status: booking.status, booking_data: booking, } }) allEvents.push(...events) } } // Add parish events (announcements, masses, etc.) const { data: parishEvents, error } = await supabase.from('parish_events').select('*') if (parishEvents && !error) { const events = parishEvents.map((event) => ({ id: event.id, date: event.date, time: event.time, title: event.title, location: 'Parish', type: event.type, color: getEventColor(event.type), status: 'confirmed', description: event.description, })) allEvents.push(...events) } // Sort events by date and time calendarEvents.value = allEvents.sort((a, b) => { const dateA = new Date(`${a.date} ${a.time}`) const dateB = new Date(`${b.date} ${b.time}`) return dateA - dateB }) updateSelectedDateEvents() } catch (error) { console.error('Error loading calendar events:', error) } } const eventDates = computed(() => calendarEvents.value.map((ev) => ev.date)) const getEventColor = (type) => { const category = eventCategories.value.find((cat) => cat.name === type) return category?.color || '#757575' } const updateSelectedDateEvents = () => { const dateStr = selectedDate.value.toISOString().split('T')[0] selectedDateEvents.value = calendarEvents.value.filter((event) => event.date === dateStr) } // Enhanced approval function with audit logging const approveBooking = async (booking) => { try { // Get current admin user const { data: { user }, error: userError, } = await supabase.auth.getUser() if (userError) throw userError // Update booking status const { error } = await supabase .from(booking.table) .update({ status: 'approved', approved_at: new Date().toISOString(), approved_by: user.id, }) .eq('id', booking.id) if (error) throw error // Log the approval action await supabase.from('audit_log').insert([ { action: `Approved ${booking.type} booking`, user_id: user.id, old_role: 'pending', new_role: 'approved', changed_at: new Date().toISOString(), }, ]) await loadDashboardData() bookingDialog.value = false // Show success notification console.log(`${booking.type} booking approved successfully`) } catch (error) { console.error('Error approving booking:', error) } } // Enhanced denial function with audit logging const denyBooking = async (booking) => { try { // Get current admin user const { data: { user }, error: userError, } = await supabase.auth.getUser() if (userError) throw userError // Update booking status const { error } = await supabase .from(booking.table) .update({ status: 'denied', denied_at: new Date().toISOString(), denied_by: user.id, }) .eq('id', booking.id) if (error) throw error // Log the denial action await supabase.from('audit_log').insert([ { action: `Denied ${booking.type} booking`, user_id: user.id, old_role: 'pending', new_role: 'denied', changed_at: new Date().toISOString(), }, ]) await loadDashboardData() bookingDialog.value = false console.log(`${booking.type} booking denied`) } catch (error) { console.error('Error denying booking:', error) } } const createEvent = async () => { try { const { error } = await supabase.from('parish_events').insert([ { title: newEvent.value.title, description: newEvent.value.description, date: newEvent.value.date, time: newEvent.value.time, type: newEvent.value.type, created_at: new Date().toISOString(), }, ]) if (!error) { await loadDashboardData() eventDialog.value = false resetEventForm() } } catch (error) { console.error('Error creating event:', error) } } const resetEventForm = () => { newEvent.value = { title: '', description: '', date: '', time: '', type: 'announcement', } } const openBookingDetails = (booking) => { selectedBooking.value = booking bookingDialog.value = true } const formatBookingDetails = (booking) => { if (booking.type === 'wedding') { return { title: `Wedding Booking`, subtitle: `${booking.bride_firstname} ${booking.bride_lastname} & ${booking.groom_firstname} ${booking.groom_lastname}`, date: booking.wedding_date, time: booking.wedding_time, details: [ { label: 'Bride', value: `${booking.bride_firstname} ${booking.bride_lastname}` }, { label: 'Groom', value: `${booking.groom_firstname} ${booking.groom_lastname}` }, { label: 'Date', value: booking.wedding_date }, { label: 'Time', value: booking.wedding_time }, ], } } else if (booking.type === 'baptism') { return { title: `Baptism Booking`, subtitle: `${booking.first_name} ${booking.last_name}`, date: booking.date_selected, time: booking.time_selected, details: [ { label: 'Child', value: `${booking.first_name} ${booking.last_name}` }, { label: 'Mother', value: booking.mother_fullname }, { label: 'Father', value: booking.father_fullname }, { label: 'Date', value: booking.date_selected }, { label: 'Time', value: booking.time_selected }, ], } } return { title: `${booking.type.toUpperCase()} Booking`, subtitle: booking.name || 'Details', date: booking.date_selected || booking.selected_date, time: booking.time_selected || booking.selected_time, details: [], } } onMounted(() => { loadDashboardData() requestNotificationPermission() subscriptions = subscribeToBookingUpdates() }) onUnmounted(() => { // Clean up subscriptions subscriptions.forEach((sub) => { supabase.removeChannel(sub) }) }) </script> <template> <PreloaderView /> <AdminHeader> <template #content> <v-container fluid class="pa-6"> <!-- Dashboard Header --> <div class="d-flex justify-space-between align-center mb-6"> <div> <h1 class="text-h3 font-weight-bold text-primary mb-2">Admin Dashboard</h1> <p class="text-h6 text-grey-darken-1">Parish Information Management System</p> </div> <div class="d-flex gap-3"> <!-- Notification Button --> <v-btn color="secondary" :prepend-icon="unreadCount > 0 ? 'mdi-bell-badge' : 'mdi-bell'" @click="showNotifications" size="large" > Notifications <v-badge v-if="unreadCount > 0" :content="unreadCount" color="red" class="ms-2" /> </v-btn> <v-btn color="primary" prepend-icon="mdi-calendar-plus" @click="eventDialog = true" size="large" > Create Event </v-btn> <v-btn :color="currentView === 'overview' ? 'primary' : 'grey'" @click="currentView = 'overview'" variant="outlined" > Overview </v-btn> <v-btn :color="currentView === 'calendar' ? 'primary' : 'grey'" @click="currentView = 'calendar'" variant="outlined" > Calendar </v-btn> <v-btn :color="currentView === 'bookings' ? 'primary' : 'grey'" @click="currentView = 'bookings'" variant="outlined" > Bookings </v-btn> </div> </div>
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
                    <template #prepend>
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
              <template #prepend>
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
              <template #append>
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
                  <template #prepend>
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
            <template #item.type="{ item }">
              <v-chip :color="getEventColor(item.type)" size="small">
                {{ item.type }}
              </v-chip>
            </template>
            <template #item.details="{ item }">
              {{ formatBookingDetails(item).subtitle }}
            </template>
            <template #item.date="{ item }">
              {{ formatBookingDetails(item).date }}
            </template>
            <template #item.time="{ item }">
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

  <!-- Notifications Dialog -->
  <v-dialog v-model="notificationDialog" max-width="600">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="me-2">mdi-bell</v-icon>
        Notifications
        <v-spacer />
        <v-chip color="red" size="small" v-if="unreadCount > 0">
          {{ unreadCount }} unread
        </v-chip>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-list v-if="notifications.length > 0">
          <v-list-item
            v-for="notification in notifications"
            :key="notification.id"
            @click="handleNotificationClick(notification.id)"
            :class="{ 'notification-unread': !notification.read }"
            class="notification-item"
          >
            <template #prepend>
              <v-icon :color="notification.read ? 'grey' : 'primary'" size="small" class="me-3">
                {{ notification.type === 'booking' ? 'mdi-calendar-plus' : 'mdi-information' }}
              </v-icon>
            </template>
            <v-list-item-title>{{ notification.message }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ new Date(notification.timestamp).toLocaleString() }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <div v-else class="text-center py-8 text-grey-darken-1">
          <v-icon size="64" color="grey-lighten-2">mdi-bell-outline</v-icon>
          <p class="mt-3">No notifications yet</p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="notificationDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
</AdminHeader> </template> <style scoped> .stat-card { transition: transform 0.3s ease, box-shadow 0.3s ease; border-radius: 16px; } .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); } .calendar-picker { width: 100%; max-width: none; } .booking-item { transition: background-color 0.3s ease; border-radius: 8px; margin-bottom: 8px; } .booking-item:hover { background-color: rgba(66, 165, 245, 0.1); cursor: pointer; } .booking-table { border-radius: 8px; } .text-h3 { background: linear-gradient(45deg, #1976d2, #42a5f5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; } .v-card { border-radius: 16px; } .v-btn { border-radius: 12px; text-transform: none; font-weight: 600; } .gap-3 { gap: 12px; } /* Animation for stat cards */ @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } } .stat-card { animation: fadeInUp 0.6s ease forwards; } .stat-card:nth-child(1) { animation-delay: 0.1s; } .stat-card:nth-child(2) { animation-delay: 0.2s; } .stat-card:nth-child(3) { animation-delay: 0.3s; } .stat-card:nth-child(4) { animation-delay: 0.4s; } </style>
'eventDates' is assigned a value but never used.

Copy message
Edit message

anthropic/claude-opus-4.1

The eventDates computed property on line 439 is indeed assigned but never used in the template or elsewhere in the component. This computed property appears to have been intended for marking dates on the calendar that have events, but it's not currently being utilized.

Here are a few options to address this:

Option 1: Remove the unused computed property
Simply delete line 439 since it's not being used:

javascript
2 lines
Click to expand
// Remove this line
// const eventDates = computed(() => calendarEvents.value.map((ev) => ev.date))
Option 2: Use it to highlight dates with events on the calendar
If you want to actually use this feature to show which dates have events on the calendar, you can modify the v-date-picker to highlight these dates:

vue

Run
Copy code
<v-date-picker
  v-model="selectedDate"
  @update:model-value="updateSelectedDateEvents"
  show-adjacent-months
  :events="eventDates"
  event-color="primary"
  class="calendar-picker"
/>
And modify the computed property to return unique dates:

javascript
5 lines
Click to expand
const eventDates = computed(() => {
// Get unique dates that have events
...
Option 3: Use it to show event indicators with colors
For a more sophisticated approach, you could show different colors for different event types:

javascript
15 lines
Click to expand
const eventDates = computed(() => {
// Create a function that returns colors for dates with events
...
Then use it in the template:

vue

Run
Copy code
<v-date-picker
  v-model="selectedDate"
  @update:model-value="updateSelectedDateEvents"
  show-adjacent-months
  :event-color="eventDates"
  class="calendar-picker"
/>
I recommend Option 2 if you want to keep the feature and show which dates have events, or Option 1 if you want to simply clean up the unused code. The choice depends on whether you want this visual indicator feature in your calendar.



Copy message
Edit message

anthropic/claude-opus-4.1

The errors you're encountering in your Vue component are related to ESLint rules. Let's address each of them:

1. Unused Variable: getUnreadCount
The warning about getUnreadCount being assigned a value but never used indicates that this computed property is not being referenced anywhere in your template or script.

Solution: If you intend to use it, you can reference it in your template, for example, to display the unread notifications count. If you don't need it, simply remove the computed property:

javascript
4 lines
Click to expand
// Remove this if not needed
const getUnreadCount = () => {
...
2. v-slot Directive Errors
The errors regarding the v-slot directive indicate that you are using modifiers (like .prepend or .append) with v-slot, which is not supported in Vue 2.x and later versions.

Solution: You should remove any modifiers from the v-slot directive. Here are the lines you need to check and modify:

Example of Incorrect Usage
vue

Run
Copy code
<template #item.type="{ item }">
Correct Usage
You should use the v-slot directive without modifiers:

vue

Run
Copy code
<template v-slot:item.type="{ item }">
Make sure to check all instances of v-slot in your template and remove any modifiers. Here are the lines you need to modify based on the line numbers provided in your error messages:

Line 754: Change template #item.type="{ item }" to template v-slot:item.type="{ item }"
Line 759: Change template #item.details="{ item }" to template v-slot:item.details="{ item }"
Line 762: Change template #item.date="{ item }" to template v-slot:item.date="{ item }"
Line 765: Change template #item.time="{ item }" to template v-slot:item.time="{ item }"
Line 768: Change template #item.actions="{ item }" to template v-slot:item.actions="{ item }"
Summary
Remove or use the getUnreadCount computed property.
Correct the usage of v-slot by removing any modifiers.
After making these changes, your ESLint warnings should be resolved. If you encounter any further issues, feel free to ask!


still the same:
[{
"resource": "/c:/Users/brosg/Documents/GitHub/parish-event-appointment-system/src/views/admin/AdminDashboard.vue",
"owner": "eslint5",
"code": {
"value": "no-unused-vars",
"target": {
"\$mid": 1,
"path": "/docs/latest/rules/no-unused-vars",
"scheme": "https",
"authority": "eslint.org"
}
},
"severity": 8,
"message": "'getUnreadCount' is assigned a value but never used.",
"source": "eslint",
"startLineNumber": 132,
"startColumn": 7,
"endLineNumber": 132,
"endColumn": 21,
"tags": [
1
],
"origin": "extHost1"
},{
"resource": "/c:/Users/brosg/Documents/GitHub/parish-event-appointment-system/src/views/admin/AdminDashboard.vue",
"owner": "eslint5",
"code": {
"value": "vue/valid-v-slot",
"target": {
"\$mid": 1,
"path": "/rules/valid-v-slot.html",
"scheme": "https",
"authority": "eslint.vuejs.org"
}
},
"severity": 8,
"message": "'v-slot' directive doesn't support any modifier.",
"source": "eslint",
"startLineNumber": 754,
"startColumn": 39,
"endLineNumber": 754,
"endColumn": 43,
"origin": "extHost1"
},{
"resource": "/c:/Users/brosg/Documents/GitHub/parish-event-appointment-system/src/views/admin/AdminDashboard.vue",
"owner": "eslint5",
"code": {
"value": "vue/valid-v-slot",
"target": {
"\$mid": 1,
"path": "/rules/valid-v-slot.html",
"scheme": "https",
"authority": "eslint.vuejs.org"
}
},
"severity": 8,
"message": "'v-slot' directive doesn't support any modifier.",
"source": "eslint",
"startLineNumber": 759,
"startColumn": 39,
"endLineNumber": 759,
"endColumn": 46,
"origin": "extHost1"
},{
"resource": "/c:/Users/brosg/Documents/GitHub/parish-event-appointment-system/src/views/admin/AdminDashboard.vue",
"owner": "eslint5",
"code": {
"value": "vue/valid-v-slot",
"target": {
"\$mid": 1,
"path": "/rules/valid-v-slot.html",
"scheme": "https",
"authority": "eslint.vuejs.org"
}
},
"severity": 8,
"message": "'v-slot' directive doesn't support any modifier.",
"source": "eslint",
"startLineNumber": 762,
"startColumn": 39,
"endLineNumber": 762,
"endColumn": 43,
"origin": "extHost1"
},{
"resource": "/c:/Users/brosg/Documents/GitHub/parish-event-appointment-system/src/views/admin/AdminDashboard.vue",
"owner": "eslint5",
"code": {
"value": "vue/valid-v-slot",
"target": {
"\$mid": 1,
"path": "/rules/valid-v-slot.html",
"scheme": "https",
"authority": "eslint.vuejs.org"
}
},
"severity": 8,
"message": "'v-slot' directive doesn't support any modifier.",
"source": "eslint",
"startLineNumber": 765,
"startColumn": 39,
"endLineNumber": 765,
"endColumn": 43,
"origin": "extHost1"
},{
"resource": "/c:/Users/brosg/Documents/GitHub/parish-event-appointment-system/src/views/admin/AdminDashboard.vue",
"owner": "eslint5",
"code": {
"value": "vue/valid-v-slot",
"target": {
"\$mid": 1,
"path": "/rules/valid-v-slot.html",
"scheme": "https",
"authority": "eslint.vuejs.org"
}
},
"severity": 8,
"message": "'v-slot' directive doesn't support any modifier.",
"source": "eslint",
"startLineNumber": 768,
"startColumn": 33,
"endLineNumber": 768,
"endColumn": 40,
"origin": "extHost1"
}]

Copy message
Edit message

anthropic/claude-opus-4.1

Looking at the errors, there are two issues to fix:

1. Remove the unused getUnreadCount function
Simply delete this function since it's not being used anywhere:

javascript
4 lines
Click to expand
// DELETE THESE LINES (around line 132-134)
const getUnreadCount = () => {
...
2. Fix the v-slot syntax in the v-data-table
The issue with the v-slot errors is that you're using the wrong syntax. For Vuetify's v-data-table slots, you should use the # shorthand syntax (which you already have) but the error suggests there might be an issue with how it's written.

Looking at your template around lines 754-768, you have:

vue

Run
Copy code
<template #item.type="{ item }">
<template #item.details="{ item }">
<template #item.date="{ item }">
<template #item.time="{ item }">
<template #item.actions="{ item }">
These should be changed to use square brackets for dynamic slot names:

vue

Run
Copy code
<template #[`item.type`]="{ item }">
  <v-chip :color="getEventColor(item.type)" size="small">
    {{ item.type }}
  </v-chip>
</template>
<template #[`item.details`]="{ item }">
  {{ formatBookingDetails(item).subtitle }}
</template>
<template #[`item.date`]="{ item }">
  {{ formatBookingDetails(item).date }}
</template>
<template #[`item.time`]="{ item }">
  {{ formatBookingDetails(item).time }}
</template>
<template #[`item.actions`]="{ item }">
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
The key change is wrapping the slot names in square brackets and backticks: #[item.type] instead of #item.type.

This is the correct syntax for dynamic slot names in Vue 3 when the slot name contains a dot (.).

After making these changes, your ESLint errors should be resolved.


<script setup> import { ref, computed, onMounted, onUnmounted } from 'vue' import { supabase } from '@/utils/supabase.js' import AdminHeader from '@/components/layout/AdminHeader.vue' import PreloaderView from '@/components/layout/PreloaderView.vue' // Data refs const notifications = ref([]) const notificationDialog = ref(false) const selectedDate = ref(new Date()) const currentView = ref('overview') const pendingBookings = ref([]) const events = ref([]) const stats = ref({ totalBookings: 0, pendingApprovals: 0, upcomingEvents: 0, totalMembers: 0, }) // Event creation const newEvent = ref({ title: '', description: '', date: '', time: '', type: 'announcement', }) const eventDialog = ref(false) const bookingDialog = ref(false) const selectedBooking = ref(null) // Calendar data const calendarEvents = ref([]) const selectedDateEvents = ref([]) // Event categories (defined in app instead of database) const eventCategories = ref([ { name: 'announcement', label: 'Announcement', color: '#9C27B0', icon: 'mdi-bullhorn' }, { name: 'mass', label: 'Holy Mass', color: '#2196F3', icon: 'mdi-church' }, { name: 'event', label: 'Parish Event', color: '#4CAF50', icon: 'mdi-calendar-star' }, { name: 'celebration', label: 'Celebration', color: '#FF9800', icon: 'mdi-party-popper' }, { name: 'wedding', label: 'Wedding', color: '#E91E63', icon: 'mdi-heart' }, { name: 'baptism', label: 'Baptism', color: '#00BCD4', icon: 'mdi-water' }, { name: 'funeral', label: 'Funeral', color: '#424242', icon: 'mdi-cross' }, { name: 'thanksgiving', label: 'Thanksgiving', color: '#FF5722', icon: 'mdi-hands-pray' }, ]) const subscribeToBookingUpdates = () => { const tables = [ 'wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings', ] const subscriptions = [] tables.forEach((tableName) => { const subscription = supabase .channel(`public:${tableName}`) .on( 'postgres_changes', { event: 'INSERT', schema: 'public', table: tableName, }, (payload) => { const newBooking = payload.new // Add to notifications notifications.value.unshift({ id: Date.now(), message: `New ${tableName.replace('_bookings', '')} booking from ${newBooking.first_name || newBooking.bride_firstname}`, timestamp: new Date(), type: 'booking', data: newBooking, read: false, }) // Refresh dashboard data loadDashboardData() // Show browser notification if permission granted if (Notification.permission === 'granted') { new Notification('New Booking Received', { body: `New ${tableName.replace('_bookings', '')} booking submitted`, icon: '/logo.png', }) } }, ) .subscribe() subscriptions.push(subscription) }) return subscriptions } const requestNotificationPermission = async () => { if ('Notification' in window) { const permission = await Notification.requestPermission() console.log('Notification permission:', permission) } } let subscriptions = [] // Load all data const loadDashboardData = async () => { await Promise.all([loadPendingBookings(), loadEvents(), loadStats(), loadCalendarEvents()]) } const markAsRead = (notificationId) => { const notification = notifications.value.find((n) => n.id === notificationId) if (notification) { notification.read = true } } const unreadCount = computed(() => { return notifications.value.filter((n) => !n.read).length }) // Show notification dialog (using the previously unused variables) const showNotifications = () => { notificationDialog.value = true } // Get unread notifications count for display const getUnreadCount = () => { return unreadCount.value } // Mark notification as read when clicked const handleNotificationClick = (notificationId) => { markAsRead(notificationId) } const loadPendingBookings = async () => { try { // Load from multiple booking tables const tables = [ 'wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings', ] const allBookings = [] for (const table of tables) { const { data, error } = await supabase.from(table).select('*').eq('status', 'pending') if (data && !error) { const bookingsWithType = data.map((booking) => ({ ...booking, type: table.replace('_bookings', ''), table: table, })) allBookings.push(...bookingsWithType) } } pendingBookings.value = allBookings stats.value.pendingApprovals = allBookings.length } catch (error) { console.error('Error loading pending bookings:', error) } } const loadEvents = async () => { try { const { data, error } = await supabase .from('parish_events') .select('*') .order('date', { ascending: true }) if (data && !error) { events.value = data stats.value.upcomingEvents = data.filter((e) => new Date(e.date) >= new Date()).length } } catch (error) { console.error('Error loading events:', error) } } const loadStats = async () => { try { const tables = [ 'wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings', ] let totalBookings = 0 for (const table of tables) { const { count, error } = await supabase.from(table).select('*', { count: 'exact' }) if (!error) { totalBookings += count || 0 } } stats.value.totalBookings = totalBookings stats.value.totalMembers = Math.floor(totalBookings * 1.5) // Estimated } catch (error) { console.error('Error loading stats:', error) } } const loadCalendarEvents = async () => { try { const tables = [ 'wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings', ] const allEvents = [] for (const table of tables) { const { data, error } = await supabase.from(table).select('*').eq('status', 'approved') if (data && !error) { const events = data.map((booking) => { let date, time, title, location if (table === 'wedding_bookings') { date = booking.wedding_date time = booking.wedding_time title = `Wedding: ${booking.bride_firstname} & ${booking.groom_firstname}` location = 'Parish Church' } else if (table === 'baptism_bookings') { date = booking.date_selected time = booking.time_selected title = `Baptism: ${booking.first_name} ${booking.last_name}` location = 'Parish Church' } else if (table === 'funeral_bookings') { date = booking.funeral_date time = booking.funeral_time title = `Funeral: ${booking.first_name} ${booking.last_name}` location = 'Parish Church' } else if (table === 'thanksgiving_bookings') { date = booking.date time = booking.time title = `Thanksgiving: ${booking.first_name} ${booking.last_name}` location = booking.venue } return { id: booking.id, date, time, title, location, type: table.replace('_bookings', ''), color: getEventColor(table.replace('_bookings', '')), status: booking.status, booking_data: booking, } }) allEvents.push(...events) } } // Add parish events (announcements, masses, etc.) const { data: parishEvents, error } = await supabase.from('parish_events').select('*') if (parishEvents && !error) { const events = parishEvents.map((event) => ({ id: event.id, date: event.date, time: event.time, title: event.title, location: 'Parish', type: event.type, color: getEventColor(event.type), status: 'confirmed', description: event.description, })) allEvents.push(...events) } // Sort events by date and time calendarEvents.value = allEvents.sort((a, b) => { const dateA = new Date(`${a.date} ${a.time}`) const dateB = new Date(`${b.date} ${b.time}`) return dateA - dateB }) updateSelectedDateEvents() } catch (error) { console.error('Error loading calendar events:', error) } } const eventDates = computed(() => { // Create a function that returns colors for dates with events return (date) => { const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0] const eventsOnDate = calendarEvents.value.filter((ev) => ev.date === dateStr) if (eventsOnDate.length === 0) return false // Return the color of the first event, or a default color if multiple if (eventsOnDate.length === 1) { return eventsOnDate[0].color } return 'grey' // Multiple events indicator } }) const getEventColor = (type) => { const category = eventCategories.value.find((cat) => cat.name === type) return category?.color || '#757575' } const updateSelectedDateEvents = () => { const dateStr = selectedDate.value.toISOString().split('T')[0] selectedDateEvents.value = calendarEvents.value.filter((event) => event.date === dateStr) } // Enhanced approval function with audit logging const approveBooking = async (booking) => { try { // Get current admin user const { data: { user }, error: userError, } = await supabase.auth.getUser() if (userError) throw userError // Update booking status const { error } = await supabase .from(booking.table) .update({ status: 'approved', approved_at: new Date().toISOString(), approved_by: user.id, }) .eq('id', booking.id) if (error) throw error // Log the approval action await supabase.from('audit_log').insert([ { action: `Approved ${booking.type} booking`, user_id: user.id, old_role: 'pending', new_role: 'approved', changed_at: new Date().toISOString(), }, ]) await loadDashboardData() bookingDialog.value = false // Show success notification console.log(`${booking.type} booking approved successfully`) } catch (error) { console.error('Error approving booking:', error) } } // Enhanced denial function with audit logging const denyBooking = async (booking) => { try { // Get current admin user const { data: { user }, error: userError, } = await supabase.auth.getUser() if (userError) throw userError // Update booking status const { error } = await supabase .from(booking.table) .update({ status: 'denied', denied_at: new Date().toISOString(), denied_by: user.id, }) .eq('id', booking.id) if (error) throw error // Log the denial action await supabase.from('audit_log').insert([ { action: `Denied ${booking.type} booking`, user_id: user.id, old_role: 'pending', new_role: 'denied', changed_at: new Date().toISOString(), }, ]) await loadDashboardData() bookingDialog.value = false console.log(`${booking.type} booking denied`) } catch (error) { console.error('Error denying booking:', error) } } const createEvent = async () => { try { const { error } = await supabase.from('parish_events').insert([ { title: newEvent.value.title, description: newEvent.value.description, date: newEvent.value.date, time: newEvent.value.time, type: newEvent.value.type, created_at: new Date().toISOString(), }, ]) if (!error) { await loadDashboardData() eventDialog.value = false resetEventForm() } } catch (error) { console.error('Error creating event:', error) } } const resetEventForm = () => { newEvent.value = { title: '', description: '', date: '', time: '', type: 'announcement', } } const openBookingDetails = (booking) => { selectedBooking.value = booking bookingDialog.value = true } const formatBookingDetails = (booking) => { if (booking.type === 'wedding') { return { title: `Wedding Booking`, subtitle: `${booking.bride_firstname} ${booking.bride_lastname} & ${booking.groom_firstname} ${booking.groom_lastname}`, date: booking.wedding_date, time: booking.wedding_time, details: [ { label: 'Bride', value: `${booking.bride_firstname} ${booking.bride_lastname}` }, { label: 'Groom', value: `${booking.groom_firstname} ${booking.groom_lastname}` }, { label: 'Date', value: booking.wedding_date }, { label: 'Time', value: booking.wedding_time }, ], } } else if (booking.type === 'baptism') { return { title: `Baptism Booking`, subtitle: `${booking.first_name} ${booking.last_name}`, date: booking.date_selected, time: booking.time_selected, details: [ { label: 'Child', value: `${booking.first_name} ${booking.last_name}` }, { label: 'Mother', value: booking.mother_fullname }, { label: 'Father', value: booking.father_fullname }, { label: 'Date', value: booking.date_selected }, { label: 'Time', value: booking.time_selected }, ], } } return { title: `${booking.type.toUpperCase()} Booking`, subtitle: booking.name || 'Details', date: booking.date_selected || booking.selected_date, time: booking.time_selected || booking.selected_time, details: [], } } onMounted(() => { loadDashboardData() requestNotificationPermission() subscriptions = subscribeToBookingUpdates() }) onUnmounted(() => { // Clean up subscriptions subscriptions.forEach((sub) => { supabase.removeChannel(sub) }) }) </script> <template> <PreloaderView /> <AdminHeader> <template #content> <v-container fluid class="pa-6"> <!-- Dashboard Header --> <div class="d-flex justify-space-between align-center mb-6"> <div> <h1 class="text-h3 font-weight-bold text-primary mb-2">Admin Dashboard</h1> <p class="text-h6 text-grey-darken-1">Parish Information Management System</p> </div> <div class="d-flex gap-3"> <!-- Notification Button --> <v-btn color="secondary" :prepend-icon="unreadCount > 0 ? 'mdi-bell-badge' : 'mdi-bell'" @click="showNotifications" size="large" > Notifications <v-badge v-if="unreadCount > 0" :content="unreadCount" color="red" class="ms-2" /> </v-btn> <v-btn color="primary" prepend-icon="mdi-calendar-plus" @click="eventDialog = true" size="large" > Create Event </v-btn> <v-btn :color="currentView === 'overview' ? 'primary' : 'grey'" @click="currentView = 'overview'" variant="outlined" > Overview </v-btn> <v-btn :color="currentView === 'calendar' ? 'primary' : 'grey'" @click="currentView = 'calendar'" variant="outlined" > Calendar </v-btn> <v-btn :color="currentView === 'bookings' ? 'primary' : 'grey'" @click="currentView = 'bookings'" variant="outlined" > Bookings </v-btn> </div> </div>
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
                :event-color="eventDates"
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
                    <template #prepend>
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
              <template #prepend>
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
              <template #append>
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
                :event-color="eventDates"
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
                  <template #prepend>
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
            <template #[`item.type`]="{ item }">
              <v-chip :color="getEventColor(item.type)" size="small">
                {{ item.type }}
              </v-chip>
            </template>
            <template #[`item.details`]="{ item }">
              {{ formatBookingDetails(item).subtitle }}
            </template>
            <template #[`item.date`]="{ item }">
              {{ formatBookingDetails(item).date }}
            </template>
            <template #[`item.time`]="{ item }">
              {{ formatBookingDetails(item).time }}
            </template>
            <template #[`item.actions`]="{ item }">
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

  <!-- Notifications Dialog -->
  <v-dialog v-model="notificationDialog" max-width="600">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="me-2">mdi-bell</v-icon>
        Notifications
        <v-spacer />
        <v-chip color="red" size="small" v-if="unreadCount > 0">
          {{ unreadCount }} unread
        </v-chip>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-list v-if="notifications.length > 0">
          <v-list-item
            v-for="notification in notifications"
            :key="notification.id"
            @click="handleNotificationClick(notification.id)"
            :class="{ 'notification-unread': !notification.read }"
            class="notification-item"
          >
            <template #prepend>
              <v-icon :color="notification.read ? 'grey' : 'primary'" size="small" class="me-3">
                {{ notification.type === 'booking' ? 'mdi-calendar-plus' : 'mdi-information' }}
              </v-icon>
            </template>
            <v-list-item-title>{{ notification.message }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ new Date(notification.timestamp).toLocaleString() }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <div v-else class="text-center py-8 text-grey-darken-1">
          <v-icon size="64" color="grey-lighten-2">mdi-bell-outline</v-icon>
          <p class="mt-3">No notifications yet</p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="notificationDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
</AdminHeader> </template> <style scoped> .stat-card { transition: transform 0.3s ease, box-shadow 0.3s ease; border-radius: 16px; } .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); } .calendar-picker { width: 100%; max-width: none; } .booking-item { transition: background-color 0.3s ease; border-radius: 8px; margin-bottom: 8px; } .booking-item:hover { background-color: rgba(66, 165, 245, 0.1); cursor: pointer; } .booking-table { border-radius: 8px; } .text-h3 { background: linear-gradient(45deg, #1976d2, #42a5f5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; } .v-card { border-radius: 16px; } .v-btn { border-radius: 12px; text-transform: none; font-weight: 600; } .gap-3 { gap: 12px; } /* Animation for stat cards */ @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } } .stat-card { animation: fadeInUp 0.6s ease forwards; } .stat-card:nth-child(1) { animation-delay: 0.1s; } .stat-card:nth-child(2) { animation-delay: 0.2s; } .stat-card:nth-child(3) { animation-delay: 0.3s; } .stat-card:nth-child(4) { animation-delay: 0.4s; } </style>
i wanna use // Get unread notifications count for display
const getUnreadCount = () => {
return unreadCount.value
}

Copy message
Edit message

anthropic/claude-opus-4.1

Looking at your code, you have getUnreadCount defined but it's not being used. Since you already have unreadCount as a computed property that does the same thing, you actually don't need getUnreadCount at all.

Here's what you should do:

Option 1: Remove the unused function (Recommended)
Simply delete the getUnreadCount function since you're already using unreadCount directly in your template:

javascript
5 lines
Click to expand
// DELETE THESE LINES (around line 129-132)
// Get unread notifications count for display
...
You're already using unreadCount in your template at:

Line 566: :prepend-icon="unreadCount > 0 ? 'mdi-bell-badge' : 'mdi-bell'"
Line 571: <v-badge v-if="unreadCount > 0" :content="unreadCount"...
Line 810: <v-chip color="red" size="small" v-if="unreadCount > 0">
Option 2: Use getUnreadCount instead of unreadCount
If you really want to keep the function, you'd need to replace all instances of unreadCount with getUnreadCount() in your template:

vue

Run
Copy code
<!-- Change from -->
:prepend-icon="unreadCount > 0 ? 'mdi-bell-badge' : 'mdi-bell'"

<!-- To -->
:prepend-icon="getUnreadCount() > 0 ? 'mdi-bell-badge' : 'mdi-bell'"
However, this is unnecessary since computed properties are already reactive and cached.

Recommendation
I recommend Option 1 - just delete the getUnreadCount function. You're already using the unreadCount computed property correctly throughout your template, and having both is redundant. The computed property is the Vue way of handling reactive derived state.

Delete lines 129-132:

javascript
5 lines
Click to expand
// DELETE THESE LINES
// Get unread notifications count for display
...
This will resolve the ESLint warning about the unused variable.


can you redesign it to look more good for the eyes and more new, but keep all the functions and everything also the calendar add something to highlight the events in that day like make that day in the color have a color

Copy message
Edit message

anthropic/claude-opus-4.1

Working on file update.
The user wants me to redesign the Vue component to make it more visually appealing while keeping all the functionality. They specifically want:

Better visual design ("more good for the eyes and more new")
Keep all existing functions
Calendar should highlight days with events using colors
Since this is a Vue component using Vuetify, I'll need to create an HTML file that demonstrates what the redesigned version would look like. I'll use modern design principles with:

Better color schemes
Improved spacing and layout
Glass morphism or modern card designs
Better visual hierarchy
Enhanced calendar with event indicators
Smooth animations
Better use of gradients and shadows
I'll create a single HTML file with all the styling and functionality mocked up to show how the redesigned admin dashboard would look.

I'll redesign your Admin Dashboard with a modern, visually appealing interface while keeping all the functionality. I'll create a beautiful, eye-friendly design with enhanced calendar features that highlight event days with colors.

admin-dashboard-redesign.html

html
991 lines
Click to close
<!DOCTYPE html>
...

implement that here:

<script setup> import { ref, computed, onMounted, onUnmounted } from 'vue' import { supabase } from '@/utils/supabase.js' import AdminHeader from '@/components/layout/AdminHeader.vue' import PreloaderView from '@/components/layout/PreloaderView.vue' // Data refs const notifications = ref([]) const notificationDialog = ref(false) const selectedDate = ref(new Date()) const currentView = ref('overview') const pendingBookings = ref([]) const events = ref([]) const stats = ref({ totalBookings: 0, pendingApprovals: 0, upcomingEvents: 0, totalMembers: 0, }) // Event creation const newEvent = ref({ title: '', description: '', date: '', time: '', type: 'announcement', }) const eventDialog = ref(false) const bookingDialog = ref(false) const selectedBooking = ref(null) // Calendar data const calendarEvents = ref([]) const selectedDateEvents = ref([]) // Event categories (defined in app instead of database) const eventCategories = ref([ { name: 'announcement', label: 'Announcement', color: '#9C27B0', icon: 'mdi-bullhorn' }, { name: 'mass', label: 'Holy Mass', color: '#2196F3', icon: 'mdi-church' }, { name: 'event', label: 'Parish Event', color: '#4CAF50', icon: 'mdi-calendar-star' }, { name: 'celebration', label: 'Celebration', color: '#FF9800', icon: 'mdi-party-popper' }, { name: 'wedding', label: 'Wedding', color: '#E91E63', icon: 'mdi-heart' }, { name: 'baptism', label: 'Baptism', color: '#00BCD4', icon: 'mdi-water' }, { name: 'funeral', label: 'Funeral', color: '#424242', icon: 'mdi-cross' }, { name: 'thanksgiving', label: 'Thanksgiving', color: '#FF5722', icon: 'mdi-hands-pray' }, ]) const subscribeToBookingUpdates = () => { const tables = [ 'wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings', ] const subscriptions = [] tables.forEach((tableName) => { const subscription = supabase .channel(`public:${tableName}`) .on( 'postgres_changes', { event: 'INSERT', schema: 'public', table: tableName, }, (payload) => { const newBooking = payload.new // Add to notifications notifications.value.unshift({ id: Date.now(), message: `New ${tableName.replace('_bookings', '')} booking from ${newBooking.first_name || newBooking.bride_firstname}`, timestamp: new Date(), type: 'booking', data: newBooking, read: false, }) // Refresh dashboard data loadDashboardData() // Show browser notification if permission granted if (Notification.permission === 'granted') { new Notification('New Booking Received', { body: `New ${tableName.replace('_bookings', '')} booking submitted`, icon: '/logo.png', }) } }, ) .subscribe() subscriptions.push(subscription) }) return subscriptions } const requestNotificationPermission = async () => { if ('Notification' in window) { const permission = await Notification.requestPermission() console.log('Notification permission:', permission) } } let subscriptions = [] // Load all data const loadDashboardData = async () => { await Promise.all([loadPendingBookings(), loadEvents(), loadStats(), loadCalendarEvents()]) } const markAsRead = (notificationId) => { const notification = notifications.value.find((n) => n.id === notificationId) if (notification) { notification.read = true } } const unreadCount = computed(() => { return notifications.value.filter((n) => !n.read).length }) // Show notification dialog (using the previously unused variables) const showNotifications = () => { notificationDialog.value = true } // Mark notification as read when clicked const handleNotificationClick = (notificationId) => { markAsRead(notificationId) } const loadPendingBookings = async () => { try { // Load from multiple booking tables const tables = [ 'wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings', ] const allBookings = [] for (const table of tables) { const { data, error } = await supabase.from(table).select('*').eq('status', 'pending') if (data && !error) { const bookingsWithType = data.map((booking) => ({ ...booking, type: table.replace('_bookings', ''), table: table, })) allBookings.push(...bookingsWithType) } } pendingBookings.value = allBookings stats.value.pendingApprovals = allBookings.length } catch (error) { console.error('Error loading pending bookings:', error) } } const loadEvents = async () => { try { const { data, error } = await supabase .from('parish_events') .select('*') .order('date', { ascending: true }) if (data && !error) { events.value = data stats.value.upcomingEvents = data.filter((e) => new Date(e.date) >= new Date()).length } } catch (error) { console.error('Error loading events:', error) } } const loadStats = async () => { try { const tables = [ 'wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings', ] let totalBookings = 0 for (const table of tables) { const { count, error } = await supabase.from(table).select('*', { count: 'exact' }) if (!error) { totalBookings += count || 0 } } stats.value.totalBookings = totalBookings stats.value.totalMembers = Math.floor(totalBookings * 1.5) // Estimated } catch (error) { console.error('Error loading stats:', error) } } const loadCalendarEvents = async () => { try { const tables = [ 'wedding_bookings', 'baptism_bookings', 'funeral_bookings', 'thanksgiving_bookings', ] const allEvents = [] for (const table of tables) { const { data, error } = await supabase.from(table).select('*').eq('status', 'approved') if (data && !error) { const events = data.map((booking) => { let date, time, title, location if (table === 'wedding_bookings') { date = booking.wedding_date time = booking.wedding_time title = `Wedding: ${booking.bride_firstname} & ${booking.groom_firstname}` location = 'Parish Church' } else if (table === 'baptism_bookings') { date = booking.date_selected time = booking.time_selected title = `Baptism: ${booking.first_name} ${booking.last_name}` location = 'Parish Church' } else if (table === 'funeral_bookings') { date = booking.funeral_date time = booking.funeral_time title = `Funeral: ${booking.first_name} ${booking.last_name}` location = 'Parish Church' } else if (table === 'thanksgiving_bookings') { date = booking.date time = booking.time title = `Thanksgiving: ${booking.first_name} ${booking.last_name}` location = booking.venue } return { id: booking.id, date, time, title, location, type: table.replace('_bookings', ''), color: getEventColor(table.replace('_bookings', '')), status: booking.status, booking_data: booking, } }) allEvents.push(...events) } } // Add parish events (announcements, masses, etc.) const { data: parishEvents, error } = await supabase.from('parish_events').select('*') if (parishEvents && !error) { const events = parishEvents.map((event) => ({ id: event.id, date: event.date, time: event.time, title: event.title, location: 'Parish', type: event.type, color: getEventColor(event.type), status: 'confirmed', description: event.description, })) allEvents.push(...events) } // Sort events by date and time calendarEvents.value = allEvents.sort((a, b) => { const dateA = new Date(`${a.date} ${a.time}`) const dateB = new Date(`${b.date} ${b.time}`) return dateA - dateB }) updateSelectedDateEvents() } catch (error) { console.error('Error loading calendar events:', error) } } const eventDates = computed(() => { // Create a function that returns colors for dates with events return (date) => { const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0] const eventsOnDate = calendarEvents.value.filter((ev) => ev.date === dateStr) if (eventsOnDate.length === 0) return false // Return the color of the first event, or a default color if multiple if (eventsOnDate.length === 1) { return eventsOnDate[0].color } return 'grey' // Multiple events indicator } }) const getEventColor = (type) => { const category = eventCategories.value.find((cat) => cat.name === type) return category?.color || '#757575' } const updateSelectedDateEvents = () => { const dateStr = selectedDate.value.toISOString().split('T')[0] selectedDateEvents.value = calendarEvents.value.filter((event) => event.date === dateStr) } // Enhanced approval function with audit logging const approveBooking = async (booking) => { try { // Get current admin user const { data: { user }, error: userError, } = await supabase.auth.getUser() if (userError) throw userError // Update booking status const { error } = await supabase .from(booking.table) .update({ status: 'approved', approved_at: new Date().toISOString(), approved_by: user.id, }) .eq('id', booking.id) if (error) throw error // Log the approval action await supabase.from('audit_log').insert([ { action: `Approved ${booking.type} booking`, user_id: user.id, old_role: 'pending', new_role: 'approved', changed_at: new Date().toISOString(), }, ]) await loadDashboardData() bookingDialog.value = false // Show success notification console.log(`${booking.type} booking approved successfully`) } catch (error) { console.error('Error approving booking:', error) } } // Enhanced denial function with audit logging const denyBooking = async (booking) => { try { // Get current admin user const { data: { user }, error: userError, } = await supabase.auth.getUser() if (userError) throw userError // Update booking status const { error } = await supabase .from(booking.table) .update({ status: 'denied', denied_at: new Date().toISOString(), denied_by: user.id, }) .eq('id', booking.id) if (error) throw error // Log the denial action await supabase.from('audit_log').insert([ { action: `Denied ${booking.type} booking`, user_id: user.id, old_role: 'pending', new_role: 'denied', changed_at: new Date().toISOString(), }, ]) await loadDashboardData() bookingDialog.value = false console.log(`${booking.type} booking denied`) } catch (error) { console.error('Error denying booking:', error) } } const createEvent = async () => { try { const { error } = await supabase.from('parish_events').insert([ { title: newEvent.value.title, description: newEvent.value.description, date: newEvent.value.date, time: newEvent.value.time, type: newEvent.value.type, created_at: new Date().toISOString(), }, ]) if (!error) { await loadDashboardData() eventDialog.value = false resetEventForm() } } catch (error) { console.error('Error creating event:', error) } } const resetEventForm = () => { newEvent.value = { title: '', description: '', date: '', time: '', type: 'announcement', } } const openBookingDetails = (booking) => { selectedBooking.value = booking bookingDialog.value = true } const formatBookingDetails = (booking) => { if (booking.type === 'wedding') { return { title: `Wedding Booking`, subtitle: `${booking.bride_firstname} ${booking.bride_lastname} & ${booking.groom_firstname} ${booking.groom_lastname}`, date: booking.wedding_date, time: booking.wedding_time, details: [ { label: 'Bride', value: `${booking.bride_firstname} ${booking.bride_lastname}` }, { label: 'Groom', value: `${booking.groom_firstname} ${booking.groom_lastname}` }, { label: 'Date', value: booking.wedding_date }, { label: 'Time', value: booking.wedding_time }, ], } } else if (booking.type === 'baptism') { return { title: `Baptism Booking`, subtitle: `${booking.first_name} ${booking.last_name}`, date: booking.date_selected, time: booking.time_selected, details: [ { label: 'Child', value: `${booking.first_name} ${booking.last_name}` }, { label: 'Mother', value: booking.mother_fullname }, { label: 'Father', value: booking.father_fullname }, { label: 'Date', value: booking.date_selected }, { label: 'Time', value: booking.time_selected }, ], } } return { title: `${booking.type.toUpperCase()} Booking`, subtitle: booking.name || 'Details', date: booking.date_selected || booking.selected_date, time: booking.time_selected || booking.selected_time, details: [], } } onMounted(() => { loadDashboardData() requestNotificationPermission() subscriptions = subscribeToBookingUpdates() }) onUnmounted(() => { // Clean up subscriptions subscriptions.forEach((sub) => { supabase.removeChannel(sub) }) }) </script> <template> <PreloaderView /> <AdminHeader> <template #content> <v-container fluid class="pa-6"> <!-- Dashboard Header --> <div class="d-flex justify-space-between align-center mb-6"> <div> <h1 class="text-h3 font-weight-bold text-primary mb-2">Admin Dashboard</h1> <p class="text-h6 text-grey-darken-1">Parish Information Management System</p> </div> <div class="d-flex gap-3"> <!-- Notification Button --> <v-btn color="secondary" :prepend-icon="unreadCount > 0 ? 'mdi-bell-badge' : 'mdi-bell'" @click="showNotifications" size="large" > Notifications <v-badge v-if="unreadCount > 0" :content="unreadCount" color="red" class="ms-2" /> </v-btn> <v-btn color="primary" prepend-icon="mdi-calendar-plus" @click="eventDialog = true" size="large" > Create Event </v-btn> <v-btn :color="currentView === 'overview' ? 'primary' : 'grey'" @click="currentView = 'overview'" variant="outlined" > Overview </v-btn> <v-btn :color="currentView === 'calendar' ? 'primary' : 'grey'" @click="currentView = 'calendar'" variant="outlined" > Calendar </v-btn> <v-btn :color="currentView === 'bookings' ? 'primary' : 'grey'" @click="currentView = 'bookings'" variant="outlined" > Bookings </v-btn> </div> </div>
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
                :event-color="eventDates"
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
                    <template #prepend>
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
              <template #prepend>
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
              <template #append>
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
                :event-color="eventDates"
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
                  <template #prepend>
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
            <template #[`item.type`]="{ item }">
              <v-chip :color="getEventColor(item.type)" size="small">
                {{ item.type }}
              </v-chip>
            </template>
            <template #[`item.details`]="{ item }">
              {{ formatBookingDetails(item).subtitle }}
            </template>
            <template #[`item.date`]="{ item }">
              {{ formatBookingDetails(item).date }}
            </template>
            <template #[`item.time`]="{ item }">
              {{ formatBookingDetails(item).time }}
            </template>
            <template #[`item.actions`]="{ item }">
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

  <!-- Notifications Dialog -->
  <v-dialog v-model="notificationDialog" max-width="600">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="me-2">mdi-bell</v-icon>
        Notifications
        <v-spacer />
        <v-chip color="red" size="small" v-if="unreadCount > 0">
          {{ unreadCount }} unread
        </v-chip>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-list v-if="notifications.length > 0">
          <v-list-item
            v-for="notification in notifications"
            :key="notification.id"
            @click="handleNotificationClick(notification.id)"
            :class="{ 'notification-unread': !notification.read }"
            class="notification-item"
          >
            <template #prepend>
              <v-icon :color="notification.read ? 'grey' : 'primary'" size="small" class="me-3">
                {{ notification.type === 'booking' ? 'mdi-calendar-plus' : 'mdi-information' }}
              </v-icon>
            </template>
            <v-list-item-title>{{ notification.message }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ new Date(notification.timestamp).toLocaleString() }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <div v-else class="text-center py-8 text-grey-darken-1">
          <v-icon size="64" color="grey-lighten-2">mdi-bell-outline</v-icon>
          <p class="mt-3">No notifications yet</p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="notificationDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
</AdminHeader> </template> <style scoped> .stat-card { transition: transform 0.3s ease, box-shadow 0.3s ease; border-radius: 16px; } .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); } .calendar-picker { width: 100%; max-width: none; } .booking-item { transition: background-color 0.3s ease; border-radius: 8px; margin-bottom: 8px; } .booking-item:hover { background-color: rgba(66, 165, 245, 0.1); cursor: pointer; } .booking-table { border-radius: 8px; } .text-h3 { background: linear-gradient(45deg, #1976d2, #42a5f5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; } .v-card { border-radius: 16px; } .v-btn { border-radius: 12px; text-transform: none; font-weight: 600; } .gap-3 { gap: 12px; } /* Animation for stat cards */ @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } } .stat-card { animation: fadeInUp 0.6s ease forwards; } .stat-card:nth-child(1) { animation-delay: 0.1s; } .stat-card:nth-child(2) { animation-delay: 0.2s; } .stat-card:nth-child(3) { animation-delay: 0.3s; } .stat-card:nth-child(4) { animation-delay: 0.4s; } </style>
Copy message
Edit message

BLACKBOXAI

I'll implement the modern redesign into your Vue component while keeping all the functionality intact. Here's the enhanced version with beautiful styling, gradient backgrounds, glass morphism effects, and improved calendar with colored event indicators:

vue

Run
Copy code
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import AdminHeader from '@/components/layout/AdminHeader.vue'
import PreloaderView from '@/components/layout/PreloaderView.vue'

// Data refs
const notifications = ref([])
const notificationDialog = ref(false)
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

// Add stats trends for visual appeal
const statsTrends = ref({
  totalBookings: { value: 12, isUp: true },
  pendingApprovals: { urgent: 3 },
  upcomingEvents: { next: 'Tomorrow 10:00 AM' },
  totalMembers: { value: 48, isUp: true },
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

// Enhanced Event categories with gradients
const eventCategories = ref([
  {
    name: 'announcement',
    label: 'Announcement',
    color: '#9C27B0',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: 'mdi-bullhorn'
  },
  {
    name: 'mass',
    label: 'Holy Mass',
    color: '#f093fb',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: 'mdi-church'
  },
  {
    name: 'event',
    label: 'Parish Event',
    color: '#43e97b',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: 'mdi-calendar-star'
  },
  {
    name: 'celebration',
    label: 'Celebration',
    color: '#FF9800',
    gradient: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
    icon: 'mdi-party-popper'
  },
  {
    name: 'wedding',
    label: 'Wedding',
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: 'mdi-heart'
  },
  {
    name: 'baptism',
    label: 'Baptism',
    color: '#4facfe',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: 'mdi-water'
  },
  {
    name: 'funeral',
    label: 'Funeral',
    color: '#424242',
    gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    icon: 'mdi-cross'
  },
  {
    name: 'thanksgiving',
    label: 'Thanksgiving',
    color: '#FF5722',
    gradient: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)',
    icon: 'mdi-hands-pray'
  },
])

// Recent activity for sidebar
const recentActivity = ref([
  { icon: 'mdi-check', color: 'green', text: 'Approved wedding booking', time: '2 hours ago' },
  { icon: 'mdi-calendar', color: 'blue', text: 'Created new event', time: '5 hours ago' },
  { icon: 'mdi-account', color: 'purple', text: 'New member registered', time: 'Yesterday' },
])

const subscribeToBookingUpdates = () => {
  const tables = [
    'wedding_bookings',
    'baptism_bookings',
    'funeral_bookings',
    'thanksgiving_bookings',
  ]
  const subscriptions = []

  tables.forEach((tableName) => {
    const subscription = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          const newBooking = payload.new
          // Add to notifications
          notifications.value.unshift({
            id: Date.now(),
            message: `New ${tableName.replace('_bookings', '')} booking from ${newBooking.first_name || newBooking.bride_firstname}`,
            timestamp: new Date(),
            type: 'booking',
            data: newBooking,
            read: false,
          })

          // Refresh dashboard data
          loadDashboardData()

          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification('New Booking Received', {
              body: `New ${tableName.replace('_bookings', '')} booking submitted`,
              icon: '/logo.png',
            })
          }
        },
      )
      .subscribe()

    subscriptions.push(subscription)
  })

  return subscriptions
}

const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    console.log('Notification permission:', permission)
  }
}

let subscriptions = []

// Load all data
const loadDashboardData = async () => {
  await Promise.all([loadPendingBookings(), loadEvents(), loadStats(), loadCalendarEvents()])
}

const markAsRead = (notificationId) => {
  const notification = notifications.value.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length
})

// Show notification dialog
const showNotifications = () => {
  notificationDialog.value = true
}

// Mark notification as read when clicked
const handleNotificationClick = (notificationId) => {
  markAsRead(notificationId)
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
          let date, time, title, location

          if (table === 'wedding_bookings') {
            date = booking.wedding_date
            time = booking.wedding_time
            title = `Wedding: ${booking.bride_firstname} & ${booking.groom_firstname}`
            location = 'Parish Church'
          } else if (table === 'baptism_bookings') {
            date = booking.date_selected
            time = booking.time_selected
            title = `Baptism: ${booking.first_name} ${booking.last_name}`
            location = 'Parish Church'
          } else if (table === 'funeral_bookings') {
            date = booking.funeral_date
            time = booking.funeral_time
            title = `Funeral: ${booking.first_name} ${booking.last_name}`
            location = 'Parish Church'
          } else if (table === 'thanksgiving_bookings') {
            date = booking.date
            time = booking.time
            title = `Thanksgiving: ${booking.first_name} ${booking.last_name}`
            location = booking.venue
          }

          return {
            id: booking.id,
            date,
            time,
            title,
            location,
            type: table.replace('_bookings', ''),
            color: getEventColor(table.replace('_bookings', '')),
            gradient: getEventGradient(table.replace('_bookings', '')),
            status: booking.status,
            booking_data: booking,
          }
        })
        allEvents.push(...events)
      }
    }

    // Add parish events (announcements, masses, etc.)
    const { data: parishEvents, error } = await supabase.from('parish_events').select('*')

    if (parishEvents && !error) {
      const events = parishEvents.map((event) => ({
        id: event.id,
        date: event.date,
        time: event.time,
        title: event.title,
        location: 'Parish',
        type: event.type,
        color: getEventColor(event.type),
        gradient: getEventGradient(event.type),
        status: 'confirmed',
        description: event.description,
      }))
      allEvents.push(...events)
    }

    // Sort events by date and time
    calendarEvents.value = allEvents.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateA - dateB
    })

    updateSelectedDateEvents()
  } catch (error) {
    console.error('Error loading calendar events:', error)
  }
}

// Enhanced event dates function for calendar
const eventDates = computed(() => {
  return (date) => {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0]
    const eventsOnDate = calendarEvents.value.filter((ev) => ev.date === dateStr)

    if (eventsOnDate.length === 0) return false

    // Return the color of the first event, or a special indicator for multiple
    if (eventsOnDate.length === 1) {
      return eventsOnDate[0].color
    }
    return '#9C27B0' // Multiple events color
  }
})

// Check if date has multiple events
const hasMultipleEvents = (date) => {
  const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0]
  const eventsOnDate = calendarEvents.value.filter((ev) => ev.date === dateStr)
  return eventsOnDate.length > 1
}

const getEventColor = (type) => {
  const category = eventCategories.value.find((cat) => cat.name === type)
  return category?.color || '#757575'
}

const getEventGradient = (type) => {
  const category = eventCategories.value.find((cat) => cat.name === type)
  return category?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

const updateSelectedDateEvents = () => {
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  selectedDateEvents.value = calendarEvents.value.filter((event) => event.date === dateStr)
}

// Enhanced approval function with audit logging
const approveBooking = async (booking) => {
  try {
    // Get current admin user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) throw userError

    // Update booking status
    const { error } = await supabase
      .from(booking.table)
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user.id,
      })
      .eq('id', booking.id)

    if (error) throw error

    // Log the approval action
    await supabase.from('audit_log').insert([
      {
        action: `Approved ${booking.type} booking`,
        user_id: user.id,
        old_role: 'pending',
        new_role: 'approved',
        changed_at: new Date().toISOString(),
      },
    ])

    await loadDashboardData()
    bookingDialog.value = false

    // Show success notification
    console.log(`${booking.type} booking approved successfully`)
  } catch (error) {
    console.error('Error approving booking:', error)
  }
}

// Enhanced denial function with audit logging
const denyBooking = async (booking) => {
  try {
    // Get current admin user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) throw userError

    // Update booking status
    const { error } = await supabase
      .from(booking.table)
      .update({
        status: 'denied',
        denied_at: new Date().toISOString(),
        denied_by: user.id,
      })
      .eq('id', booking.id)

    if (error) throw error

    // Log the denial action
    await supabase.from('audit_log').insert([
      {
        action: `Denied ${booking.type} booking`,
        user_id: user.id, Login to continue using

continue

Copy message
Edit message

BLACKBOXAI

Working on file update.
I'll continue with the implementation of the modern redesign into your Vue component:

vue

Run
Copy code
<template>
  <PreloaderView />
  <AdminHeader>
    <template #content>
      <!-- Animated Background -->
      <div class="animated-bg"></div>
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>

      <v-container fluid class="pa-4 pa-md-8">
        <!-- Header Section -->
        <div class="glass-card pa-6 mb-8">
          <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center gap-6">
            <div>
              <h1 class="header-gradient mb-2">Admin Dashboard</h1>
              <p class="text-grey-darken-1 text-h6">Parish Information Management System</p>
            </div>

            <div class="d-flex gap-3 flex-wrap">
              <!-- Notification Button -->
              <v-btn
                color="secondary"
                variant="outlined"
                @click="showNotifications"
                size="large"
                class="position-relative"
              >
                <v-icon class="me-2">mdi-bell</v-icon>
                Notifications
                <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
              </v-btn>

              <!-- Create Event Button -->
              <v-btn
                color="primary"
                @click="eventDialog = true"
                size="large"
              >
                <v-icon class="me-2">mdi-calendar-plus</v-icon>
                Create Event
              </v-btn>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="d-flex gap-2 mt-8 overflow-x-auto">
            <v-btn
              :class="['nav-tab', currentView === 'overview' ? 'active' : '']"
              @click="currentView = 'overview'"
              variant="text"
            >
              <v-icon class="me-2">mdi-view-dashboard</v-icon>
              Overview
            </v-btn>
            <v-btn
              :class="['nav-tab', currentView === 'calendar' ? 'active' : '']"
              @click="currentView = 'calendar'"
              variant="text"
            >
              <v-icon class="me-2">mdi-calendar</v-icon>
              Calendar
            </v-btn>
            <v-btn
              :class="['nav-tab', currentView === 'bookings' ? 'active' : '']"
              @click="currentView = 'bookings'"
              variant="text"
            >
              <v-icon class="me-2">mdi-book-multiple</v-icon>
              Bookings
            </v-btn>
          </div>
        </div>

        <!-- Stats Grid -->
        <v-row class="mb-8">
          <v-col cols="12" md="3">
            <v-card class="stat-card" :style="{'--gradient-start': '#667eea', '--gradient-end': '#764ba2'}">
              <v-card-text class="text-center">
                <div class="stat-icon">
                  <v-icon color="white">mdi-book-multiple</v-icon>
                </div>
                <h2 class="stat-value">{{ stats.totalBookings }}</h2>
                <p class="text-grey-darken-1">Total Bookings</p>
                <div class="text-caption text-grey-darken-2 mt-2">
                  <span class="text-green">↑ {{ statsTrends.totalBookings.value }}%</span> from last month
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card class="stat-card" :style="{'--gradient-start': '#f093fb', '--gradient-end': '#f5576c'}">
              <v-card-text class="text-center">
                <div class="stat-icon">
                  <v-icon color="white">mdi-clock-alert</v-icon>
                </div>
                <h2 class="stat-value">{{ stats.pendingApprovals }}</h2>
                <p class="text-grey-darken-1">Pending Approvals</p>
                <div class="text-caption text-grey-darken-2 mt-2">
                  <span class="text-orange">● {{ statsTrends.pendingApprovals.urgent }} urgent</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card class="stat-card" :style="{'--gradient-start': '#4facfe', '--gradient-end': '#00f2fe'}">
              <v-card-text class="text-center">
                <div class="stat-icon">
                  <v-icon color="white">mdi-calendar-check</v-icon>
                </div>
                <h2 class="stat-value">{{ stats.upcomingEvents }}</h2>
                <p class="text-grey-darken-1">Upcoming Events</p>
                <div class="text-caption text-grey-darken-2 mt-2">
                  Next: {{ statsTrends.upcomingEvents.next }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card class="stat-card" :style="{'--gradient-start': '#43e97b', '--gradient-end': '#38f9d7'}">
              <v-card-text class="text-center">
                <div class="stat-icon">
                  <v-icon color="white">mdi-account-group</v-icon>
                </div>
                <h2 class="stat-value">{{ stats.totalMembers }}</h2>
                <p class="text-grey-darken-1">Parish Members</p>
                <div class="text-caption text-grey-darken-2 mt-2">
                  <span class="text-green">↑ {{ statsTrends.totalMembers.value }}</span> new this month
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Main Content Area -->
        <div v-if="currentView === 'overview'">
          <v-row>
            <!-- Calendar Section -->
            <v-col cols="12" lg="8">
              <v-card class="calendar-container glass-card mb-4">
                <v-card-title class="d-flex align-center">
                  <v-icon class="me-2 text-purple">mdi-calendar</v-icon>
                  Schedule Calendar
                </v-card-title>
                <v-card-text>
                  <v-date-picker
                    v-model="selectedDate"
                    @update:model-value="updateSelectedDateEvents"
                    show-adjacent-months
                    :event-color="eventDates"
                    class="calendar-picker"
                  />
                </v-card-text>
              </v-card>

              <!-- Quick Actions -->
              <v-row class="mt-4">
                <v-col cols="6" md="3" v-for="action in quickActions" :key="action.label">
                  <v-card class="quick-action" @click="action.click">
                    <v-card-text class="text-center">
                      <div class="quick-action-icon">
                        <v-icon>{{ action.icon }}</v-icon>
                      </div>
                      <div class="font-weight-semibold">{{ action.label }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <!-- Sidebar -->
            <v-col cols="12" lg="4">
              <!-- Today's Schedule -->
              <v-card class="glass-card mb-4">
                <v-card-title class="d-flex align-center">
                  <v-icon class="me-2 text-purple">mdi-calendar-today</v-icon>
                  Today's Schedule
                </v-card-title>
                <v-card-text>
                  <div v-if="selectedDateEvents.length === 0" class="text-center text-grey-darken-1 py-8">
                    <v-icon size="64" color="grey-lighten-2">mdi-calendar-blank</v-icon>
                    <p class="mt-3">No events scheduled</p>
                  </div>
                  <div v-else class="space-y-3">
                    <div
                      v-for="(event, index) in selectedDateEvents"
                      :key="index"
                      class="event-item"
                      :style="{ borderLeftColor: event.color }"
                    >
                      <div class="d-flex justify-space-between align-start">
                        <div>
                          <div class="font-weight-semibold">{{ event.title }}</div>
                          <div class="text-caption text-grey-darken-2">{{ event.location }}</div>
                        </div>
                        <div class="text-caption text-grey-darken-2">{{ event.time }}</div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Pending Approvals -->
              <v-card class="glass-card mb-4">
                <v-card-title class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon class="me-2 text-orange">mdi-clipboard-list</v-icon>
                    Pending Approvals
                  </div>
                  <v-chip color="orange" variant="outlined" size="small">
                    {{ pendingBookings.length }} pending
                  </v-chip>
                </v-card-title>
                <v-card-text>
                  <div v-if="pendingBookings.length === 0" class="text-center text-grey-darken-1 py-8">
                    <v-icon size="64" color="grey-lighten-2">mdi-check-all</v-icon>
                    <p class="mt-3">No pending approvals</p>
                  </div>
                  <div v-else class="space-y-3">
                    <div
                      v-for="(booking, index) in pendingBookings.slice(0, 3)"
                      :key="index"
                      class="booking-card"
                      :style="{ '--booking-color': getEventColor(booking.type) }"
                      @click="openBookingDetails(booking)"
                    >
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <div class="font-weight-semibold">{{ formatBookingDetails(booking).title }}</div>
                          <div class="text-caption text-grey-darken-2">{{ formatBookingDetails(booking).subtitle }}</div>
                          <div class="text-caption text-grey-darken-3 mt-1">
                            {{ formatBookingDetails(booking).date }}
                          </div>
                        </div>
                        <v-icon>mdi-chevron-right</v-icon>
                      </div>
                    </div>

                    <v-btn
                      variant="text"
                      color="purple"
                      class="w-100 text-center"
                      @click="currentView = 'bookings'"
                    >
                      View All Approvals →
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Recent Activity -->
              <v-card class="glass-card">
                <v-card-title class="d-flex align-center">
                  <v-icon class="me-2 text-green">mdi-history</v-icon>
                  Recent Activity
                </v-card-title>
                <v-card-text>
                  <div class="space-y-3">
                    <div
                      v-for="(activity, index) in recentActivity"
                      :key="index"
                      class="d-flex gap-3"
                    >
                      <div class="activity-icon" :class="`bg-${activity.color}-lighten-4`">
                        <v-icon :color="activity.color">{{ activity.icon }}</v-icon>
                      </div>
                      <div class="flex-1">
                        <div class="text-caption">{{ activity.text }}</div>
                        <div class="text-caption text-grey-darken-2">{{ activity.time }}</div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Calendar View -->
        <div v-if="currentView === 'calendar'">
          <v-card class="glass-card">
            <v-card-title>Full Calendar View</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="8">
                  <v-date-picker
                    v-model="selectedDate"
                    @update:model-value="updateSelectedDateEvents"
                    show-adjacent-months
                    :event-color="eventDates"
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
                      <template #prepend>
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
          <v-card class="glass-card">
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
                <template #[`item.type`]="{ item }">
                  <v-chip :color="getEventColor(item.type)" size="small">
                    {{ item.type }}
                  </v-chip>
                </template>
                <template #[`item.details`]="{ item }">
                  {{ formatBookingDetails(item).subtitle }}
                </template>
                <template #[`item.date`]="{ item }">
                  {{ formatBookingDetails(item).date }}
                </template>
                <template #[`item.time`]="{ item }">
                  {{ formatBookingDetails(item).time }}
                </template>
                <template #[`item.actions`]="{ item }">
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

      <!-- Notifications Dialog -->
      <v-dialog v-model="notificationDialog" max-width="600">
        <v-card class="glass-card">
          <v-card-title class="d-flex align-center">
            <v-icon class="me-2">mdi-bell</v-icon>
            Notifications
            <v-spacer />
            <v-chip color="red" size="small" v-if="unreadCount > 0">
              {{ unreadCount }} unread
            </v-chip>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-list v-if="notifications.length > 0">
              <v-list-item
                v-for="notification in notifications"
                :key="notification.id"
                @click="handleNotificationClick(notification.id)"
                :class="{ 'notification-unread': !notification.read }"
                class="notification-item"
              >
                <template #prepend>
                  <v-icon :color="notification.read ? 'grey' : 'primary'" size="small" class="me-3">
                    {{ notification.type === 'booking' ? 'mdi-calendar-plus' : 'mdi-information' }}
                  </v-icon>
                </template>
                <v-list-item-title>{{ notification.message }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ new Date(notification.timestamp).toLocaleString() }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-else class="text-center py-8 text-grey-darken-1">
              <v-icon size="64" color="grey-lighten-2">mdi-bell-outline</v-icon>
              <p class="mt-3">No notifications yet</p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="notificationDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Event Creation Dialog -->
      <v-dialog v-model="eventDialog" max-width="600">
        <v-card class="glass-card">
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
        <v-card class="glass-card" v-if="selectedBooking">
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
/* Animated Background */
.animated-bg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.animated-bg::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: moveGrid 20s linear infinite;
}

@keyframes moveGrid {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Floating Shapes */
.floating-shape {
  position: fixed;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
  pointer-events: none;
  z-index: -1;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%;
  top: 60%;
  right: 10%;
  animation-delay: 5s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 31% 69% 23% 77% / 67% 31% 69% 33%;
  bottom: 10%;
  left: 30%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(30px, -30px) rotate(90deg); }
  50% { transform: translate(-20px, 20px) rotate(180deg); }
  75% { transform: translate(-30px, -20px) rotate(270deg); }
}

/* Glass Morphism Cards */
.glass-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15) !important;
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.25) !important;
}

/* Header Styles */
.header-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  font-size: 2.5rem;
  letter-spacing: -0.02em;
}

/* Navigation Tabs */
.nav-tab {
  position: relative;
  padding: 12px 24px !important;
  border-radius: 12px !important;
  font-weight: 600;
  transition: all 0.3s ease;
  background: transparent !important;
  color: #6b7280 !important;
  text-transform: none !important;
}

.nav-tab:hover {
  background: rgba(103, 126, 234, 0.1) !important;
  color: #667eea !important;
}

.nav-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(103, 126, 234, 0.3) !important;
}

/* Stat Cards */
.stat-card {
  position: relative;
  overflow: hidden;
  padding: 30px;
  background: white !important;
  border-radius: 20px !important;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none !important;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 16px auto;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 8px;
}

/* Calendar Styles */
.calendar-container {
  padding: 24px;
  background: white !important;
  border-radius: 20px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
}

.calendar-picker {
  width: 100%;
  max-width: none;
}

/* Event List */
.event-item {
  padding: 16px;
  border-radius: 12px;
  background: #f9fafb;
  margin-bottom: 12px;
  border-left: 4px solid;
  transition: all 0.3s ease;
  cursor: pointer;
}

.event-item:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Notification Badge */
.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #f93b3b 0%, #ff6b6b 100%);
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(249, 59, 59, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Quick Actions */
.quick-action {
  background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%) !important;
  border-radius: 16px !important;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent !important;
}

.quick-action:hover {
  background: white !important;
  border-color: #667eea !important;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
}

.quick-action-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

/* Booking Card */
.booking-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.booking-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--booking-color);
}

.booking-card:hover {
  transform: translateX(8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

/* Activity Icon */
.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Text Colors */
.text-green { color: #10b981; }
.text-orange { color: #f59e0b; }
.text-purple { color: #8b5cf6; }

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

/* Responsive adjustments */
@media (max-width: 960px) {
  .header-gradient {
    font-size: 2rem;
  }

  .stat-value {
    font-size: 2rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
}

@media (max-width: 600px) {
  .header-gradient {
    font-size: 1.75rem;
  }

  .nav-tab {
    padding: 8px 16px !important;
    font-size: 0.875rem;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-value {
    font-size: 1.75rem;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

/* Space utilities */
.space-y-3 > * + * {
  margin-top: 12px;
}

.gap-3 {
  gap: 12px;
}

.position-relative {
  position: relative;
}

.flex-1 {
  flex: 1;
}
</style>
This implementation includes:

**Modern Glass Morphism Design ⬤




App Builder

Upload

Multi-Panel
Select Models
Follow us on


By using Blackbox you agree to the Terms and Privacy.

