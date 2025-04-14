<script setup>
import { requiredValidator, emailValidator } from '@/utils/validators'
import { ref } from 'vue'

const isPasswordVisible = ref(false)
const refVform = ref()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})

const onLogin = () => {
  //alert(formData.value.email)
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onLogin()
  })
}
</script>

<template>
  <v-form ref="refVform" @submit.prevent="onFormSubmit">
    <div><h2 class="text-center">Welcome!</h2></div>

    <div class="text-subtitle-1 text-medium-emphasis">Username</div>

    <v-text-field
      v-model="formData.email"
      density="compact"
      placeholder="Email address"
      prepend-inner-icon="mdi-email-outline"
      :rules="[requiredValidator, emailValidator]"
      :counter="50"
      variant="outlined"
    ></v-text-field>

    <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
      Password
    </div>

    <v-text-field
      v-model="formData.password"
      density="compact"
      :rules="[requiredValidator]"
      counter="20"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
      :type="isPasswordVisible ? 'text' : 'password'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
    ></v-text-field>
    <a
      class="text-caption text-decoration-none text-blue"
      href="#"
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
        type="submit"
        block
      >
        <span class="login">Log In</span>
      </v-btn>
    </v-hover>
  </v-form>
</template>

<style setup>
.v-btn.on-hover {
  background-color: red !important;
  color: white !important ;
}
</style>
