<script setup>
import RegisterForm from '@/components/auth/RegisterForm.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <div class="bg-wrapper">
          <v-img src="silp.jpg" class="bg-image" cover></v-img>
        </div>

        <div class="cardd2 py-8 align-items-center">
          <v-card
            class="mx-auto pa-6 pb-8"
            elevation="4"
            max-width="700px"
            rounded="lg"
            v-bind:width="mobile ? '100%' : '70%'"
          >
            <div class="text-header">
              <h1>Create Your Account</h1>
              <p>Sign up and create your account here</p>
            </div>
            <RegisterForm></RegisterForm>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
            </v-card-actions>
            <v-card-text class="text-center">
              <p>Already have Account?<RouterLink to="/"> Sign in </RouterLink></p>
            </v-card-text>
          </v-card>
        </div></v-container
      >
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

.text-header {
  text-align: center;
  padding-bottom: 30px;
}
</style>
