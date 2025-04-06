<script setup>
import { ref } from 'vue'

const email = ref(null)
const password = ref(null)
const visible = ref(false)

function requiredemail(v) {
  return !!v || 'Email is required'
}
function requiredpassword(v) {
  return !!v || 'Password is required'
}
</script>

<template>
  <v-form fast-fail @submit.prevent>
    <div><h2 class="text-center">Welcome!</h2></div>

    <div class="text-subtitle-1 text-medium-emphasis">Username</div>

    <v-text-field
      v-model="email"
      density="compact"
      placeholder="Email address"
      prepend-inner-icon="mdi-email-outline"
      :rules="[requiredemail]"
      :counter="50"
      variant="outlined"
    ></v-text-field>

    <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
      Password
    </div>

    <v-text-field
      v-model="password"
      :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
      :type="visible ? 'text' : 'password'"
      density="compact"
      :rules="[requiredpassword]"
      counter="20"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="visible = !visible"
    ></v-text-field>
    <a
      class="text-caption text-decoration-none text-blue"
      href="#"
      rel="noopener noreferrer"
      target="_blank"
    >
      Forgot password?</a
    >

    <v-hover v-slot:default="{ isHovering, props }" close-delay="200">
      <v-btn
        class="bg-primary pt-0 mt-0"
        :class="{ 'on-hover': isHovering }"
        v-bind="props"
        :elevation="isHovering ? 16 : 2"
        size="large"
        variant="tonal"
        block
      >
        <span class="login">Log In</span>
      </v-btn>
    </v-hover>
  </v-form>
</template>
