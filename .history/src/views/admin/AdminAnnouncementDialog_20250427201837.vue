<script setup>
import { ref, watch } from 'vue'
import { useAnnouncementsStore } from '@/stores/eventStore'
import { useAuthUserStore } from '@/stores/authUser'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { requiredValidator /*imageValidator*/ } from '@/utils/validators'
import { formActionDefault } from '@/utils/supabase'
import { useDisplay } from 'vuetify'

const props = defineProps(['modelValue', 'announcementData', 'tableFilters'])
const emit = defineEmits(['update:modelValue'])

const { mdAndDown } = useDisplay()
const announcementStore = useAnnouncementsStore()
const authStore = useAuthUserStore()

const refVForm = ref()
const formAction = ref({ ...formActionDefault })
const isUpdate = ref(false)
const imgPreview = ref('/images/img-product.png')

const formData = ref({
  user_id: authStore.userData.id,
  title: '',
  date_posted: '',
  summary: '',
  image_url: '',
  details: '',
})

// Watch if editing or adding
watch(
  () => props.announcementData,
  (data) => {
    if (data) {
      formData.value = { ...data }
      isUpdate.value = true
      imgPreview.value = data.image_url || '/images/img-product.png'
    } else {
      resetForm()
    }
  },
)

const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true }

  const { data, error } = await announcementStore.addAnnouncement(formData.value)

  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
    formAction.value.formProcess = false
  } else if (data) {
    formAction.value.formSuccessMessage = isUpdate.value
      ? 'Successfully Updated Event.'
      : 'Successfully Added Event.'

    await announcementStore.getAnnouncements(props.tableFilters)

    setTimeout(() => {
      resetForm()
    }, 2000)
  }
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

const resetForm = () => {
  formAction.value = { ...formActionDefault }
  formData.value = {
    user_id: authStore.userData.id,
    title: '',
    date_posted: '',
    summary: '',
    image_url: '',
    details: '',
  }
  isUpdate.value = false
  imgPreview.value = '/images/img-product.png'
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
      />

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
              />
            </v-col>

            <v-col cols="12" sm="6" md="8">
              <v-file-input
                class="mt-5"
                label="Browse Event Picture"
                accept="image/png, image/jpeg, image/bmp"
                prepend-icon="mdi-camera"
                show-size
                chips
                disabled
              />
              <small>Image upload not yet handled, manual URL only.</small>
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

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn text="Close" variant="plain" prepend-icon="mdi-close" @click="resetForm"></v-btn>
          <v-btn
            prepend-icon="mdi-pencil"
            color="red-darken-4"
            type="submit"
            variant="elevated"
            :disabled="formAction.formProcess"
            :loading="formAction.formProcess"
          >
            {{ isUpdate ? 'Update Event' : 'Add Event' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
