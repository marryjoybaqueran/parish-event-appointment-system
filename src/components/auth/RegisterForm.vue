<script setup>
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import { ref } from 'vue'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import { useRouter } from 'vue-router'

// Utilize pre-defined vue functions
const router = useRouter()

const formDataDefault = {
  fname: '',
  lname: '',
  email: '',
  gender: '',
  address: '',
  number: '',
  password: '',
  password_confirmation: '',
}

const formData = ref({
  ...formDataDefault,
})

const formAction = ref({
  ...formActionDefault,
})

const isPasswordVisible = ref(false)
const isPasswordConfirmationVisible = ref(false)
const refVform = ref()

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        fname: formData.value.fname,
        lname: formData.value.lname,
        gender: formData.value.gender,
        address: formData.value.address,
        number: formData.value.number,
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
    router.replace('/')
  }

  refVform.value?.reset()
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>
<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>

  <v-form class="mt-5" ref="refVform" @submit.prevent="onFormSubmit">
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6" sm="12">
        <v-text-field
          v-model="formData.fname"
          :error-messages="errorMessages"
          :rules="[requiredValidator]"
          label="First Name"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6" sm="12">
        <v-text-field
          v-model="formData.lname"
          :error-messages="errorMessages"
          :rules="[requiredValidator]"
          label="Last Name"
          required
        ></v-text-field> </v-col
    ></v-row>
    <v-row>
      <v-col cols="12" md="8" lg="8" xl="8" sm="12">
        <v-text-field
          v-model="formData.address"
          :rules="[requiredValidator]"
          counter="25"
          label=" Complete Address"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-select
          v-model="formData.gender"
          :items="['Male', 'Female']"
          label="Gender"
          :rules="[requiredValidator]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6" sm="12">
        <v-text-field
          v-model="formData.number"
          :rules="[requiredValidator]"
          label="Phone Number"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6" sm="12">
        <v-text-field
          v-model="formData.email"
          :rules="[requiredValidator, emailValidator]"
          placeholder="example@gmail.com"
          label="E-mail address"
        ></v-text-field
      ></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6" sm="12">
        <v-text-field
          v-model="formData.password"
          label="Create your password"
          :rules="[requiredValidator, passwordValidator]"
          :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="isPasswordVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        ></v-text-field>
      </v-col>
      <v-col md="6" lg="6" xl="6" sm="12">
        <v-text-field
          v-model="formData.password_confirmation"
          :rules="[
            requiredValidator,
            confirmedValidator(formData.password_confirmation, formData.password),
          ]"
          label="Confirm your password"
          :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="isPasswordConfirmationVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordConfirmationVisible = !isPasswordConfirmationVisible"
        ></v-text-field
      ></v-col>
    </v-row>
    <br />

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
        :disabled="formAction.formProcess"
        :loading="formAction.formProcess"
      >
        <span> Sign Up</span>
      </v-btn>
    </v-hover></v-form
  >
</template>

<style setup>
.v-btn.on-hover {
  background-color: green !important;
  color: white !important ;
}
</style>
