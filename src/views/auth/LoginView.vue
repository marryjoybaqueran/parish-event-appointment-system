<script setup>
import { ref } from 'vue'

const email = ref(null)
const password = ref(null)
const visible = ref(false)
const terms = ref(false)

function requiredemail(v) {
  return !!v || 'Email is required'
}
function requiredpassword(v) {
  return !!v || 'Password is required'
}

//toggle
const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
//toggle
</script>

<template>
  <!--Toggle-->
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3">
        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>
      <!--Toggle-->

      <v-main>
        <v-container>
          <v-row>
            <v-col :cols="6"> </v-col>
            <v-col :cols="6">
              <v-form fast-fail @submit.prevent>
                <div>
                  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
                    <div class="text-subtitle-1 text-medium-emphasis">Account</div>

                    <v-text-field
                      v-model="email"
                      density="compact"
                      placeholder="Email address"
                      prepend-inner-icon="mdi-email-outline"
                      :rules="[requiredemail]"
                      :counter="50"
                      variant="outlined"
                    ></v-text-field>

                    <div
                      class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
                    >
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
                      Forgot login password?</a
                    >
                    <v-checkbox
                      v-model="terms"
                      :rules="[(v) => !!v || '']"
                      color="secondary"
                      label="I agree to site terms and conditions"
                    ></v-checkbox>
                    <v-btn class="mb-8" color="blue" size="large" variant="tonal" block>
                      Log In
                    </v-btn>

                    <v-card-text class="text-center">
                      <p>
                        Don't have Account?<RouterLink to="/register"> Sign up now </RouterLink>
                      </p>
                    </v-card-text>
                  </v-card>
                </div>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
