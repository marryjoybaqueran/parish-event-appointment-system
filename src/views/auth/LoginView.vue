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
      <v-app-bar class="bg-primary py-3">
        <h2 class="ps-5 header">San Isidro Labrador Parish</h2>
        <v-spacer></v-spacer>
        <v-switch
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
          slim
          class="pt-5"
          @click="onClick"
          :width="100"
        ></v-switch>
      </v-app-bar>
      <!--Toggle-->

      <v-main>
        <div class="bg-wrapper">
          <v-img src="silp.jpg" class="bg-image" cover></v-img>
        </div>
        <v-container>
          <v-row>
            <!-- Left Column: Image and Heading -->
            <v-col cols="12" md="6" lg="6" xl="6" sm="12" class="col1">
              <v-img :width="270" src="logo.png" class="animated-image"></v-img> <br />
              <br />

              <h2 class="line-1 anim-typewriter pt-1 text-center">
                ("<span class="text-span"
                  >Join us as we come together in faith and community, where we celebrate the spirit
                  of service, devotion, and unity!</span
                >")
              </h2>
            </v-col>
            <!-- Right Column: Form -->
            <v-col class="cardy" cols="12" md="6" lg="6" xl="6" sm="12">
              <v-form fast-fail @submit.prevent>
                <div class="cardd px-5 float-end">
                  <v-card class="mx-auto pa-12 pb-8" elevation="8" rounded="lg">
                    <div><h2 class="text-center">Welcome!</h2></div>

                    <div class="text-subtitle-1 text-medium-emphasis">Username</div>

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
                      Forgot password?</a
                    >
                    <v-checkbox
                      v-model="terms"
                      :rules="[(v) => !!v || '']"
                      color="secondary"
                      label="I agree to the  terms and conditions"
                      class="checkbox-font mb-0"
                    ></v-checkbox>
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
                        <span class="login">Log In</span>
                      </v-btn>
                    </v-hover>

                    <v-card-text class="text-center">
                      <p>Don't have an account? <RouterLink to="">Sign up now</RouterLink></p>
                    </v-card-text>
                  </v-card>
                </div>
              </v-form>
            </v-col>
          </v-row>
          <br />
          <br />
          <br />
          <br />
          <br />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
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

.v-container {
  position: relative;
  z-index: 10;
}
.cardd {
  animation: bounce 4s infinite ease-in-out;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.cardd {
  padding: 100px;
  max-width: 500px;
  height: 400px;
  margin: auto;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.col1 {
  padding-top: 150px;
  place-items: center;
}

.animated-image {
  width: 200px;
  opacity: 0;
  transform: scale(0.2);
  animation: fadeInScale 1s ease-out forwards;
}

.checkbox-font {
  font-size: smaller;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.col1 h2 {
  text-align: center;
  font-family:
    Times,
    Times New Roman,
    serif;
  text-shadow:
    -2px 0 2px black,
    0 2px 2px black,
    2px 0 2px black,
    0 -2px 2px;
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
.header {
  font-family:
    Bookman,
    URW Bookman L,
    serifAmerican Typewriter,
    serif;
}
.text-span {
  color: #fcb454;
}

.cardy {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
