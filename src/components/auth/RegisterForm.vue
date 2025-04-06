<script setup>
import { ref } from 'vue'

const fname = ref('')
const lname = ref('')
const brgy = ref('')
const zip = ref('')
const city = ref('')
const state = ref('')
const inline = ref('')
const birthday = ref('')
const age = ref('')
const phonenumber = ref('+63')
const createpassword = ref(null)
const confirmpassword = ref(null)
const terms = ref(false)
const email = ref('')
const visibleCreate = ref(false)
const visibleConfirm = ref(false)
const rules = {
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  },
}
</script>
<template>
  <v-form>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6" sm="12">
        <v-text-field
          v-model="fname"
          :error-messages="errorMessages"
          :rules="[rules.required, rules.fname]"
          label="First Name"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6" sm="12">
        <v-text-field
          v-model="lname"
          :error-messages="errorMessages"
          :rules="[rules.required, rules.lname]"
          label="Last Name"
          required
        ></v-text-field> </v-col
    ></v-row>
    <v-row>
      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-text-field
          v-model="birthday"
          type="date"
          :rules="[rules.required, rules.birthday]"
          label="Birthdate"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-text-field
          v-model="age"
          type="number"
          :rules="[rules.required, rules.age]"
          label="Age"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-radio-group v-model="inline" inline>
          <v-radio label="Female" value="radio-1"></v-radio>
          <v-radio label="Male" value="radio-2"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-text-field
      v-model="brgy"
      :rules="[rules.required, rules.adrress]"
      counter="25"
      label=" Street/Brgy/House no."
      required
    ></v-text-field>
    <v-row>
      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-text-field
          v-model="state"
          :rules="[rules.required, rules.state]"
          label="Province/Region"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-text-field
          v-model="city"
          :rules="[rules.required, rules.city]"
          label="City"
          required
        ></v-text-field
      ></v-col>

      <v-col cols="12" md="4" lg="4" xl="4" sm="12">
        <v-text-field
          v-model="zip"
          :rules="[rules.required, rules.zip]"
          label="ZIP"
          required
        ></v-text-field
      ></v-col>
    </v-row>
    <v-text-field
      v-model="phonenumber"
      :rules="[rules.required, rules.phonenumber]"
      label="Phone Number"
      clearable
    ></v-text-field>

    <v-text-field
      v-model="email"
      :rules="[rules.required, rules.email]"
      placeholder="example@gmail.com"
      label="E-mail"
      clearable
    ></v-text-field>

    <v-text-field
      v-model="createpassword"
      label="Create your password"
      :append-inner-icon="visibleCreate ? 'mdi-eye' : 'mdi-eye-off'"
      :type="visibleCreate ? 'text' : 'password'"
      @click:append-inner="visibleCreate = !visibleCreate"
    ></v-text-field>

    <v-text-field
      v-model="confirmpassword"
      :append-inner-icon="visibleConfirm ? 'mdi-eye' : 'mdi-eye-off'"
      :type="visibleConfirm ? 'text' : 'password'"
      :rules="[requiredpassword]"
      label="Confirm your password"
      @click:append-inner="visibleConfirm = !visibleConfirm"
    ></v-text-field>

    <v-checkbox v-model="terms" color="secondary" label="I agree  terms and conditions"></v-checkbox
  ></v-form>
</template>
