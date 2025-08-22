<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import { requiredValidator, emailValidator } from '@/utils/validators'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Utilize pre-defined vue functions
const router = useRouter()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})

const formAction = ref({
  ...formActionDefault,
})

const isPasswordVisible = ref(false)
const refVform = ref()
/*
const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })

  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Successfully Logged Account!'
    router.replace('/homepage')
  }

  refVform.value?.reset()
  formAction.value.formProcess = false
}*/

const onSubmit = async () => {
  // Reset form state
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  try {
    // Authenticate user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.value.email,
      password: formData.value.password,
    })

    if (error) {
      // Handle authentication error
      formAction.value.formErrorMessage = error.message
      formAction.value.formStatus = error.status
      return
    }

    // Fetch user role more efficiently
    const { data: roleData, error: roleError } = await supabase.rpc('get_user_role', {
      check_user_id: data.user.id,
    })
    if (roleError) {
      console.error('Role fetch error:', roleError)
      // Fallback to default user role if fetch fails
      formAction.value.formErrorMessage = 'Could not determine user role'
      return
    }

    // Determine routing based on role
    const userRole = roleData?.trim().toLowerCase()
    formAction.value.formSuccessMessage = 'Successfully Logged in!'

    switch (userRole) {
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
    // Always reset form and stop processing
    refVform.value?.reset()
    formAction.value.formProcess = false
  }
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

// Social sign-in handlers (use Supabase OAuth)
const signInWithGoogle = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
      if (error) {
        formAction.value.formErrorMessage = error.message
      }
      // Supabase will handle the redirect flow for OAuth providers
    } catch (err) {
      console.error(err)
      formAction.value.formErrorMessage = 'Social sign-in failed'
    } finally {
      formAction.value.formProcess = false
    }
}

const signInWithFacebook = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' })
      if (error) {
        formAction.value.formErrorMessage = error.message
      }
    } catch (err) {
      console.error(err)
      formAction.value.formErrorMessage = 'Social sign-in failed'
    } finally {
      formAction.value.formProcess = false
    }
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>

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
    <div class="text-subtitle-1 text-medium-emphasis mb-2 d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon size="small" class="mr-2">mdi-lock</v-icon>
        Password
      </div>
      <v-btn 
        variant="text" 
        size="small" 
        class="text-caption text-primary" 
        @click="() => {}"
      >
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
  box-shadow: 0 8px 20px rgba(16,24,40,0.08);
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
