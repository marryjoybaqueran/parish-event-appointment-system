<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formMode = ref('login')

const loginDataDefault = {
  email: '',
  password: '',
  userType: 'user',
}

const registerDataDefault = {
  fname: '',
  lname: '',
  email: '',
  gender: '',
  address: '',
  number: '',
  password: '',
  password_confirmation: '',
}

const userTypeOptions = [
  {
    value: 'user',
    title: 'User',
    icon: 'mdi-account',
    description: 'Access member portal',
    color: 'primary',
  },
  {
    value: 'admin',
    title: 'Admin',
    icon: 'mdi-shield-account',
    description: 'Administrative access',
    color: 'warning',
  },
]

const loginData = ref({ ...loginDataDefault })
const registerData = ref({ ...registerDataDefault })

const formAction = ref({ ...formActionDefault })

const isPasswordVisible = ref(false)
const isPasswordConfirmationVisible = ref(false)
const refVform = ref()

const selectedUserType = computed(() =>
  userTypeOptions.find((option) => option.value === loginData.value.userType),
)

const isLoginMode = computed(() => formMode.value === 'login')

const switchMode = (mode) => {
  formMode.value = mode
  formAction.value = { ...formActionDefault }
  refVform.value?.resetValidation()
}

const onLoginSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.value.email,
      password: loginData.value.password,
    })

    if (error) {
      formAction.value.formErrorMessage = error.message
      formAction.value.formStatus = error.status
      return
    }

    const { data: roleData, error: roleError } = await supabase.rpc('get_user_role', {
      check_user_id: data.user.id,
    })

    if (roleError) {
      console.error('Role fetch error:', roleError)
      formAction.value.formErrorMessage = 'Could not determine user role'
      return
    }

    const actualUserRole = roleData?.trim().toLowerCase()
    const selectedUserType = loginData.value.userType

    if (selectedUserType === 'admin' && actualUserRole !== 'admin') {
      formAction.value.formErrorMessage = 'Access denied: You do not have admin privileges'
      return
    }

    formAction.value.formSuccessMessage = 'Successfully Logged in!'

    switch (selectedUserType) {
      case 'admin':
        router.replace('/admin-dashboard')
        break
      default:
        router.replace('/homepage')
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    formAction.value.formErrorMessage = 'An unexpected error occurred'
  } finally {
    refVform.value?.reset()
    loginData.value = { ...loginDataDefault }
    formAction.value.formProcess = false
  }
}

const onRegisterSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: registerData.value.email,
    password: registerData.value.password,
    options: {
      data: {
        fname: registerData.value.fname,
        lname: registerData.value.lname,
        gender: registerData.value.gender,
        address: registerData.value.address,
        number: registerData.value.number,
      },
    },
  })

  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Successfully Registered Account!'
    setTimeout(() => {
      switchMode('login')
      loginData.value.email = registerData.value.email
    }, 2000)
  }

  refVform.value?.reset()
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) {
      if (isLoginMode.value) {
        onLoginSubmit()
      } else {
        onRegisterSubmit()
      }
    }
  })
}

// Social sign-in handlers (use Supabase OAuth)
const signInWithGoogle = async () => {
  console.log('Signing in with Google...')
}

const signInWithFacebook = async () => {
  console.log('Signing in with Facebook...')
}
</script>

<template>
  <div class="login-container">
    <AlertNotification
      :form-success-message="formAction.formSuccessMessage"
      :form-error-message="formAction.formErrorMessage"
    />

  <v-form class="mt-5" ref="refVform" @submit.prevent="onFormSubmit">
    <!-- Welcome header with animation -->
    <div class="text-center mb-6">
      <v-avatar size="64" class="mb-4 welcome-avatar">
        <v-icon size="40" color="primary">mdi-church</v-icon>
      </v-avatar>
      <h2 class="text-h4 text-primary mb-2 welcome-text">Welcome Back!</h2>
      <p class="text-body-2 text-medium-emphasis">Sign in to continue your spiritual journey</p>
    </div>

    <!-- Email field with enhanced styling -->
    <div class="text-subtitle-1 text-medium-emphasis mb-2 d-flex align-center">
      <v-icon size="small" class="mr-2">mdi-email</v-icon>
      Email Address
    </div>

    <v-text-field
      v-model="formData.email"
      density="comfortable"
      placeholder="Enter your email address"
      prepend-inner-icon="mdi-email-outline"
      :rules="[requiredValidator, emailValidator]"
      :counter="50"
      variant="outlined"
      color="primary"
      class="mb-3 animated-field"
      hide-details="auto"
    ></v-text-field>

    <!-- Password field with enhanced styling -->
    <div
      class="text-subtitle-1 text-medium-emphasis mb-2 d-flex align-center justify-space-between"
    >
      <div class="d-flex align-center">
        <v-icon size="small" class="mr-2">mdi-lock</v-icon>
        Password
      </div>
      <v-btn variant="text" size="small" class="text-caption text-primary" @click="() => {}">
        Forgot password?
      </v-btn>
    </div>

    <v-text-field
      v-model="formData.password"
      density="comfortable"
      :rules="[requiredValidator]"
      counter="20"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      color="primary"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
      :type="isPasswordVisible ? 'text' : 'password'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      class="mb-4 animated-field"
      hide-details="auto"
    ></v-text-field>

    <!-- Enhanced login button with ripple effect -->
    <v-hover v-slot:default="{ isHovering, props }" close-delay="200">
      <v-btn
        v-bind="props"
        :elevation="isHovering ? 8 : 2"
        size="large"
        variant="elevated"
        color="primary"
        type="submit"
        :disabled="formAction.formProcess"
        :loading="formAction.formProcess"
        block
        class="login-btn mb-4"
        rounded="lg"
      >
        <v-icon left class="mr-2">mdi-login</v-icon>
        <span class="text-h6">Sign In</span>
      </v-btn>
    </v-hover>

    <!-- Social login divider -->
    <v-divider class="my-4">
      <span class="text-caption text-medium-emphasis px-3">Or continue with</span>
    </v-divider>

    <!-- Social login icons (replacing buttons) -->
    <v-row class="ma-0 justify-center">
      <v-col cols="6" class="pa-1 d-flex justify-center">
        <v-icon
          size="36"
          class="social-icon google--text"
          role="button"
          tabindex="0"
          @click="signInWithGoogle"
          @keyup.enter="signInWithGoogle"
          title="Sign in with Google"
        >
          mdi-google
        </v-icon>
      </v-col>
      <v-col cols="6" class="pa-1 d-flex justify-center">
        <v-icon
          size="36"
          class="social-icon facebook--text"
          role="button"
          tabindex="0"
          @click="signInWithFacebook"
          @keyup.enter="signInWithFacebook"
          title="Sign in with Facebook"
        >
          mdi-facebook
        </v-icon>
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped>
.welcome-avatar {
  animation: pulse 2s infinite;
  transition: all 0.3s ease;
}

.welcome-text {
  animation: slideInDown 0.8s ease-out;
}

.animated-field {
  transition: all 0.3s ease;
}

.animated-field:hover {
  transform: translateY(-2px);
}

.login-btn {
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #1976d2, #42a5f5) !important;
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3) !important;
}

.social-btn {
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
}

.social-icon:hover,
.social-icon:focus {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(16, 24, 40, 0.08);
}

.google--text {
  color: #db4437; /* Google red */
}

.facebook--text {
  color: #1877f2; /* Facebook blue */
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced focus states */
.v-field--focused {
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2) !important;
}

/* Loading spinner enhancement */
.v-btn--loading .v-btn__content {
  opacity: 0.6;
}
</style>
