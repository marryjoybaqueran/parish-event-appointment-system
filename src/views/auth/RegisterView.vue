<script setup>
import RegisterForm from '@/components/auth/RegisterForm.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid class="pa-0">
        <!-- Enhanced background with animated gradient -->
        <div class="bg-wrapper">
          <v-img src="silp.jpg" class="bg-image" cover>
            <div class="bg-overlay"></div>
          </v-img>
        </div>

        <!-- Floating geometric shapes -->
        <div class="shapes-container">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
        </div>

        <v-row no-gutters class="min-height-screen justify-center align-center">
          <v-col cols="12" sm="10" md="8" lg="12" xl="5" class="pa-4">
            <!-- Main registration card -->
            <v-card
              class="registration-card pa-8 pb-6"
              elevation="20"
              rounded="xl"
              max-width="600px"
           
            >
              <!-- Header section with icon and animation -->
              <div class="text-center mb-6 header-section">
                <!-- go back icon -->
                <div class="back-wrapper">
                  <v-btn icon class="back-btn" variant="text" @click="router.back()">
                    <v-icon color="white">mdi-arrow-left</v-icon>
                  </v-btn>
                </div>
                <v-avatar size="80" color="primary" class="mb-4 header-avatar">
                  <v-icon size="40" color="white">mdi-account-plus</v-icon>
                </v-avatar>
                
                <h1 class="text-h3 text-primary mb-2 header-title">
                  Join Our Community
                </h1>
                
                <v-chip 
                  color="primary" 
                  variant="tonal" 
                  rounded="lg"
                  class="mb-4 welcome-chip"
                >
                  <v-icon left size="small">mdi-church</v-icon>
                  Parish Registration
                </v-chip>
                
                <p class="text-body-1 text-medium-emphasis">
                  Create your account and become part of our spiritual family
                </p>
              </div>

              <v-divider class="my-4"></v-divider>

              <!-- Registration form -->
              <RegisterForm></RegisterForm>

    
           
            </v-card>

            <!-- Trust indicators -->
            <v-row class="mt-6 trust-indicators" no-gutters>
              <v-col cols="12" class="text-center">
                <v-chip-group class="justify-center">
                  <v-chip variant="text" size="small" class="text-white">
                    <v-icon left size="small">mdi-lock</v-icon>
                    SSL Encrypted
                  </v-chip>
                  <v-chip variant="text" size="small" class="text-white">
                    <v-icon left size="small">mdi-eye-off</v-icon>
                    Privacy Protected
                  </v-chip>
                  <v-chip variant="text" size="small" class="text-white">
                    <v-icon left size="small">mdi-check-circle</v-icon>
                    Verified System
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>
<style scoped>
.min-height-screen {
  min-height: 100vh;
  padding: 2rem 0;
}

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
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(63, 81, 181, 0.9) 0%,
    rgba(25, 118, 210, 0.8) 30%,
    rgba(156, 39, 176, 0.9) 70%,
    rgba(233, 30, 99, 0.8) 100%
  );
  animation: gradientShift 8s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background: linear-gradient(
      45deg,
      rgba(63, 81, 181, 0.9) 0%,
      rgba(25, 118, 210, 0.8) 30%,
      rgba(156, 39, 176, 0.9) 70%,
      rgba(233, 30, 99, 0.8) 100%
    );
  }
  50% {
    background: linear-gradient(
      45deg,
      rgba(233, 30, 99, 0.8) 0%,
      rgba(156, 39, 176, 0.9) 30%,
      rgba(25, 118, 210, 0.8) 70%,
      rgba(63, 81, 181, 0.9) 100%
    );
  }
}

.shapes-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 30%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  right: 10%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
    opacity: 0.8;
  }
}

.v-container {
  position: relative;
  z-index: 10;
}

.registration-card {

  backdrop-filter: blur(20px);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: cardEntrance 1s ease-out;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.back-btn {
  position: absolute;
  left: 20px;
  top: 20px;
  min-width: 40px;
  width: 40px;
  height: 40px;
  background: rgba(0,0,0,0.12);
  color: white;
  z-index: 30;
}
.back-btn:hover {
  transform: translateY(-2px);
  background: rgba(0,0,0,0.18);
}

.registration-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
}

