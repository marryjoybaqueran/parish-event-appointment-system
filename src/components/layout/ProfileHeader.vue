<script setup>
import { supabase, formActionDefault } from '@/utils/supabase'
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

/* const getUser = async () => {
  const {
    data: {
      user: { user_metadata: data },
    },
  } = await supabase.auth.getUser()

  userData.value.email = metadata.email
  userData.value.fullname = metadata.fname + ' ' + metadata.lname
  userData.value.initials = getAvatarText(userData.value.fullname)
}*/

const getUser = async () => {
  const {
    data: {
      user: { user_metadata: metadata },
    },
  } = await supabase.auth.getUser()

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
}

onMounted(() => {
  getUser()
})
</script>

<template>
  <v-menu min-width="200px" rounded>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar color="deep-orange-lighten-1" size="large">
          <span class="text-h5">{{ user.initials }}</span>
        </v-avatar>
      </v-btn>
    </template>

    <v-card class="mt-1">
      <v-card-text>
        <v-list>
          <v-list-item :subtitle="userData.email" :title="userData.fullname">
            <template #prepend>
              <v-avatar color="orange-darken-3" size="large">
                <span class="text-h5">
                  {{
                    getAvatarText(authStore.userData.fname + ' ' + authStore.userData.lname)
                  }}</span
                >
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>

        <v-divider class="my-3"></v-divider>

        <v-btn prepend-icon="mdi-wrench" variant="plain" to="/account/settings">
          Account Settings
        </v-btn>

        <v-divider class="my-3"></v-divider>

        <v-btn
          prepend-icon="mdi-logout"
          variant="plain"
          @click="onLogout"
          :loading="formAction.formProcess"
          :disabled="formAction.formProcess"
        >
          Logout
        </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
