<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
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

//toggle
</script>

<template>
  <AppLayout>
    <template #content>
      <div class="bg-wrapper">
        <v-img src="silp.jpg" class="bg-image" cover></v-img>
      </div>
      <v-form>
        <div class="cardd2 py-8 align-items-center">
          <v-card class="mx-auto pa-6 pb-8" elevation="8" max-width="700px" rounded="lg">
            <h1 align="center">Create Your Account</h1>
            <p align="center">Sign up and create your account here</p>
            <v-container>
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

              <v-checkbox
                v-model="terms"
                color="secondary"
                label="I agree  terms and conditions"
              ></v-checkbox>
            </v-container>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>

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
                  <span class="login"> Sign Up</span>
                </v-btn>
              </v-hover>
            </v-card-actions>
            <v-card-text class="text-center">
              <p>Already have Account?<RouterLink to="/login"> Sign in </RouterLink></p>
            </v-card-text>
          </v-card>
        </div>
      </v-form>
    </template>
  </AppLayout>
</template>
<style scoped>
.bg-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(3px);
}

.header {
  font-family:
    Bookman,
    URW Bookman L,
    serifAmerican Typewriter,
    serif;
}

.cardd2 {
  max-width: 100%;
  padding: 100px;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: auto;
}

.v-btn.on-hover {
  background-color: red !important;
  color: white !important ;
}
.login {
  color: white;
}
.v-btn {
  box-shadow: none !important;
}
@media (max-width: 768px) {
  .cardd2 {
    padding: 0px;
  }
}
</style>
