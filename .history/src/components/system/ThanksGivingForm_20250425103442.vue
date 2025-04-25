<script setup>
import { useDisplay } from 'vuetify'
import { ref } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'

const { mdAndDown } = useDisplay()

const isHovering = ref(false)
// Validation
const valid = ref(false)
const nameRules = [(v) => !!v || 'This field is required']
const emailRules = [(v) => !!v || 'This field is required']
const dateRules = [(v) => !!v || 'Date is required']
const timeRules = [(v) => !!v || 'Time is required']

const first_name = ref('')
const last_name = ref('')
const middle_initial = ref('')

// Wedding date/time
const date = ref('')
const time = ref('')
const venue = ref('')

const formAction = ref({
  ...formActionDefault,
})

const submitForm = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.from('bookings').insert([
    {
      first_name: first_name.value,
      last_name: last_name.value,
      middle_initial: middle_initial.value,
      date: date.value,
      time: time.value,
      venue: venue.value,
    },
  ])

  if (error) {
    alert('Failed to submit: ' + error.message)
  } else {
    console.log('Inserted data:', data) // use it here
    alert('Form submitted successfully!')
    // reset form...
  }
}

const form = ref(null)
</script>

<template>
  <v-form v-model="valid" ref="form">
    <v-container>
      <!--First Row-->
      <v-row class="mt-5">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="first_name"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="last_name"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field v-model="BMI" :rules="emailRules" label="M.I." required></v-text-field>
        </v-col>
      </v-row>

      <!--2rd Row-->
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="date"
            :rules="dateRules"
            type="date"
            label="Select date  "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="time"
            :items="items"
            :item-props="itemProps"
            type="time"
            :rules="timeRules"
            label="Select  time"
            outlined
            dense
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field
            v-model="venue"
            :rules="nameRules"
            label="Venue"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>

      <br />

      <v-row justify="center" class="my-0">
        <v-col cols="auto">
          <v-btn
            v-model="valid"
            class="bg-primary pt-0"
            :class="{ 'green-hover': isHovering }"
            :elevation="isHovering ? 16 : 2"
            size="large"
            variant="tonal"
            width="300"
            v-blind:width="mdAndDown ? '80%' : '10%'"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
            @click="submitForm"
          >
            <span>SUBMIT</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped>
.green-hover {
  background-color: green !important;
  transition: background-color 0.3s ease;
}

.no-uppercase {
  text-transform: none !important;
}

.info {
  padding-bottom: 20px;
  font-family: 'RocknRoll One';
}
</style>
