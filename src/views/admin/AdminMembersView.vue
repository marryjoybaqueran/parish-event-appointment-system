<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import AdminHeader from '@/components/layout/AdminHeader.vue'
import PreloaderView from '@/components/layout/PreloaderView.vue'
import { useAuthUserStore } from '@/stores/authUser.js'

const authUser = useAuthUserStore()

const loading = ref(true)
const members = ref([])
const selectedMember = ref(null)
const memberDialog = ref(false)
const addMemberDialog = ref(false)
const confirmDeleteDialog = ref(false)
const memberToDelete = ref(null)
const searchQuery = ref('')
const selectedRole = ref('all')
const sortBy = ref('created_at')
const sortOrder = ref('desc')

// New member form
const newMember = ref({
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  phone: '',
  role: 'user'
})

// Pagination
const page = ref(1)
const itemsPerPage = ref(10)
const totalMembers = ref(0)

// Loading states
const actionLoading = ref(false)
const deleteLoading = ref(false)

// Computed properties
const filteredMembers = computed(() => {
  let filtered = members.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(member =>
      member.email?.toLowerCase().includes(query) ||
      member.first_name?.toLowerCase().includes(query) ||
      member.last_name?.toLowerCase().includes(query) ||
      member.phone?.includes(query)
    )
  }

  // Filter by role
  if (selectedRole.value !== 'all') {
    filtered = filtered.filter(member => member.role === selectedRole.value)
  }

  return filtered
})

const paginatedMembers = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredMembers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredMembers.value.length / itemsPerPage.value)
})

const roleOptions = [
  { value: 'all', title: 'All Roles' },
  { value: 'user', title: 'User' },
  { value: 'admin', title: 'Administrator' },
  { value: 'moderator', title: 'Moderator' }
]

