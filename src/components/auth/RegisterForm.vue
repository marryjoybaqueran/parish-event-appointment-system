<script setup>
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import { ref } from 'vue'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import { useRouter } from 'vue-router'

// Utilize pre-defined vue functions
const router = useRouter()

const formDataDefault = {
  fname: '',
  lname: '',
  email: '',
  gender: '',
  address: '',
  number: '',
  password: '',
  password_confirmation: '',
}

const formData = ref({
  ...formDataDefault,
})

const formAction = ref({
  ...formActionDefault,
})

const isPasswordVisible = ref(false)
const isPasswordConfirmationVisible = ref(false)
const refVform = ref()

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        fname: formData.value.fname,
        lname: formData.value.lname,
        gender: formData.value.gender,
        address: formData.value.address,
        number: formData.value.number,
      },
    },
  })

  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Successfully Registered Account!'
    router.replace('/')
  }

  refVform.value?.reset()
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>
<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>

  <v-form class="mt-2" ref="refVform" @submit.prevent="onFormSubmit">
    <!-- Personal Insformation Section -->
    <div class="mb-4">
      <v-chip color="primary" variant="tonal" class="mb-3">
        <v-icon left size="small">mdi-account</v-icon>
        Personal Information
      </v-chip>
    </div>

    <v-row>
      <v-col cols="12" md="6" lg="12">
        <v-text-field
          v-model="formData.fname"
          :rules="[requiredValidator]"
          label="First Name"
          variant="outlined"
          color="primary"
          density="comfortable"
          prepend-inner-icon="mdi-account"
          class="form-field"
          hide-details="auto"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.lname"
          :rules="[requiredValidator]"
          label="Last Name"
          variant="outlined"
          color="primary"
          density="comfortable"
          prepend-inner-icon="mdi-account"
          class="form-field"
          hide-details="auto"
          required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-text-field
          v-model="formData.address"
          :rules="[requiredValidator]"
          counter="25"
          label="Complete Address"
          variant="outlined"
          color="primary"
          density="comfortable"
          prepend-inner-icon="mdi-map-marker"
          class="form-field"
          hide-details="auto"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="formData.gender"
          :items="['Male', 'Female']"
          label="Gender"
          variant="outlined"
          color="primary"
          density="comfortable"
          prepend-inner-icon="mdi-gender-male-female"
          :rules="[requiredValidator]"
          class="form-field"
          hide-details="auto"
        />
      </v-col>
    </v-row>

    <!-- Contact Information Section -->
    <div class="mb-4 mt-6">
      <v-chip color="primary" variant="tonal" class="mb-3">
        <v-icon left size="small">mdi-phone</v-icon>
        Contact Information
      </v-chip>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.number"
          :rules="[requiredValidator]"
          label="Phone Number"
          variant="outlined"
          color="primary"
          density="comfortable"
          prepend-inner-icon="mdi-phone"
          class="form-field"
          hide-details="auto"
          type="tel"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.email"
          :rules="[requiredValidator, emailValidator]"
          placeholder="example@gmail.com"
          label="Email Address"
          variant="outlined"
          color="primary"
          density="comfortable"
          prepend-inner-icon="mdi-email"
          class="form-field"
          hide-details="auto"
          type="email"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Account Security Section -->
    <div class="mb-4 mt-6">
      <v-chip color="primary" variant="tonal" class="mb-3">
        <v-icon left size="small">mdi-shield-lock</v-icon>
        Account Security
      </v-chip>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.password"
          label="Create Password"
          :rules="[requiredValidator, passwordValidator]"
          variant="outlined"
          color="primary"
          density="comfortable"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="isPasswordVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          class="form-field"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="formData.password_confirmation"
          :rules="[
            requiredValidator,
            confirmedValidator(formData.password_confirmation, formData.password),
          ]"
          label="Confirm Password"
          variant="outlined"
          color="primary"
          density="comfortable"
          prepend-inner-icon="mdi-lock-check"
          :append-inner-icon="isPasswordConfirmationVisible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="isPasswordConfirmationVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordConfirmationVisible = !isPasswordConfirmationVisible"
          class="form-field"
          hide-details="auto"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Terms and Conditions -->
    <v-card class="mt-6 mb-4" variant="tonal" color="primary">
      <v-card-text class="text-center pa-4">
        <v-icon size="24" color="primary" class="mb-2">mdi-information</v-icon>
        <p class="text-body-2 mb-0">
          By creating an account, you agree to our 
          <a href="#" class="text-primary">Terms of Service</a> and 
          <a href="#" class="text-primary">Privacy Policy</a>
        </p>
      </v-card-text>
    </v-card>

    <!-- Enhanced Submit Button -->
    <v-hover v-slot:default="{ isHovering, props }" close-delay="200">
      <v-btn
        v-bind="props"
        :elevation="isHovering ? 12 : 4"
        size="x-large"
        variant="elevated"
        color="primary"
        type="submit"
        block
        :disabled="formAction.formProcess"
        :loading="formAction.formProcess"
        class="register-btn mt-4"
        rounded="lg"
      >
        <v-icon left class="mr-2">mdi-account-plus</v-icon>
        <span class="text-h6">Create My Account</span>
      </v-btn>
    </v-hover>

    <!-- Registration Help -->
    <v-row class="mt-4" no-gutters>
      <v-col cols="12" class="text-center">
        <v-btn
          variant="text"
          size="small"
          color="primary"
          prepend-icon="mdi-help-circle"
          @click="() => {}"
        >
          Need help with registration?
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped>
.form-field {
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.form-field:hover {
  transform: translateY(-2px);
}

.form-field .v-field--focused {
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.register-btn {
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #1976d2, #42a5f5) !important;
  position: relative;
  overflow: hidden;
}

.register-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.register-btn:hover::before {
  left: 100%;
}

.register-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(25, 118, 210, 0.4) !important;
}

.v-chip {
  transition: all 0.3s ease;
}

.v-chip:hover {
  transform: scale(1.05);
}

/* Enhanced loading state */
.register-btn.v-btn--loading {
  background: linear-gradient(45deg, #1976d2, #42a5f5) !important;
}

.register-btn.v-btn--loading .v-btn__content {
  opacity: 0.7;
}

/* Form section animations */
.form-field {
  animation: slideInLeft 0.6s ease-out;
}

.form-field:nth-child(even) {
  animation: slideInRight 0.6s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Enhanced focus states for better accessibility */
.v-text-field .v-field--focused .v-field__outline {
  border-color: #1976d2 !important;
  border-width: 2px !important;
}

.v-select .v-field--focused .v-field__outline {
  border-color: #1976d2 !important;
  border-width: 2px !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .form-field {
    margin-bottom: 0.25rem;
  }
  
  .register-btn {
    font-size: 1rem !important;
    padding: 12px !important;
  }
}
</style>
