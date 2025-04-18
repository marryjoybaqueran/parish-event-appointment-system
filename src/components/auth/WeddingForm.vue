<script setup>
import { useDisplay } from 'vuetify'
import { ref } from 'vue'
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
const Bfirstname = ref('')
const Blastname = ref('')
const BMI = ref('')
const Bplaceofbirth = ref('')
const Bdateofbirth = ref('')
const Bage = ref('')
const Bcitizenship = ref('')
const Breligion = ref('')
const Bcivilstatus = ref('')
const Bsex = ref('')
const Bresidence = ref('')
const Bmother = ref('')
const Bfather = ref('')
const BMcitizenship = ref('')
const BFcitizenship = ref('')

// Groom Data
const Gfirstname = ref('')
const Glastname = ref('')
const GMI = ref('')
const Gplaceofbirth = ref('')
const Gdateofbirth = ref('')
const Gage = ref('')
const Gcitizenship = ref('')
const Greligion = ref('')
const Gcivilstatus = ref('')
const Gsex = ref('')
const Gresidence = ref('')
const Gmother = ref('')
const Gfather = ref('')
const GMcitizenship = ref('')
const GFcitizenship = ref('')

// Wedding date/time
const date = ref('')
const time = ref('')
</script>

<template>
  <v-form v-model="valid" ref="form">
    <v-container>
      <!--Bride info-->
      <v-divider thickness="3" class="mt-7">
        <h2 class="info mt-7">Bride Information</h2></v-divider
      >

      <!--First Row-->
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="Bfirstname"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-model="Blastname"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-model="BMI"
            :rules="emailRules"
            label="Middle Name"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <!--Second Row-->
      <v-row>
        <v-col cols="5">
          <v-text-field
            v-model="Bplaceofbirth"
            :rules="nameRules"
            label="Place of Birth "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="5">
          <v-text-field
            v-model="Bdateofbirth"
            :rules="dateRules"
            type="date"
            label="Date of Birth"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
            v-model="Bage"
            :rules="emailRules"
            type="number"
            label="Age"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <!--3rd Row-->
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="Bcitizenship"
            :rules="nameRules"
            v-blind:width="mdAndDown ? '80%' : '100%'"
            label="Citizenship"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="Breligion"
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

        <v-col cols="2">
          <v-select
            v-model="Bcivilstatus"
            :items="['Single', 'Married']"
            v-blind:width="mdAndDown ? '80%' : '100%'"
            label="Civil Status"
            :rules="nameRules"
            outlined
            dense
          ></v-select>
        </v-col>

        <v-col cols="2">
          <v-select
            v-model="Bsex"
            :items="['Male', 'Female']"
            v-blind:width="mdAndDown ? '80%' : '100%'"
            label="Sex"
            :rules="nameRules"
            outlined
            dense
          />
        </v-col>
      </v-row>

      <!--4th Row-->
      <v-row>
        <v-col>
          <v-text-field
            v-model="Bresidence"
            :rules="nameRules"
            label="Residence "
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <!--5th Row-->
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model="Bmother"
            :rules="nameRules"
            label="Mother's Name "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-model="BMcitizenship"
            v-blind:width="mdAndDown ? '80%' : '100%'"
            label="Citizenship"
            dense
            :rules="nameRules"
          ></v-text-field>
        </v-col>
      </v-row>

      <!--6th Row-->
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model="Bfather"
            :rules="nameRules"
            label="Fathers's Name "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-model="BFcitizenship"
            label="Citizenship"
            outlined
            dense
            :rules="nameRules"
          ></v-text-field>
        </v-col>
      </v-row>
      <!--Groom info-->
      <v-divider thickness="3" class="mt-7">
        <h2 class="info mt-7">Groom Information</h2></v-divider
      >

      <!--First Row-->
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="Gfirstname"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-model="Glastname"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-model="GMI"
            :rules="emailRules"
            label="Middle Name"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <!--Second Row-->
      <v-row>
        <v-col cols="5">
          <v-text-field
            v-model="Gplaceofbirth"
            :rules="nameRules"
            label="Place of Birth "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="5">
          <v-text-field
            v-model="Gdateofbirth"
            :rules="nameRules"
            type="date"
            label="Date of Birth"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
            v-model="Gage"
            :rules="emailRules"
            type="number"
            label="Age"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <!--3rd Row-->
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="Gcitizenship"
            :items="items"
            :item-props="itemProps"
            v-blind:width="mdAndDown ? '80%' : '100%'"
            label="Citizenship"
            outlined
            :rules="nameRules"
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="Greligion"
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
            placeholder="Religion"
            outlined
            dense
          />
        </v-col>

        <v-col cols="2">
          <v-select
            v-model="Gcivilstatus"
            :items="['Single', 'Married']"
            label="Civil Status"
            :rules="nameRules"
            outlined
            dense
          />
        </v-col>

        <v-col cols="2">
          <v-select
            v-model="Gsex"
            :items="['Male', 'Female']"
            :item-props="itemProps"
            :rules="nameRules"
            label="Sex"
            outlined
            dense
          />
        </v-col>
      </v-row>

      <!--4th Row-->
      <v-row>
        <v-col>
          <v-text-field
            v-model="Gresidence"
            :rules="nameRules"
            label="Residence "
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <!--5th Row-->
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model="Gmother"
            :rules="nameRules"
            label="Mother's Name "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-model="GMcitizenship"
            :items="items"
            :item-props="itemProps"
            label="Citizenship"
            :rules="nameRules"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>

      <!--6th Row-->
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model="Gfather"
            :rules="nameRules"
            label="Fathers's Name "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-model="GFcitizenship"
            :items="items"
            :item-props="itemProps"
            :rules="nameRules"
            label="Citizenship"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>
      <divider></divider>
      <!--7th Row-->
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="date"
            :rules="dateRules"
            type="date"
            label="Select date for the wedding "
            required
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="time"
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
  transition: background-color 0.3s ease; /* Add smooth transition */
}

.no-uppercase {
  text-transform: none !important;
}

.info {
  padding-bottom: 20px;
}
</style>
