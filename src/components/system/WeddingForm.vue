<script setup>
import { useDisplay } from 'vuetify'
import { ref } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import AlertNotification from '@/components/common/AlertNotification.vue'

const { mdAndDown } = useDisplay()

const showRequirements = ref(false)
const requirements = ref([
  'Certificate of No Marriage (CENOMAR)',
  'Birth Certificate',
  'Baptismal Certificate',
  'Confirmation Certificate',
])
const isHovering = ref(false)
// Validation
const valid = ref(false)
const nameRules = [(v) => !!v || 'This field is required']
const emailRules = [(v) => !!v || 'This field is required']
const dateRules = [(v) => !!v || 'Date is required']
const timeRules = [(v) => !!v || 'Time is required']
// Bride Data
const formData = ref({
  bride_firstname: '',
  bride_lastname: '',
  bride_middlename: '',
  bride_birthplace: '',
  bride_birthdate: '',
  bride_age: '',
  bride_citizenship: '',
  bride_religion: '',
  bride_gender: '',
  bride_residence: '',
  bride_motherfullname: '',
  bride_mothercitizenship: '',
  bride_fatherfullname: '',
  bride_fathercitizenship: '',
  groom_firstname: '',
  groom_lastname: '',
  groom_middlename: '',
  groom_birthplace: '',
  groom_birthdate: '',
  groom_age: '',
  groom_citizenship: '',
  groom_religion: '',
  groom_gender: '',
  groom_residence: '',
  groom_motherfullname: '',
  groom_mothercitizenship: '',
  groom_fatherfullname: '',
  groom_fathercitizenship: '',
  wedding_date: '',
  wedding_time: '',
})

// Form action refs
const formAction = ref({ ...formActionDefault })
const refVform = ref()

// Fetch the authenticated user
const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
  }
  return user
}

