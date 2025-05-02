<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { requiredValidator, imageValidator } from '@/utils/validators'
import { formActionDefault } from '@/utils/supabase.js'
import { useAuthUserStore } from '@/stores/authUser.js'
import { useDisplay } from 'vuetify'
import { ref, watch } from 'vue'
import { useAnnouncementsStore } from '@/stores/eventStore.js'

const props = defineProps(['modelValue', 'announcementData', 'tableFilters'])
const emit = defineEmits(['update:modelValue'])

// Utilize pre-defined vue functions
const { mdAndDown } = useDisplay()

// Use Pinia Store
const announcementStore = useAnnouncementsStore()
const authStore = useAuthUserStore()

// Load Variables
const formDataDefault = {
  user_id: authStore.userData.id,
  title: '',
  date_posted: '',
  summary: '',
  image: null,
  details: '',
}
const formData = ref({
  ...formDataDefault,
})
const formAction = ref({
  ...formActionDefault,
})
const refVForm = ref()
const isUpdate = ref(false)
const imgPreview = ref('/images/img-product.png')

// When opening the Dialog, if editing, load the announcementData
watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      if (props.announcementData) {
        formData.value = { ...props.announcementData }
        // set preview if you have image_url field
        if (props.announcementData.image_url) imgPreview.value = props.announcementData.image_url
      } else {
        formData.value = { ...formDataDefault }
        imgPreview.value = '/images/img-product.png'
      }
    }
  },
)

const onSubmit = async () => {
  // Reset Form Action utils
  formAction.value = { ...formActionDefault, formProcess: true }

  if (props.isUpdate) {

  // UPDATE logic (to be implemented if needed)
    // e.g. announcementStore.updateAnnouncement(formData.value)
    console.warn('Update not yet implemented!')
    formAction.value.formSuccessMessage = 'Update feature not yet implemented.'
    formAction.value.formProcess = false
  } else {

  // Check if isUpdate is true, then do update, if false do add
  const { data, error } = await announcementStore.addAnnouncement(formData.value)

  if (error) {
    // Add Error Message and Status Code
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status

    // Turn off processing
    formAction.value.formProcess = false
  } else if (data) {
    // Add Success Message
    formAction.value.formSuccessMessage = 'Successfully Added Event.'


    await announcementStore.getAnnouncements(props.tableFilters)

    // Form Reset and Close Dialog
    setTimeout(() => {
      onFormReset()
    }, 2500)
  }
}


// Trigger Validators
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

// Form Reset
const onFormReset = () => {
  formAction.value = { ...formActionDefault }
  formData.value = { ...formDataDefault }
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :max-width="mdAndDown ? undefined : '800'"
    :model-value="props.modelValue"
    :fullscreen="mdAndDown"
    persistent
  >
    <v-card prepend-icon="mdi-calendar" title="Event Information">
      <AlertNotification
        :form-success-message="formAction.formSuccessMessage"
        :form-error-message="formAction.formErrorMessage"
      ></AlertNotification>

      <v-form ref="refVForm" @submit.prevent="onFormSubmit">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="formData.title"
                label="Event Title"
                :rules="[requiredValidator]"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formData.date_posted"
                label="Date Posted"
                type="date"
                :rules="[requiredValidator]"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea v-model="formData.summary" label="Summary" :rules="[requiredValidator]" />
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-img
                width="55%"
                class="mx-auto rounded-circle"
                color="red-darken-4"
                aspect-ratio="1"
                :src="imgPreview"
                alt="Event Picture Preview"
                cover
              >
              </v-img>
            </v-col>

            <v-col cols="12" sm="6" md="8">
              <v-file-input
                v-model="formData.image"
                class="mt-5"
                :rules="isUpdate ? [imageValidator] : [requiredValidator, imageValidator]"
                accept="image/png, image/jpeg, image/bmp"
                label="Browse Event Picture"
                placeholder="Browse Product Picture"
                prepend-icon="mdi-camera"
                show-size
                chips
              ></v-file-input>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="formData.details"
                label="Event Details"
                :rules="[requiredValidator]"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" prepend-icon="mdi-close" @click="onFormReset"></v-btn>

          <v-btn
            prepend-icon="mdi-pencil"
            color="red-darken-4"
            type="submit"
            variant="elevated"
            :disabled="formAction.formProcess"
            :loading="formAction.formProcess"
          >
            {{ isUpdate ? 'Update Product' : 'Add Product' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