// Load members with their bookings
const loadMembers = async () => {
  try {
    loading.value = true

    // Get all users with their roles
    const { data: users, error: usersError } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role,
        created_at,
        updated_at
      `)
      .order(sortBy.value, { ascending: sortOrder.value === 'asc' })

    if (usersError) throw usersError


    // Load booking counts for each user
    const membersWithBookings = await Promise.all(
      users.map(async (user) => {
        try {
          // Get user profile data
          const { data: authUser } = await supabase.auth.admin.getUserById(user.user_id)

          // Count bookings for this user
          const [weddingCount, baptismCount, funeralCount, thanksgivingCount] = await Promise.all([
            supabase.from('wedding_bookings').select('id', { count: 'exact', head: true }).eq('user_id', user.user_id),
            supabase.from('baptism_bookings').select('id', { count: 'exact', head: true }).eq('user_id', user.user_id),
            supabase.from('funeral_bookings').select('id', { count: 'exact', head: true }).eq('user_id', user.user_id),
            supabase.from('thanksgiving_bookings').select('id', { count: 'exact', head: true }).eq('user_id', user.user_id)
          ])

          // Get recent bookings
          const [recentWeddings, recentBaptisms, recentFunerals, recentThanksgivings] = await Promise.all([
            supabase.from('wedding_bookings').select('id, created_at, bride_firstname, groom_firstname, is_approve').eq('user_id', user.user_id).order('created_at', { ascending: false }).limit(5),
            supabase.from('baptism_bookings').select('id, created_at, child_firstname, child_lastname, is_approved').eq('user_id', user.user_id).order('created_at', { ascending: false }).limit(5),
            supabase.from('funeral_bookings').select('id, created_at, deceased_firstname, deceased_lastname, is_approved').eq('user_id', user.user_id).order('created_at', { ascending: false }).limit(5),
            supabase.from('thanksgiving_bookings').select('id, created_at, participant_firstname, participant_lastname, is_approved').eq('user_id', user.user_id).order('created_at', { ascending: false }).limit(5)
          ])

          const totalBookings = (weddingCount.count || 0) + (baptismCount.count || 0) + (funeralCount.count || 0) + (thanksgivingCount.count || 0)

          const recentBookings = [
            ...(recentWeddings.data || []).map(b => ({ ...b, type: 'wedding', name: `${b.bride_firstname} & ${b.groom_firstname}`, approved: b.is_approve })),
            ...(recentBaptisms.data || []).map(b => ({ ...b, type: 'baptism', name: `${b.child_firstname} ${b.child_lastname}`, approved: b.is_approved })),
            ...(recentFunerals.data || []).map(b => ({ ...b, type: 'funeral', name: `${b.deceased_firstname} ${b.deceased_lastname}`, approved: b.is_approved })),
            ...(recentThanksgivings.data || []).map(b => ({ ...b, type: 'thanksgiving', name: `${b.participant_firstname} ${b.participant_lastname}`, approved: b.is_approved }))
          ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

          return {
            ...user,
            id: user.user_id,
            email: authUser?.user?.email || 'Unknown',
            first_name: authUser?.user?.user_metadata?.first_name || '',
            last_name: authUser?.user?.user_metadata?.last_name || '',
            phone: authUser?.user?.user_metadata?.phone || '',
            image_url: authUser?.user?.user_metadata?.image_url || '',
            last_sign_in: authUser?.user?.last_sign_in_at,
            bookings: {
              total: totalBookings,
              wedding: weddingCount.count || 0,
              baptism: baptismCount.count || 0,
              funeral: funeralCount.count || 0,
              thanksgiving: thanksgivingCount.count || 0,
              recent: recentBookings
            }
          }
        } catch (error) {
          console.error(`Error loading data for user ${user.user_id}:`, error)
          return {
            ...user,
            id: user.user_id,
            email: 'Error loading',
            first_name: '',
            last_name: '',
            phone: '',
            image_url: '',
            bookings: { total: 0, wedding: 0, baptism: 0, funeral: 0, thanksgiving: 0, recent: [] }
          }
        }
      })
    )

    members.value = membersWithBookings
    totalMembers.value = membersWithBookings.length

  } catch (error) {
    console.error('Error loading members:', error)
    authUser.addNotification({
      message: 'Failed to load members',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

// View member details
const viewMemberDetails = (member) => {
  selectedMember.value = member
  memberDialog.value = true
}

// Add new member
const addMember = async () => {
  try {
    actionLoading.value = true

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: newMember.value.email,
      password: newMember.value.password,
      user_metadata: {
        first_name: newMember.value.first_name,
        last_name: newMember.value.last_name,
        phone: newMember.value.phone
      }
    })

    if (authError) throw authError

    // Add user role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert([{
        user_id: authData.user.id,
        role: newMember.value.role
      }])

    if (roleError) throw roleError

    authUser.addNotification({
      message: `Member ${newMember.value.first_name} ${newMember.value.last_name} added successfully`,
      type: 'success'
    })

    addMemberDialog.value = false
    resetNewMemberForm()
    await loadMembers()

  } catch (error) {
    console.error('Error adding member:', error)
    authUser.addNotification({
      message: `Failed to add member: ${error.message}`,
      type: 'error'
    })
  } finally {
    actionLoading.value = false
  }
}

// Update member role
const updateMemberRole = async (memberId, newRole) => {
  try {
    actionLoading.value = true

    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', memberId)

    if (error) throw error

    authUser.addNotification({
      message: 'Member role updated successfully',
      type: 'success'
    })

    await loadMembers()

  } catch (error) {
    console.error('Error updating member role:', error)
    authUser.addNotification({
      message: 'Failed to update member role',
      type: 'error'
    })
  } finally {
    actionLoading.value = false
  }
}

// Delete member
const deleteMember = async () => {
  try {
    deleteLoading.value = true

    // Delete user role first
    const { error: roleError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', memberToDelete.value.id)

    if (roleError) throw roleError

    // Delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(memberToDelete.value.id)

    if (authError) throw authError

    authUser.addNotification({
      message: `Member ${memberToDelete.value.first_name} ${memberToDelete.value.last_name} deleted successfully`,
      type: 'success'
    })

    confirmDeleteDialog.value = false
    memberToDelete.value = null
    await loadMembers()

  } catch (error) {
    console.error('Error deleting member:', error)
    authUser.addNotification({
      message: 'Failed to delete member',
      type: 'error'
    })
  } finally {
    deleteLoading.value = false
  }
}

// Confirm delete
const confirmDelete = (member) => {
  memberToDelete.value = member
  confirmDeleteDialog.value = true
}

// Reset new member form
const resetNewMemberForm = () => {
  newMember.value = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'user'
  }
}

// Get role color
const getRoleColor = (role) => {
  switch (role) {
    case 'admin': return 'red'
    case 'moderator': return 'orange'
    case 'user': return 'blue'
    default: return 'grey'
  }
}

// Get booking type color
const getBookingTypeColor = (type) => {
  switch (type) {
    case 'wedding': return '#667eea'
    case 'baptism': return '#4facfe'
    case 'funeral': return '#424242'
    case 'thanksgiving': return '#FF5722'
    default: return '#757575'
  }
}

onMounted(async () => {
  await loadMembers()
})
</script>

<template>
  <PreloaderView v-if="loading" />
  <AdminHeader v-else>
    <template #content>
      <v-container fluid class="pa-4 pa-md-8">
        <!-- Header Section -->
        <div class="glass-card pa-4 pa-md-6 mb-6">
          <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center ga-4">
            <div>
              <h1 class="header-gradient mb-2 text-h4 text-md-h3">Members Management</h1>
              <p class="text-subtitle-1 text-grey">
                Manage parish members, roles, and view their booking history
              </p>
            </div>

            <v-btn
              color="primary"
              size="large"
              @click="addMemberDialog = true"
              prepend-icon="mdi-account-plus"
            >
              Add Member
            </v-btn>
          </div>
        </div>

        <!-- Filters and Search -->
        <v-card class="glass-card mb-6">
          <v-card-text class="pa-4 pa-md-6">
            <v-row align="center">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Search members..."
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="selectedRole"
                  :items="roleOptions"
                  label="Filter by Role"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-select
                  v-model="itemsPerPage"
                  :items="[5, 10, 20, 50]"
                  label="Per page"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="3" class="d-flex justify-end">
                <v-chip color="primary" variant="outlined" class="me-2">
                  <v-icon start>mdi-account-group</v-icon>
                  {{ totalMembers }} Total Members
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Members Table -->
        <v-card class="glass-card">
          <v-data-table
            :items="paginatedMembers"
            :headers="[
              { title: 'Member', key: 'member', sortable: false },
              { title: 'Email', key: 'email' },
              { title: 'Role', key: 'role' },
              { title: 'Total Bookings', key: 'bookings.total' },
              { title: 'Last Sign In', key: 'last_sign_in' },
              { title: 'Joined', key: 'created_at' },
              { title: 'Actions', key: 'actions', sortable: false }
            ]"
            class="members-table"
            :loading="loading"
            hide-default-footer
          >
            <!-- Member Info -->
            <template #[`item.member`]="{ item }">
              <div class="d-flex align-center ga-3">
                <v-avatar size="40" :color="item.image_url ? undefined : 'primary'">
                  <v-img v-if="item.image_url" :src="item.image_url" />
                  <span v-else class="text-white font-weight-bold">
                    {{ (item.first_name?.[0] || '') + (item.last_name?.[0] || '') }}
                  </span>
                </v-avatar>
                <div>
                  <div class="font-weight-semibold">
                    {{ item.first_name }} {{ item.last_name }}
                  </div>
                  <div class="text-caption text-grey-darken-2" v-if="item.phone">
                    {{ item.phone }}
                  </div>
                </div>
              </div>
            </template>

            <!-- Email -->
            <template #[`item.email`]="{ item }">
              <div class="text-body-2">{{ item.email }}</div>
            </template>

            <!-- Role -->
            <template #[`item.role`]="{ item }">
              <v-chip
                :color="getRoleColor(item.role)"
                size="small"
                variant="tonal"
                class="text-capitalize"
              >
                <v-icon start size="14">
                  {{ item.role === 'admin' ? 'mdi-shield-crown' :
                     item.role === 'moderator' ? 'mdi-shield-check' : 'mdi-account' }}
                </v-icon>
                {{ item.role }}
              </v-chip>
            </template>

            <!-- Total Bookings -->
            <template #[`item.bookings.total`]="{ item }">
              <v-chip color="purple" variant="outlined" size="small">
                {{ item.bookings.total }}
              </v-chip>
            </template>

            <!-- Last Sign In -->
            <template #[`item.last_sign_in`]="{ item }">
              <div class="text-body-2">
                {{ item.last_sign_in ? new Date(item.last_sign_in).toLocaleDateString() : 'Never' }}
              </div>
            </template>

            <!-- Joined Date -->
            <template #[`item.created_at`]="{ item }">
              <div class="text-body-2">
                {{ new Date(item.created_at).toLocaleDateString() }}
              </div>
            </template>

            <!-- Actions -->
            <template #[`item.actions`]="{ item }">
              <div class="d-flex ga-1">
                <v-btn
                  icon="mdi-eye"
                  variant="text"
                  size="small"
                  color="primary"
                  @click="viewMemberDetails(item)"
                />
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      variant="text"
                      size="small"
                      v-bind="props"
                    />
                  </template>
                  <v-list density="compact">
                    <v-list-item @click="updateMemberRole(item.id, item.role === 'admin' ? 'user' : 'admin')">
                      <template #prepend>
                        <v-icon>{{ item.role === 'admin' ? 'mdi-account-arrow-down' : 'mdi-account-arrow-up' }}</v-icon>
                      </template>
                      <v-list-item-title>
                        {{ item.role === 'admin' ? 'Remove Admin' : 'Make Admin' }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="confirmDelete(item)" class="text-red">
                      <template #prepend>
                        <v-icon color="red">mdi-delete</v-icon>
                      </template>
                      <v-list-item-title>Delete Member</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </template>
          </v-data-table>

          <!-- Pagination -->
          <v-card-actions class="justify-center pa-6">
            <v-pagination
              v-model="page"
              :length="totalPages"
              :total-visible="7"
              circle
              color="primary"
            />
          </v-card-actions>
        </v-card>

        <!-- Member Details Dialog -->
        <v-dialog v-model="memberDialog" max-width="900" scrollable>
          <v-card v-if="selectedMember" class="glass-card">
            <v-card-title class="d-flex align-center justify-space-between pa-6">
              <div class="d-flex align-center ga-4">
                <v-avatar size="60" :color="selectedMember.image_url ? undefined : 'primary'">
                  <v-img v-if="selectedMember.image_url" :src="selectedMember.image_url" />
                  <span v-else class="text-white text-h5">
                    {{ (selectedMember.first_name?.[0] || '') + (selectedMember.last_name?.[0] || '') }}
                  </span>
                </v-avatar>
                <div>
                  <h2 class="text-h5">{{ selectedMember.first_name }} {{ selectedMember.last_name }}</h2>
                  <v-chip :color="getRoleColor(selectedMember.role)" size="small" variant="tonal" class="text-capitalize">
                    {{ selectedMember.role }}
                  </v-chip>
                </div>
              </div>
              <v-btn icon="mdi-close" variant="text" @click="memberDialog = false" />
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-6">
              <v-row>
                <!-- Basic Information -->
                <v-col cols="12" md="6">
                  <h3 class="text-h6 mb-4">Basic Information</h3>
                  <div class="space-y-3">
                    <div>
                      <div class="text-caption text-grey-darken-1">Email</div>
                      <div class="text-body-1">{{ selectedMember.email }}</div>
                    </div>
                    <div v-if="selectedMember.phone">
                      <div class="text-caption text-grey-darken-1">Phone</div>
                      <div class="text-body-1">{{ selectedMember.phone }}</div>
                    </div>
                    <div>
                      <div class="text-caption text-grey-darken-1">Member Since</div>
                      <div class="text-body-1">{{ new Date(selectedMember.created_at).toLocaleDateString() }}</div>
                    </div>
                    <div>
                      <div class="text-caption text-grey-darken-1">Last Sign In</div>
                      <div class="text-body-1">
                        {{ selectedMember.last_sign_in ? new Date(selectedMember.last_sign_in).toLocaleString() : 'Never' }}
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- Booking Statistics -->
                <v-col cols="12" md="6">
                  <h3 class="text-h6 mb-4">Booking Statistics</h3>
                  <v-row>
                    <v-col cols="6" sm="3" v-for="(count, type) in {
                      wedding: selectedMember.bookings.wedding,
                      baptism: selectedMember.bookings.baptism,
                      funeral: selectedMember.bookings.funeral,
                      thanksgiving: selectedMember.bookings.thanksgiving
                    }" :key="type">
                      <v-card variant="outlined" class="text-center pa-3">
                        <div class="text-h6" :style="{ color: getBookingTypeColor(type) }">
                          {{ count }}
                        </div>
                        <div class="text-caption text-capitalize">{{ type }}</div>
                      </v-card>
                    </v-col>
                  </v-row>
                  <div class="text-center mt-3">
                    <v-chip color="primary" variant="outlined">
                      Total: {{ selectedMember.bookings.total }} Bookings
                    </v-chip>
                  </div>
                </v-col>

                <!-- Recent Bookings -->
                <v-col cols="12" v-if="selectedMember.bookings.recent.length > 0">
                  <h3 class="text-h6 mb-4">Recent Bookings</h3>
                  <v-list class="pa-0">
                    <v-list-item
                      v-for="booking in selectedMember.bookings.recent"
                      :key="`${booking.type}-${booking.id}`"
                      class="pa-3 mb-2"
                      rounded="lg"
                      variant="outlined"
                    >
                      <template #prepend>
                        <v-chip
                          :color="getBookingTypeColor(booking.type)"
                          size="small"
                          variant="tonal"
                          class="me-3 text-capitalize"
                        >
                          {{ booking.type }}
                        </v-chip>
                      </template>

                      <v-list-item-title>{{ booking.name }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ new Date(booking.created_at).toLocaleDateString() }}
                      </v-list-item-subtitle>

                      <template #append>
                        <v-chip
                          :color="booking.approved ? 'green' : 'orange'"
                          size="small"
                          variant="tonal"
                        >
                          {{ booking.approved ? 'Approved' : 'Pending' }}
                        </v-chip>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider />

            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn variant="outlined" @click="memberDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Add Member Dialog -->
        <v-dialog v-model="addMemberDialog" max-width="600" persistent>
          <v-card class="glass-card">
            <v-card-title class="pa-6">
              <h2 class="text-h5">Add New Member</h2>
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-6">
              <v-form @submit.prevent="addMember">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="newMember.first_name"
                      label="First Name"
                      variant="outlined"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="newMember.last_name"
                      label="Last Name"
                      variant="outlined"
                      required
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newMember.email"
                      label="Email"
                      type="email"
                      variant="outlined"
                      required
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newMember.password"
                      label="Password"
                      type="password"
                      variant="outlined"
                      required
                      hint="Minimum 6 characters"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newMember.phone"
                      label="Phone (optional)"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="newMember.role"
                      :items="[
                        { value: 'user', title: 'User' },
                        { value: 'moderator', title: 'Moderator' },
                        { value: 'admin', title: 'Administrator' }
                      ]"
                      label="Role"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-divider />

            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn variant="outlined" @click="addMemberDialog = false; resetNewMemberForm()">
                Cancel
              </v-btn>
              <v-btn color="primary" @click="addMember" :loading="actionLoading">
                Add Member
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="confirmDeleteDialog" max-width="500" persistent>
          <v-card v-if="memberToDelete" class="glass-card">
            <v-card-title class="pa-6 text-error">
              <v-icon class="me-2" color="error">mdi-alert-circle</v-icon>
              Confirm Delete
            </v-card-title>

            <v-divider />

            <v-card-text class="pa-6">
              <p class="mb-4">
                Are you sure you want to delete <strong>{{ memberToDelete.first_name }} {{ memberToDelete.last_name }}</strong>?
              </p>
              <v-alert type="warning" variant="tonal" class="mb-4">
                <v-alert-title>Warning!</v-alert-title>
                This action will permanently delete:
                <ul class="mt-2">
                  <li>User account and profile</li>
                  <li>All associated booking records</li>
                  <li>User role permissions</li>
                </ul>
                <p class="mt-2 text-body-2">This action cannot be undone.</p>
              </v-alert>
            </v-card-text>

            <v-divider />

            <v-card-actions class="pa-6">
              <v-spacer />
              <v-btn variant="outlined" @click="confirmDeleteDialog = false; memberToDelete = null">
                Cancel
              </v-btn>
              <v-btn color="error" @click="deleteMember" :loading="deleteLoading">
                Delete Member
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
  </AdminHeader>
</template>

<style scoped>
/* Glass card effect */
.glass-card {
  background: rgba(var(--v-theme-surface), 0.85) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
}

.v-theme--dark .glass-card {
  background: rgba(var(--v-theme-surface), 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Header gradient */
.header-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Members table styling */
.members-table {
  background: transparent !important;
}

.members-table :deep(.v-data-table__wrapper) {
  background: transparent !important;
}

.members-table :deep(tr:hover) {
  background: rgba(var(--v-theme-primary), 0.05) !important;
}

.members-table :deep(th) {
  background: rgba(var(--v-theme-surface-variant), 0.3) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.2) !important;
  font-weight: 600 !important;
}

.members-table :deep(td) {
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.1) !important;
}

/* Spacing utilities */
.space-y-3 > * + * {
  margin-top: 12px;
}

/* Responsive text sizing */
@media (max-width: 960px) {
  .header-gradient {
    font-size: 1.75rem !important;
  }
}

@media (max-width: 600px) {
  .header-gradient {
    font-size: 1.5rem !important;
  }
}

/* Loading overlay */
.v-data-table--loading :deep(.v-data-table__wrapper) {
  position: relative;
}

.v-data-table--loading :deep(.v-data-table__wrapper):after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(2px);
}

/* Enhanced chips */
.v-chip {
  font-weight: 500;
}

.v-chip--variant-tonal {
  backdrop-filter: blur(10px);
}

/* Dialog styling */
.v-dialog > .v-overlay__content > .v-card {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
}

.v-theme--dark .v-dialog > .v-overlay__content > .v-card {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
}

/* Form styling */
.v-text-field :deep(.v-field) {
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-surface), 0.6) !important;
}

.v-select :deep(.v-field) {
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-surface), 0.6) !important;
}

/* Button hover effects */
.v-btn:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Avatar styling */
.v-avatar {
  border: 2px solid rgba(var(--v-theme-outline), 0.1);
}

/* List item styling */
.v-list-item {
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.05) !important;
  transform: translateX(4px);
}

/* Alert styling */
.v-alert {
  backdrop-filter: blur(10px);
}

/* Pagination styling */
.v-pagination :deep(.v-btn) {
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-surface), 0.6) !important;
}

.v-pagination :deep(.v-btn--active) {
  background: rgb(var(--v-theme-primary)) !important;
}

</style>