// Insert form data and user_id into the bookings table
const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  // Fetch the authenticated user ID
  const user = await getUser()
  if (!user) {
    formAction.value.formErrorMessage = 'User not authenticated'
    formAction.value.formStatus = 'error'
    return
  }

  const { data, error } = await supabase.from('wedding_bookings').insert([
    {
      user_id: user.id,
      bride_firstname: formData.value.bride_firstname,
      bride_lastname: formData.value.bride_lastname,
      bride_middlename: formData.value.bride_middlename,
      bride_birthplace: formData.value.bride_birthplace,
      bride_birthdate: formData.value.bride_birthdate,
      bride_age: formData.value.bride_age,
      bride_citizenship: formData.value.bride_citizenship,
      bride_religion: formData.value.bride_religion,
      bride_gender: formData.value.bride_gender,
      bride_residence: formData.value.bride_residence,
      bride_motherfullname: formData.value.bride_motherfullname,
      bride_mothercitizenship: formData.value.bride_mothercitizenship,
      bride_fatherfullname: formData.value.bride_fatherfullname,
      bride_fathercitizenship: formData.value.bride_fathercitizenship,
      groom_firstname: formData.value.groom_firstname,
      groom_lastname: formData.value.groom_lastname,
      groom_middlename: formData.value.groom_middlename,
      groom_birthplace: formData.value.groom_birthplace,
      groom_birthdate: formData.value.groom_birthdate,
      groom_age: formData.value.groom_age,
      groom_citizenship: formData.value.groom_citizenship,
      groom_religion: formData.value.groom_religion,
      groom_gender: formData.value.groom_gender,
      groom_residence: formData.value.groom_residence,
      groom_motherfullname: formData.value.groom_motherfullname,
      groom_mothercitizenship: formData.value.groom_mothercitizenship,
      groom_fatherfullname: formData.value.groom_fatherfullname,
      groom_fathercitizenship: formData.value.groom_fathercitizenship,
      wedding_date: formData.value.wedding_date,
      wedding_time: formData.value.wedding_time,
    },
  ])

  if (error) {
    console.error('Error inserting data:', error.message)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.code
  } else {
    console.log('Data inserted successfully:', data)
    formAction.value.formSuccessMessage = 'Wedding booking submitted successfully!'
    refVform.value?.reset()
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
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  />

  <v-form v-model="valid" ref="refVform" @submit.prevent="onFormSubmit">
    <v-container>
      <!--Bride info-->
      <v-divider thickness="3" class="mt-7">
        <h2 class="info mt-7">Bride's Information</h2></v-divider
      >

      <!--First Row-->
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.bride_firstname"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.bride_lastname"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.bride_middlename"
            :rules="nameRules"
            label="Middle Name"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <!--Second Row-->
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            v-model="formData.bride_birthplace"
            :rules="nameRules"
            label="Place of Birth "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="5">
          <v-text-field
            v-model="formData.bride_birthdate"
            :rules="dateRules"
            type="date"
            label="Date of Birth"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field
            v-model="formData.bride_age"
            :rules="emailRules"
            type="number"
            label="Age"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <!--3rd Row-->
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.bride_citizenship"
            :rules="nameRules"
            v-blind:width="mdAndDown ? '80%' : '300%'"
            label="Citizenship"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="formData.bride_religion"
            :items="[
              'Roman Catholic',
              'Iglesia Ni Cristo (INC)',
              'Muslim',
              'Aglipayan',
              'Buddhism',
              'Seventh Day Adventist',
              'Born Again',
            ]"
            :rules="nameRules"
            v-blind:width="mdAndDown ? '80%' : '300%'"
            label="Religion"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="formData.bride_gender"
            :items="['Male', 'Female']"
            :rules="nameRules"
            v-blind:width="mdAndDown ? '80%' : '300%'"
            label="Gender"
            outlined
            dense
          />
        </v-col>
      </v-row>

      <!--4th Row-->
      <v-row>
        <v-col cols="12" md="12">
          <v-text-field
            v-model="formData.bride_residence"
            :rules="nameRules"
            label="Residence "
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <!--5th Row-->
      <v-row>
        <v-col cols="12" md="9">
          <v-text-field
            v-model="formData.bride_motherfullname"
            :rules="nameRules"
            label="Mother's Complete Name "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="formData.bride_mothercitizenship"
            v-blind:width="mdAndDown ? '80%' : '300%'"
            label="Citizenship"
            dense
            :rules="nameRules"
          ></v-text-field>
        </v-col>
      </v-row>

      <!--6th Row-->
      <v-row>
        <v-col cols="12" md="9">
          <v-text-field
            v-model="formData.bride_fatherfullname"
            :rules="nameRules"
            label="Fathers's Complete Name "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="formData.bride_fathercitizenship"
            label="Citizenship"
            outlined
            dense
            :rules="nameRules"
          ></v-text-field>
        </v-col>
      </v-row>
      <!--Groom info-->
      <v-divider thickness="3" class="mt-7">
        <h2 class="info mt-7">Groom's Information</h2></v-divider
      >

      <!--First Row-->
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.groom_firstname"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.groom_lastname"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.groom_middlename"
            :rules="nameRules"
            label="Middle Name"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <!--Second Row-->
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            v-model="formData.groom_birthplace"
            :rules="nameRules"
            label="Place of Birth "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="5">
          <v-text-field
            v-model="formData.groom_birthdate"
            :rules="dateRules"
            type="date"
            label="Date of Birth"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field
            v-model="formData.groom_age"
            :rules="emailRules"
            type="number"
            label="Age"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <!--3rd Row-->
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.groom_citizenship"
            :rules="nameRules"
            label="Citizenship"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="formData.groom_religion"
            :items="[
              'Roman Catholic',
              'Iglesia Ni Cristo (INC)',
              'Muslim',
              'Aglipayan',
              'Buddhism',
              'Seventh Day Adventist',
              'Born Again',
            ]"
            :rules="nameRules"
            v-blind:width="mdAndDown ? '80%' : '100%'"
            label="Religion"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="formData.groom_gender"
            :items="['Male', 'Female']"
            :item-props="itemProps"
            :rules="nameRules"
            label="Gender"
            outlined
            dense
          />
        </v-col>
      </v-row>

      <!--4th Row-->
      <v-row>
        <v-col cols="12" md="12">
          <v-text-field
            v-model="formData.groom_residence"
            :rules="nameRules"
            label="Residence "
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <!--5th Row-->
      <v-row>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="formData.groom_motherfullname"
            :rules="nameRules"
            label="Mother's Complete Name "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.groom_mothercitizenship"
            :rules="nameRules"
            label="Mother's Citizenship"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <!--6th Row-->
      <v-row>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="formData.groom_fatherfullname"
            :rules="nameRules"
            label="Fathers's Complete Name "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.groom_fathercitizenship"
            :rules="nameRules"
            label="Father's Citizenship"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <divider></divider>
      <!--7th Row-->
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="formData.wedding_date"
            :rules="dateRules"
            type="date"
            label="Select date for the wedding "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="formData.wedding_time"
            :items="items"
            :item-props="itemProps"
            type="time"
            :rules="timeRules"
            label="Select time for the wedding"
            outlined
            dense
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-btn @click="showRequirements = true" flat class="no-uppercase text-blue-darken-2">
        <u> Click to view the following requirements</u>
      </v-btn>

      <v-dialog v-model="showRequirements" max-width="500px">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h6">Required Documents</v-card-title>
          <v-card-text>
            <p>Please make sure to submit the following documents at the parish:</p>
            <v-list dense>
              <v-list-item v-for="(item, index) in requirements" :key="index">
                <v-list-item-content>
                  <v-list-item-title>• {{ item }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text></v-card
        ></v-dialog
      >

      <br />

      <v-row justify="center">
        <v-col cols="auto">
          <v-hover v-slot:default="{ isHovering, props }">
            <v-btn
              v-bind="props"
              class="bg-primary pt-0 mt-0"
              :class="{ 'on-hover': isHovering }"
              :elevation="isHovering ? 16 : 2"
              size="large"
              variant="tonal"
              width="300"
              type="submit"
              v-blind:width="mdAndDown ? '80%' : '10%'"
              block
              :disabled="formAction.formProcess"
              :loading="formAction.formProcess"
            >
              Submit Wedding Mass Form
            </v-btn>
          </v-hover>
          <br />
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
