<script setup>
import { ref, computed } from 'vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxImages: {
    type: Number,
    default: 5
  },
  required: {
    type: Boolean,
    default: true
  },
  label: {
    type: String,
    default: 'Attached Images'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Camera state
const isTakingPicture = ref(false)

// Computed values
const attachedImages = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const canAddMoreImages = computed(() => attachedImages.value.length < props.maxImages)

const isRequired = computed(() => props.required)
const hasImages = computed(() => attachedImages.value.length > 0)

// Camera functions
const takePicture = async () => {
  // Allow replace when single-image mode (maxImages === 1)
  if (!canAddMoreImages.value && props.maxImages !== 1) {
    return
  }
  if (props.disabled) return

  try {
    isTakingPicture.value = true
    
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      saveToGallery: true,
      source: CameraSource.Prompt,
      promptLabelCancel: "Cancel",
      promptLabelPhoto: "Choose from Gallery",
      promptLabelPicture: "Take a Picture",
    })

    // Add or replace sa attached_images array
    if (image.webPath || image.path) {
      const imgObj = {
        id: Date.now(), // Simple ID para sa identification
        uri: image.webPath || image.path,
        name: `Image ${attachedImages.value.length + 1}`
      }

      if (props.maxImages === 1) {
        // Replace existing single image
        attachedImages.value = [imgObj]
      } else {
        const newImages = [...attachedImages.value]
        newImages.push(imgObj)
        attachedImages.value = newImages
      }
    }
  } catch (err) {
    console.error('Camera error', err)
  } finally {
    isTakingPicture.value = false
  }
}

// Remove specific image from attached_images
const removeImage = (imageId) => {
  const newImages = attachedImages.value.filter(img => img.id !== imageId)
  attachedImages.value = newImages
}

// Clear all images
const clearAllImages = () => {
  attachedImages.value = []
}

// Get button text based on state
const getButtonText = computed(() => {
  const singleMode = props.maxImages === 1
  if (attachedImages.value.length === 0) {
    return isRequired.value ? (singleMode ? 'Add Required Image' : 'Add Required Image') : (singleMode ? 'Add Image' : 'Add Image')
  }
  return singleMode ? 'Replace Image' : 'Add Another Image'
})
</script>

<template>
  <div class="form-camera">
    <!-- Section Header -->
    <v-divider thickness="3" class="mt-7">
      <h2 class="info mt-7">
        {{ label }}{{ isRequired ? ' (Required)' : '' }}
      </h2>
    </v-divider>

    <v-row class="mt-4">
      <v-col cols="12">
        <!-- Camera Button -->
        <v-btn
          color="primary"
          size="large"
          rounded="lg"
          :loading="isTakingPicture"
          :disabled="isTakingPicture || (!canAddMoreImages && props.maxImages !== 1) || disabled"
          @click="takePicture"
          class="camera-button text-none mb-3"
          elevation="2"
          block
        >
          <v-icon start size="24" class="mr-2">
            mdi-camera
          </v-icon>
          {{ getButtonText }}
          <v-chip
            v-if="hasImages"
            color="success"
            size="small"
            class="ml-2"
          >
            {{ attachedImages.length }}/{{ maxImages }}
          </v-chip>
        </v-btn>

        <!-- Images Preview -->
        <div v-if="hasImages" class="mt-4">
          <v-card 
            class="pa-4" 
            variant="outlined" 
            rounded="lg"
          >
            <template v-if="props.maxImages === 1">
              <v-card-title class="text-h6 pa-0 mb-3">
                Attached Image
              </v-card-title>
              <v-row>
                <v-col cols="12">
                  <v-card class="image-preview-card" rounded="lg">
                    <v-img
                      :src="attachedImages[0].uri"
                      :alt="attachedImages[0].name"
                      aspect-ratio="1.6"
                      cover
                      class="rounded-lg"
                    >
                      <template #placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-progress-circular
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </div>
                      </template>
                    </v-img>

                    <v-card-actions class="pa-2">
                      <v-btn
                        color="error"
                        size="small"
                        variant="text"
                        density="compact"
                        @click="clearAllImages"
                        :disabled="disabled"
                        block
                      >
                        <v-icon>mdi-delete</v-icon>
                        Remove
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </template>

            <template v-else>
              <v-card-title class="text-h6 pa-0 mb-3">
                Attached Images ({{ attachedImages.length }})
              </v-card-title>
              
              <v-row>
                <v-col
                  v-for="image in attachedImages"
                  :key="image.id"
                  cols="6"
                  md="3"
                >
                  <v-card class="image-preview-card" rounded="lg">
                    <v-img
                      :src="image.uri"
                      :alt="image.name"
                      aspect-ratio="1"
                      cover
                      class="rounded-lg"
                    >
                      <template #placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-progress-circular
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </div>
                      </template>
                    </v-img>
                    
                    <v-card-actions class="pa-2">
                      <v-btn
                        color="error"
                        size="small"
                        variant="text"
                        density="compact"
                        @click="removeImage(image.id)"
                        :disabled="disabled"
                        block
                      >
                        <v-icon>mdi-delete</v-icon>
                        Remove
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </template>

            <!-- Clear/Replace button handled per-mode above -->
          </v-card>
        </div>

        <!-- Validation Error for Images -->
        <div v-if="isRequired && !hasImages" class="mt-2">
          <v-alert
            type="info"
            density="compact"
            variant="outlined"
            class="text-caption"
          >
            <v-icon start>mdi-information</v-icon>
            At least one image is required para sa form
          </v-alert>
        </div>

        <!-- Tips Card para sa Camera -->
        <v-card class="mt-4 tips-card" variant="outlined" rounded="lg">
          <v-list density="compact">
            <v-list-subheader class="text-primary text-caption font-weight-medium">
              Image Requirements
            </v-list-subheader>

            <v-list-item
              v-if="isRequired"
              prepend-icon="mdi-check-circle"
              title="Required"
              subtitle="At least 1 image must be attached"
              class="text-caption"
            >
            </v-list-item>

           
            <v-list-item
                prepend-icon="mdi-camera"
                title="Tips para sa Clear Photo"
                class="text-caption"
            >
                <template #subtitle>
                    Use good lighting (preferably natural).
                </template>
            </v-list-item>

            <v-list-item
              prepend-icon="mdi-camera-enhance"
              title="Source Options"
              subtitle="Take new photo or choose from gallery"
              class="text-caption"
            >
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.info {
  padding-bottom: 20px;
  font-family: 'RocknRoll One';
}

/* Camera integration styles */
.camera-button {
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.camera-button:active {
  transform: scale(0.98);
}

.image-preview-card {
  transition: all 0.3s ease;
  position: relative;
}

.image-preview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tips-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments para sa mobile */
@media (max-width: 600px) {
  .image-preview-card {
    margin-bottom: 16px;
  }
}
</style>
