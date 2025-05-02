<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { requiredValidator, imageValidator } from '@/utils/validators'
import { formActionDefault } from '@/utils/supabase.js'
import { useAuthUserStore } from '@/stores/authUser'
import { useDisplay } from 'vuetify'
import { ref } from 'vue'

const props = defineProps(['isDialogVisible', 'announcementData', 'tableFilters'])

const emit = defineEmits(['update:isDialogVisible'])

// Utilize pre-defined vue functions
const { mdAndDown } = useDisplay()

// Use Pinia Store
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
//const imgPreview = ref('/images/img-product.png')

// Trigger Validators
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    // if (valid) onSubmit()
  })
}

// Form Reset
const onFormReset = () => {
  formAction.value = { ...formActionDefault }
  formData.value = { ...formDataDefault }
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <v-dialog
    :max-width="mdAndDown ? undefined : '800'"
    :model-value="props.isDialogVisible"
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

            <v-col cols="12" sm="6" md="4">
              <v-img
                width="55%"
                class="mx-auto rounded-circle"
                color="red-darken-4"
                aspect-ratio="1"
                :src="imgPreview"
                alt="Product Picture Preview"
                cover
              >
              </v-img>
            </v-col>

            <v-col cols="12" sm="6" md="8">
              <v-file-input
                class="mt-5"
                :rules="isUpdate ? [imageValidator] : [requiredValidator, imageValidator]"
                accept="image/png, image/jpeg, image/bmp"
                label="Browse Product Picture"
                placeholder="Browse Product Picture"
                prepend-icon="mdi-camera"
                show-size
                chips
              ></v-file-input>
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
