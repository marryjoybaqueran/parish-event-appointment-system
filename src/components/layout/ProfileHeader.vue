<!--<script setup>
import { supabase, formActionDefault, getUserInformation } from '@/utils/supabase.js'
import { useAuthUserStore } from '@/stores/authUser'
import { getAvatarText } from '@/utils/helpers'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

// Utilize pre-defined vue functions
const router = useRouter()

// Use Pinia Store
const authStore = useAuthUserStore()

const userData = ref({
  initials: '',
  email: '',
  fullname: '',
})

const formAction = ref({
  ...formActionDefault,
})

// Logout Functionality
const onLogout = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  // Get supabase logout functionality
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error during logout:', error)
    return
  }
  formAction.value.formProcess = false
  // Redirect to homepage
  router.replace('/')
}

const props = defineProps({
  onLogout: {
    type: Function,
    required: true,
  },
})

const getUser = async () => {
  const metadata = await getUserInformation()

  userData.value.email = metadata.email
  userData.value.fullname = metadata.fname + ' ' + metadata.lname
  userData.value.initials = getAvatarText(userData.value.fullname)
}
/*
const getUser = async () => {
  const {
    data: {
      user: { user_metadata: metadata },
    },
  } = await supabase.auth.getUser()

  //const metadata = getUserInformation()
  const fullname = metadata.fname + ' ' + metadata.lname

  userData.value.email = metadata.email
  userData.value.fullname = fullname
  userData.value.initials = getAvatarText(fullname)

  // update the global authStore userData
  authStore.userData = {
    fname: metadata.fname,
    lname: metadata.lname,
    email: metadata.email,
  }
}*/

onMounted(() => {
  getUser()
})

import { useDisplay } from 'vuetify'

const { mdAndDown } = useDisplay()
</script>
-->
<script setup>
import { supabase, formActionDefault, getUserInformation } from '@/utils/supabase.js'
import { useAuthUserStore } from '@/stores/authUser'
import { getAvatarText } from '@/utils/helpers'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'

// Router & store
const router = useRouter()
const authStore = useAuthUserStore()
const { mdAndDown } = useDisplay()

// Reactive form status
const formAction = ref({
  ...formActionDefault,
})

// User data
const userData = ref({
  initials: '',
  email: '',
  fullname: '',
})

// Fetch user data
const getUser = async () => {
  const metadata = await getUserInformation()

  if (metadata) {
    const fullname = metadata.fname + ' ' + metadata.lname
    userData.value.email = metadata.email
    userData.value.fullname = fullname
    userData.value.initials = getAvatarText(fullname)

    // Also update store
    authStore.userData = {
      fname: metadata.fname,
      lname: metadata.lname,
      email: metadata.email,
    }
  } else {
    console.warn('User metadata is undefined or null')
  }
}

// Logout function
const handleLogout = async () => {
  formAction.value = { ...formActionDefault, formProcess: true }

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error during logout:', error)
    formAction.value.formProcess = false
    return
  }

  formAction.value.formProcess = false
  router.replace('/')
}

// Fetch user info on mount
onMounted(() => {
  getUser()
})
</script>

<template>
  <div>
    <!-- MOBILE VIEW -->
    <div v-if="mdAndDown">
      <v-list>
        <v-list-item :subtitle="userData.email" :title="userData.fullname">
          <template #prepend>
            <v-avatar color="orange-darken-3" size="small">
              <span class="text-5">
                {{ getAvatarText(authStore.userData.fname + ' ' + authStore.userData.lname) }}
              </span>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <!-- <v-btn prepend-icon="mdi-wrench" variant="plain" to="/account/settings">
            Account Settings
          </v-btn>-->

      <v-btn
        flat
        prepend-icon="mdi-logout"
        @click="onLogout"
        :loading="formAction.formProcess"
        :disabled="formAction.formProcess"
        class="pl-6"
      >
        Logout
      </v-btn>
      <v-divider></v-divider>
    </div>

    <!-- DESKTOP DROPDOWN -->
    <v-menu v-else min-width="100px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar color="deep-orange-lighten-1" class="profile-size">
            <span class="profile-text">{{ userData.initials }}</span>
          </v-avatar>
        </v-btn>
      </template>

      <v-card class="mt-1">
        <v-card-text>
          <v-list>
            <v-list-item :subtitle="userData.email" :title="userData.fullname">
              <template #prepend>
                <v-avatar color="orange-darken-3" size="large">
                  <span class="text-5">
                    {{ getAvatarText(authStore.userData.fname + ' ' + authStore.userData.lname) }}
                  </span>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>

          <!-- <v-btn prepend-icon="mdi-wrench" variant="plain" to="/account/settings">
            Account Settings
          </v-btn>-->

          <!-- <v-btn
            prepend-icon="mdi-logout"
            variant="plain"
            @click="onLogout"
            :loading="formAction.formProcess"
            :disabled="formAction.formProcess"
          >
            Logout
          </v-btn>-->
          <v-btn
            prepend-icon="mdi-logout"
            variant="plain"
            @click="handleLogout"
            :loading="formAction.formProcess"
            :disabled="formAction.formProcess"
          >
            Logout
          </v-btn>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>
