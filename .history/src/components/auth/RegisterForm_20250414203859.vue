<script setup>
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import { ref } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'

const formDataDefault = {
  fname: '',
  lname: '',
  email: '',
  birthdate: '',
  age: '',
  gender: '',
  brgy: '',
  region: '',
  city: '',
  zip: '',
  number: '',
  password: '',
  password_confirmation: '',
  checkbox: 'false',
}

const formData = ref({
  ...formDataDefault,
})

const formAction = ref({
  ...formActionDefault,
})

const isPasswordVisible = ref(false)
const isPasswordconsfirmationVisible = ref(false)
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
        birthdate: formData.value.birthdate,
        age: formData.value.age,
        gender: formData.value.gender,
        brgy: formData.value.brgy,
        region: formData.value.region,
        city: formData.value.city,
        zip: formData.value.zip,
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
  }

  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>
<template>
  <v-alert
    v-if="formAction.formSuccessMessage"
    :text="formAction.formSuccessMessage"
    title="Success!"
    type="success"
    variant="tonal"
    density="compact"
    border="start"
    closable
  >
  </v-alert>

  <v-alert
    v-if="formAction.formErrorMessage"
    :text="formAction.formErrorMessage"
    title="Oops!"
    type="error"
    variant="tonal"
    density="compact"
    border="start"
    closable
  >
  </v-alert>

  <v-form ref="refVform" @submit.prevent="onFormSubmit">
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
      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-text-field
          v-model="formData.birthdate"
          type="date"
          :rules="[requiredValidator]"
          label="Birthdate"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-text-field
          v-model="formData.age"
          type="number"
          :rules="[requiredValidator]"
          label="Age"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-radio-group v-model="formData.gender" :rules="[requiredValidator]" inline>
          <v-radio label="Female" value="radio-1"></v-radio>
          <v-radio label="Male" value="radio-2"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-text-field
      v-model="formData.brgy"
      :rules="[requiredValidator]"
      counter="25"
      label=" Street/Brgy/House no."
      required
    ></v-text-field>
    <v-row>
      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-text-field
          v-model="formData.region"
          :rules="[requiredValidator]"
          label="Province/Region"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-text-field
          v-model="formData.city"
          :rules="[requiredValidator]"
          label="City"
          required
        ></v-text-field
      ></v-col>

      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-text-field
          v-model="formData.zip"
          :rules="[requiredValidator]"
          label="ZIP"
          required
        ></v-text-field
      ></v-col>
    </v-row>
    <v-text-field
      v-model="formData.number"
      :rules="[requiredValidator]"
      label="Phone Number"
      clearable
    ></v-text-field>

    <v-text-field
      v-model="formData.email"
      :rules="[requiredValidator, emailValidator]"
      placeholder="example@gmail.com"
      label="E-mail"
      clearable
    ></v-text-field>

    <v-text-field
      v-model="formData.password"
      label="Create your password"
      :rules="[requiredValidator, passwordValidator]"
      :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
      :type="isPasswordVisible ? 'text' : 'password'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
    ></v-text-field>

    <v-text-field
      v-model="formData.password_confirmation"
      :rules="[
        requiredValidator,
        confirmedValidator(formData.password_confirmation, formData.password),
      ]"
      label="Confirm your password"
      :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
      :type="isPasswordconsfirmationVisible ? 'text' : 'password'"
      @click:append-inner="isPasswordconsfirmationVisible = !isPasswordconsfirmationVisible"
    ></v-text-field>

    <v-checkbox v-model="formData.checkbox" :rules="[requiredValidator]">
      <template v-slot:label>
        <div>
          I agree with the
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <a href="#" v-bind="props" @click.stop> Terms and Conditions </a>
            </template>
            Opens in new window
          </v-tooltip>
        </div>
      </template>
    </v-checkbox>

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
  background-color: red !important;
  color: white !important ;
}
</style>
