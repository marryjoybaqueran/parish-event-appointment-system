<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const hoveredStep = ref(null)

const steps = [
  {
    id: 1,
    title: 'Choose Your Event',
    icon: 'mdi-calendar-search',
    desc: 'Pili-a ang event nga gusto nimo i-book.',
    englishDesc: 'Browse and select the perfect event for your needs.',
    color: 'primary',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 2,
    title: 'Download Requirements',
    icon: 'mdi-download-box',
    desc: 'I-download ang PDF nga naglangkob sa requirements ug form.',
    englishDesc: 'Get the official booking form with all requirements.',
    color: 'success',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 3,
    title: 'Sign & Scan',
    icon: 'mdi-scan-helper',
    desc: 'I-print ug i-sign ang PDF dayon i-scan balik para sa digital copy.',
    englishDesc: 'Print, complete, sign, and digitize your form.',
    color: 'warning',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: 4,
    title: 'Submit Request',
    icon: 'mdi-send-check',
    desc: 'I-upload ang scanned PDF ug isumite ang booking request.',
    englishDesc: 'Upload your completed form and finalize booking.',
    color: 'error',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
]

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

const setHoveredStep = (stepId) => {
  hoveredStep.value = stepId
}

const clearHoveredStep = () => {
  hoveredStep.value = null
}

const emit = defineEmits(['step-click'])

function onStepClick(step) {
  // emit a click event for parent components to act on (e.g., open dialog)
  emit('step-click', step)
}
</script>

<template>
  <div class="booking-steps-container">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <v-chip
        color="primary"
        variant="outlined"
        size="small"
        class="mb-3"
        prepend-icon="mdi-information"
      >
        Easy Booking Process
      </v-chip>
      <h2 class="text-h4 font-weight-bold mb-2 text-gradient">Book Your Event in 4 Simple Steps</h2>
      <p class="text-body-1 text-medium-emphasis">
        Follow our streamlined process to secure your event booking quickly and easily
      </p>
    </div>

    <!-- Progress Connector Line -->
    <div class="progress-line-container mb-6">
      <div class="progress-line"></div>
      <div class="progress-line-active" :class="{ animate: isVisible }"></div>
    </div>

    <!-- Steps Grid -->
    <v-row class="mb-4" dense>
      <v-col
        v-for="(step, index) in steps"
        :key="step.id"
        cols="12"
        sm="6"
        lg="3"
        class="d-flex step-col"
      >
        <v-card 
          elevation="0"
          class="step-card fill-height"
          :class="{ 
            'step-visible': isVisible,
            'step-hovered': hoveredStep === step.id 
          }"
          :style="{ 
            '--step-delay': `${index * 0.2}s`,
            '--step-gradient': step.gradient 
          }"
          @mouseenter="setHoveredStep(step.id)"
          @mouseleave="clearHoveredStep"
          @click.stop="onStepClick(step)"
          tabindex="0"
          @keydown.enter.stop="onStepClick(step)"
        >
          <!-- Step Number Badge -->
          <div class="step-number">
            {{ step.id }}
          </div>

          <v-card-text class="text-center pa-6">
            <!-- Icon with Animation -->
            <div class="icon-container mb-4">
              <v-avatar
                size="64"
                class="step-icon elevation-4"
                :style="{ background: step.gradient }"
              >
                <v-icon :icon="step.icon" size="32" color="white"></v-icon>
              </v-avatar>
            </div>

            <!-- Title -->
            <h3 class="text-h6 font-weight-bold mb-3 step-title">
              {{ step.title }}
            </h3>

            <!-- Description -->
            <div class="step-descriptions">
              <p class="text-body-2 text-medium-emphasis mb-2 cebuano-text">
                {{ step.desc }}
              </p>
              <p class="text-body-2 text-high-emphasis english-text">
                {{ step.englishDesc }}
              </p>
            </div>

            <!-- Action Indicator -->
            <div class="action-indicator mt-4">
              <v-btn
                variant="text"
                size="small"
                :color="step.color"
                class="step-action-btn"
                @click.stop="onStepClick(step)"
              >
                <v-icon start>mdi-arrow-right</v-icon>
                Step {{ step.id }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.booking-steps-container {
  padding: 2rem 0;
  position: relative;
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Progress Line */
.progress-line-container {
  position: relative;
  height: 4px;
  max-width: 800px;
  margin: 0 auto;
}

.progress-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 2px;
}

.progress-line-active {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  width: 0;
  transition: width 2s ease-in-out;
}

.progress-line-active.animate {
  width: 100%;
}

/* Step Cards */
.step-col {
  position: relative;
}

.step-card {
  position: relative;
  border-radius: 20px !important;
  border: 2px solid rgba(var(--v-theme-on-surface), 0.05);
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  transform: translateY(30px);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
  /* Fixed card size for consistent layout on desktop */
  width: 50rem;
  max-width: 60rem;
  height: 340px;
  min-height: 340px;
  margin: 0 auto;
}

.step-card.step-visible {
  transform: translateY(0);
  opacity: 1;
  transition-delay: var(--step-delay);
}

.step-card:hover,
.step-card.step-hovered {
  transform: translateY(-8px);
  border-color: rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 20px 40px rgba(var(--v-theme-on-surface), 0.1);
}

/* Step Number Badge */
.step-number {
  position: absolute;
  top: -12px;
  right: 16px;
  width: 28px;
  height: 28px;
  background: var(--step-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 13px;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Icon Animation */
.icon-container {
  position: relative;
}

.step-icon {
  transition: transform 0.3s ease;
  position: relative;
}

.step-card:hover .step-icon {
  transform: scale(1.1) rotate(5deg);
}

.step-icon::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: var(--step-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.step-card:hover .step-icon::before {
  opacity: 0.3;
}

/* Typography */
.step-title {
  transition: color 0.3s ease;
  font-size: 1.05rem;
  line-height: 1.2;
}

.step-card:hover .step-title {
  color: rgb(var(--v-theme-primary));
}

.step-descriptions {
  min-height: 80px;
}

.cebuano-text {
  font-style: italic;
  opacity: 0.85;
  font-size: 0.95rem;
}

.english-text {
  font-weight: 500;
  font-size: 0.9rem;
}

/* Action Button */
.action-indicator {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.step-card:hover .action-indicator {
  opacity: 1;
  transform: translateY(0);
}

.step-action-btn {
  font-size: 13px;
  text-transform: none;
}

/* Mobile Responsiveness */
@media (max-width: 960px) {
  .progress-line-container {
    display: none;
  }

  /* mobile: make cards full width and stacked */
  .step-card {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 220px;
    margin: 0;
  }

  .step-number {
    top: 16px;
    right: 16px;
    position: absolute;
  }
}

/* Dark Theme Adjustments */
.v-theme--dark .step-card {
  background: rgba(var(--v-theme-surface), 0.9);
  border-color: rgba(var(--v-theme-on-surface), 0.1);
}

.v-theme--dark .step-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
}
</style>
