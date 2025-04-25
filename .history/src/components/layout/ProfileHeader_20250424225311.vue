<script setup>
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
