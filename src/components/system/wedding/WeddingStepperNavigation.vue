<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  currentStep: {
    type: Number,
    required: true
  },
  totalSteps: {
    type: Number,
    required: true
  },
  canProceedToNextStep: {
    type: Boolean,
    required: true
  },
  step1Valid: {
    type: Boolean,
    required: true
  },
  step3Valid: {
    type: Boolean,
    required: true
  },
  showStep1Warning: {
    type: Boolean,
    default: false
  },
  showStep3Warning: {
    type: Boolean,
    default: false
  },
  formProcessing: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['next-step', 'prev-step', 'submit'])

// Computed values
const isLastStep = computed(() => props.currentStep === props.totalSteps)
const isFirstStep = computed(() => props.currentStep === 1)

// Use the warning props directly or fall back to inline logic
const shouldShowStep1Warning = computed(() => {
  // Show warning if explicitly set via props OR if on step 1 and invalid
  return props.showStep1Warning || (props.currentStep === 1 && !props.step1Valid)
})

const shouldShowStep3Warning = computed(() => {
  // Show warning if explicitly set via props OR if on step 3 and invalid
  return props.showStep3Warning || (props.currentStep === 3 && !props.step3Valid)
})
</script>

<template>
  <v-card class="pa-4" rounded="lg" elevation="1">
    <v-row justify="space-between" align="center">
      <v-col cols="auto">
        <v-btn
          v-if="!isFirstStep"
          color="secondary"
          variant="outlined"
          @click="emit('prev-step')"
          size="large"
        >
          <v-icon start>mdi-arrow-left</v-icon>
          Previous
        </v-btn>
      </v-col>

      <v-col cols="auto" class="text-center">
        <v-chip
          color="primary"
          variant="elevated"
          size="large"
        >
          Step {{ currentStep }} of {{ totalSteps }}
        </v-chip>
      </v-col>

      <v-col cols="auto">
        <!-- Next Button (Steps 1-2) -->
        <v-btn
          v-if="currentStep < totalSteps"
          color="primary"
          variant="elevated"
          @click="emit('next-step')"
          :disabled="!canProceedToNextStep"
          size="large"
        >
          Next
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>

        <!-- Submit Button (Step 3) -->
        <v-btn
          v-if="isLastStep"
          color="success"
          variant="elevated"
          @click="emit('submit')"
          :disabled="formProcessing || !step3Valid"
          :loading="formProcessing"
          size="large"
        >
          <v-icon start>mdi-check</v-icon>
          Submit Wedding Form
        </v-btn>
      </v-col>
    </v-row>

    <!-- Debug Information (uncomment to debug validation issues) -->
    <!-- <div class="mt-3 pa-3 bg-grey-lighten-4 rounded">
      <div class="text-caption text-grey-darken-2">
        Debug Info: <br>
        • Current Step: {{ currentStep }} <br>
        • Step1Valid: {{ step1Valid }} <br>  
        • Step3Valid: {{ step3Valid }} <br>
        • Show Step1 Warning: {{ shouldShowStep1Warning }} <br>
        • Show Step3 Warning: {{ shouldShowStep3Warning }} <br>
        • Props showStep1Warning: {{ showStep1Warning }} <br>
        • Props showStep3Warning: {{ showStep3Warning }}
      </div>
    </div> -->

    <!-- Validation Warnings -->
    <div v-if="shouldShowStep1Warning" class="mt-4">
      <v-alert 
        type="warning" 
        variant="tonal"
        density="comfortable"
        class="mb-0"
      >
        <template #prepend>
          <v-icon>mdi-alert</v-icon>
        </template>
        <div class="text-body-2">
          Please fill out all required fields to continue
        </div>
      </v-alert>
    </div>

    <div v-if="shouldShowStep3Warning" class="mt-4">
      <v-alert 
        type="warning" 
        variant="tonal"
        density="comfortable"
        class="mb-0"
      >
        <template #prepend>
          <v-icon>mdi-alert</v-icon>
        </template>
        <div class="text-body-2">
          Please attach at least one document to submit the form
        </div>
      </v-alert>
    </div>
  </v-card>
</template>

<style scoped>
/* Responsive adjustments para sa mobile */
@media (max-width: 600px) {
  .v-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .v-col {
    text-align: center !important;
  }
  
  .v-btn {
    min-width: 200px;
  }
}
</style>
