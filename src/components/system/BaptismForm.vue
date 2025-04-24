<script setup>
import { useDisplay } from 'vuetify'
import { ref } from 'vue'
const { mdAndDown } = useDisplay()

const showRequirements = ref(false)
const requirements = ref([
  'Child’s Birth Certificate',
  'Sacrament Certificates ',
  'Godparent Eligibility Certificate',
  'Pre-Baptism Class Certificate',
])
const isHovering = ref(false)
// Validation
const valid = ref(false)
const nameRules = [(v) => !!v || 'This field is required']
const emailRules = [(v) => !!v || 'This field is required']
const dateRules = [(v) => !!v || 'Date is required']
const timeRules = [(v) => !!v || 'Time is required']

const Bfirstname = ref('')
const Blastname = ref('')
const BMI = ref('')
const Bplaceofbirth = ref('')
const Bdateofbirth = ref('')

const Mfirstname = ref('')
const Mlastname = ref('')
const MMI = ref('')
const Ffirstname = ref('')
const Flastname = ref('')
const FMI = ref('')

const S1firstname = ref('')
const S2lastname = ref('')

// Wedding date/time
const date = ref('')
const time = ref('')
</script>

<template>
  <v-form v-model="valid" ref="form">
    <v-container>
      <h2 class="info mt-7">Name of Baptised</h2>

      <!--First Row-->
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            v-model="Bfirstname"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="5">
          <v-text-field
            v-model="Blastname"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field v-model="BMI" :rules="emailRules" label="M.I." required></v-text-field>
        </v-col>
      </v-row>
      <!--Second Row-->
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="Bplaceofbirth"
            :rules="nameRules"
            label="Place of Birth "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="Bdateofbirth"
            :rules="dateRules"
            type="date"
            label="Date of Birth"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <!--3rd Row-->
      <h2 class="info mt-7">Name of Mother</h2>
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            v-model="Mfirstname"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="5">
          <v-text-field
            v-model="Mlastname"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field v-model="MMI" :rules="emailRules" label="M.I." required></v-text-field>
        </v-col>
      </v-row>
      <!--4th Row-->
      <h2 class="info mt-7">Name of Father</h2>
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            v-model="Ffirstname"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="5">
          <v-text-field
            v-model="Flastname"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field v-model="FMI" :rules="emailRules" label="M.I." required></v-text-field>
        </v-col>
      </v-row>
      <!--5th Row-->
      <h2 class="info mt-7">Sponsored by:</h2>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="S1firstname"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="S2lastname"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field v-model="BMI" :rules="emailRules" label="M.I." required></v-text-field>
        </v-col>
      </v-row>
      <!--6th Row-->
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="Bfirstname"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="Blastname"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field v-model="BMI" :rules="emailRules" label="M.I." required></v-text-field>
        </v-col>
      </v-row>
      <!--Last Row-->

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
            label="Select time"
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

      <v-row justify="center" class="my-9">
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
            @click="valid = $refs.form.validate()"
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
