<script setup>
import RegisterForm from '@/components/auth/RegisterForm.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <div class="bg-wrapper">
        <v-img src="silp.jpg" class="bg-image" cover></v-img>
      </div>

      <div class="cardd2 py-8 align-items-center">
        <v-card
          class="mx-auto pa-6 pb-8"
          elevation="8"
          max-width="700px"
          rounded="lg"
          v-bind:width="mobile ? '100%' : '70%'"
        >
          <h1 align="center">Create Your Account</h1>
          <p align="center">Sign up and create your account here</p>
          <v-container>
            <RegisterForm></RegisterForm>
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
                <span> Sign Up</span>
              </v-btn>
            </v-hover>
          </v-card-actions>
          <v-card-text class="text-center">
            <p>Already have Account?<RouterLink to="/login"> Sign in </RouterLink></p>
          </v-card-text>
        </v-card>
      </div>
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
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: auto;
}

.v-btn.on-hover {
  background-color: red !important;
  color: white !important ;
}

.v-btn {
  box-shadow: none !important;
}
</style>