.header-section {
  animation: headerSlideIn 0.8s ease-out;
}

.header-avatar {
  animation: avatarBounce 1.5s ease-out;
  transition: all 0.3s ease;
}

.header-avatar:hover {
  transform: scale(1.1) rotate(10deg);
}

.header-title {
  background: linear-gradient(45deg, #1976d2, #9c27b0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleSlideIn 1s ease-out 0.3s both;
}

.welcome-chip {
  animation: chipSlideIn 1s ease-out 0.5s both;
  transition: all 0.3s ease;
}

.welcome-chip:hover {
  transform: scale(1.05);
}

.progress-header {
  background: transparent !important;
  box-shadow: none !important;
  animation: progressSlideIn 1s ease-out 0.7s both;
}

.footer-section {
  animation: footerSlideIn 1s ease-out 0.9s both;
}

.signin-btn {
  transition: all 0.3s ease;
  background: linear-gradient(45deg, transparent, transparent) !important;
}

.signin-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
  background: linear-gradient(45deg, #1976d2, #42a5f5) !important;
  color: white !important;
}

.trust-indicators {
  animation: trustSlideIn 1s ease-out 1.2s both;
}

.trust-indicators .v-chip {
  transition: all 0.3s ease;
}

.trust-indicators .v-chip:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2) !important;
}

/* Keyframe animations */
@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes headerSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes avatarBounce {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2) rotate(-90deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes titleSlideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes chipSlideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes progressSlideIn {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

@keyframes footerSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes trustSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .min-height-screen {
    padding: 1rem 0;
  }
  
  .registration-card {
    margin: 0 1rem;
  }
  
  .header-title {
    font-size: 2rem !important;
  }
}

@media (max-width: 600px) {
  .registration-card {
    padding: 1.5rem !important;
  }
  
  .header-title {
    font-size: 1.75rem !important;
  }
  
  .shapes-container {
    display: none;
  }
}

/* Much smaller compact mobile adjustments for narrow phones */
@media (max-width: 420px) {
  .registration-card {
    padding: 0.6rem !important;
    max-width: 340px !important;
    margin: 0 0.5rem !important;
  }

  .header-avatar {
    width: 48px !important;
    height: 48px !important;
  }

  .back-btn {
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    margin-right: auto;
    position: absolute;
    left: 12px;
    top: 12px;
    background: rgba(0,0,0,0.15);
  }

  .header-avatar .v-icon,
  .header-avatar v-icon {
    font-size: 20px !important;
  }

  .header-title {
    font-size: 1.1rem !important;
    line-height: 1.1 !important;
    margin-bottom: 0.25rem !important;
  }

  .header-section p.text-body-1 {
    font-size: 0.75rem !important;
    margin: 0 !important;
  }

  /* tighten chips and trust indicators */
  .welcome-chip,
  .trust-indicators .v-chip,
  .v-chip {
    font-size: 0.65rem !important;
    padding: 2px 6px !important;
    min-height: 24px !important;
  }

  /* stepper and small controls */
  .v-stepper-header {
    padding: 0.4rem !important;
  }

  .v-stepper-item {
    font-size: 0.7rem !important;
    padding: 0.2rem 0.4rem !important;
  }

  /* shrink generic body text inside the card */
  .registration-card .text-body-1,
  .registration-card .text-medium-emphasis {
    font-size: 0.78rem !important;
  }

  /* hide decorative shapes on smallest devices */
  .shapes-container {
    display: none !important;
  }
}

/* Enhanced stepper styling */
.v-stepper-header {
  border-radius: 12px !important;
  background: rgba(25, 118, 210, 0.05) !important;
  padding: 1rem !important;
}

.v-stepper-item {
  transition: all 0.3s ease;
}

.v-stepper-item:hover {
  transform: translateY(-2px);
}
</style>
