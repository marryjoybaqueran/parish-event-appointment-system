<script setup>
import { ref } from 'vue'
import AlertNotification from '@/components/common/AlertNotification.vue'
import {
  useWeddingStepper,
  WeddingStep1,
  WeddingStep2,
  WeddingStep3,
  WeddingStepperNavigation
} from '@/components/system/wedding'

// Use wedding stepper composable
const {
  currentStep,
  totalSteps,
  formData,
  formAction,
  nameRules,
  dateRules,
  step1Valid,
  step3Valid,
  showStep1Warning,
  showStep3Warning,
  canProceedToNextStep,
  nextStep,
  prevStep,
  submitWeddingBooking,
} = useWeddingStepper()

// Form reference
const refVform = ref()

// Handle form submission
const onFormSubmit = async () => {
  const success = await submitWeddingBooking(refVform)
  if (success) {
    console.log('Wedding booking submitted successfully!')
  }
}

// Handle navigation events
const handleNextStep = () => {
  nextStep()
}

const handlePrevStep = () => {
  prevStep()
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  />

  <v-container class="pa-4">
    <!-- Stepper Header -->
    <v-stepper
      v-model="currentStep"
      :items="[
        'Bride & Groom Details',
        'Download Requirements',
        'Attach Documents'
      ]"
      hide-actions
      flat
      class="elevation-0 mb-6"
    >
    </v-stepper>

    <v-form ref="refVform" @submit.prevent="onFormSubmit">
      <!-- Step 1: Bride and Groom Details -->
      <WeddingStep1
        v-if="currentStep === 1"
        v-model="formData"
        :name-rules="nameRules"
        :date-rules="dateRules"
      />

  <!-- Step 2: Download PDF Requirements -->
  <WeddingStep2 v-if="currentStep === 2" />

      <!-- Step 3: Camera/Image Upload -->
      <WeddingStep3
        v-if="currentStep === 3"
        v-model="formData.attached_images"
      />

      <!-- Step Navigation -->
      <WeddingStepperNavigation
        :current-step="currentStep"
        :total-steps="totalSteps"
        :can-proceed-to-next-step="canProceedToNextStep"
        :step1-valid="step1Valid"
        :step3-valid="step3Valid"
        :show-step1-warning="showStep1Warning"
        :show-step3-warning="showStep3Warning"
        :form-processing="formAction.formProcess"
        @next-step="handleNextStep"
        @prev-step="handlePrevStep"
        @submit="onFormSubmit"
      />
    </v-form>
  </v-container>
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
