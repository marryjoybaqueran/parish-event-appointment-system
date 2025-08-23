<script setup>
import FormCamera from '@/components/common/FormCamera.vue'

// Props
defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <v-card class="pa-6 mb-4" rounded="lg" elevation="2">
    <v-card-title class="text-h5 text-primary mb-4">
      <v-icon start>mdi-camera</v-icon>
      Step 3: Attach Completed Documents
    </v-card-title>

    <FormCamera
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
  :max-images="1"
      :required="true"
  label="Wedding Document/Image"
    />
  </v-card>
</template>

<style scoped>
/* Responsive adjustments para sa mobile */
@media (max-width: 600px) {
  .v-card {
    margin: 0 !important;
  }
}
</style>
