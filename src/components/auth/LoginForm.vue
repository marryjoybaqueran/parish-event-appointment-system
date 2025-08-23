<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formMode = ref('login')

const termsDialog = ref(false)
const privacyDialog = ref(false)
const helpDialog = ref(false)

const loginDataDefault = {
  email: '',
  password: '',
  userType: 'user',
}

const registerDataDefault = {
  fname: '',
  lname: '',
  email: '',
  gender: '',
  address: '',
  number: '',
  password: '',
  password_confirmation: '',
}

const userTypeOptions = [
  {
    value: 'user',
    title: 'User',
    icon: 'mdi-account',
    description: 'Access member portal',
    color: 'primary',
  },
  {
    value: 'admin',
    title: 'Admin',
    icon: 'mdi-shield-account',
    description: 'Administrative access',
    color: 'warning',
  },
]

const loginData = ref({ ...loginDataDefault })
const registerData = ref({ ...registerDataDefault })

const formAction = ref({ ...formActionDefault })

const isPasswordVisible = ref(false)
const isPasswordConfirmationVisible = ref(false)
const refVform = ref()

const selectedUserType = computed(() =>
  userTypeOptions.find((option) => option.value === loginData.value.userType),
)

const isLoginMode = computed(() => formMode.value === 'login')

const switchMode = (mode) => {
  formMode.value = mode
  formAction.value = { ...formActionDefault }
  refVform.value?.resetValidation()
}

const onLoginSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.value.email,
      password: loginData.value.password,
    })

    if (error) {
      formAction.value.formErrorMessage = error.message
      formAction.value.formStatus = error.status
      return
    }

    const { data: roleData, error: roleError } = await supabase.rpc('get_user_role', {
      check_user_id: data.user.id,
    })

    if (roleError) {
      console.error('Role fetch error:', roleError)
      formAction.value.formErrorMessage = 'Could not determine user role'
      return
    }

    const actualUserRole = roleData?.trim().toLowerCase()
    const selectedUserType = loginData.value.userType

    if (selectedUserType === 'admin' && actualUserRole !== 'admin') {
      formAction.value.formErrorMessage = 'Access denied: You do not have admin privileges'
      return
    }

    formAction.value.formSuccessMessage = 'Successfully Logged in!'

    switch (selectedUserType) {
      case 'admin':
        router.replace('/admin-dashboard')
        break
      default:
        router.replace('/homepage')
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    formAction.value.formErrorMessage = 'An unexpected error occurred'
  } finally {
    refVform.value?.reset()
    loginData.value = { ...loginDataDefault }
    formAction.value.formProcess = false
  }
}

const onRegisterSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: registerData.value.email,
    password: registerData.value.password,
    options: {
      data: {
        fname: registerData.value.fname,
        lname: registerData.value.lname,
        gender: registerData.value.gender,
        address: registerData.value.address,
        number: registerData.value.number,
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
    setTimeout(() => {
      switchMode('login')
      loginData.value.email = registerData.value.email
    }, 2000)
  }

  refVform.value?.reset()
  formAction.value.formProcess = false
}

// Social sign-in handlers (use Supabase OAuth)
const signInWithGoogle = async () => {
  console.log('Signing in with Google...')
}

const signInWithFacebook = async () => {
  console.log('Signing in with Facebook...')
}

const openTermsDialog = () => {
  termsDialog.value = true
}

const openPrivacyDialog = () => {
  privacyDialog.value = true
}

const openHelpDialog = () => {
  helpDialog.value = true
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) {
      if (isLoginMode.value) {
        onLoginSubmit()
      } else {
        onRegisterSubmit()
      }
    }
  })
}
</script>

<template>
  <div class="login-container">
    <AlertNotification
      :form-success-message="formAction.formSuccessMessage"
      :form-error-message="formAction.formErrorMessage"
    />

    <v-form class="mt-1" ref="refVform" @submit.prevent="onFormSubmit">
      <!-- Welcome header with animation -->
      <div class="text-center mb-3">
        <v-avatar size="64" class="welcome-avatar">
          <v-icon size="60" color="primary">mdi-church</v-icon>
        </v-avatar>
        <h2 class="text-h4 text-primary mb-2 welcome-text">Welcome Back!</h2>
        <p class="text-body-2 text-medium-emphasis">Sign in to continue your spiritual journey</p>
      </div>

      <div v-if="isLoginMode" class="auth-form-content">
        <!-- Email field with enhanced styling -->
        <div class="text-subtitle-1 text-medium-emphasis mb-2 d-flex align-center">
          <v-icon size="small" class="mr-2">mdi-email</v-icon>
          Email Address
        </div>

        <v-text-field
          v-model="loginData.email"
          density="comfortable"
          placeholder="Enter your email address"
          prepend-inner-icon="mdi-email-outline"
          :rules="[requiredValidator, emailValidator]"
          :counter="50"
          variant="outlined"
          color="primary"
          rounded="lg"
          class="animated-field"
          hide-details="auto"
        ></v-text-field>

        <!-- Password field with enhanced styling -->
        <div
          class="text-subtitle-1 text-medium-emphasis mb-2 d-flex align-center justify-space-between"
        >
          <div class="d-flex align-center">
            <v-icon size="small" class="mr-2">mdi-lock</v-icon>
            Password
          </div>
          <v-btn variant="text" size="small" class="text-caption text-primary" @click="() => {}">
            Forgot password?
          </v-btn>
        </div>

        <v-text-field
          v-model="loginData.password"
          density="comfortable"
          :rules="[requiredValidator]"
          counter="20"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          color="primary"
          rounded="lg"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="isPasswordVisible ? 'text' : 'password'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          class="mb-4 animated-field"
          hide-details="auto"
        ></v-text-field>

        <v-select
          v-model="loginData.userType"
          :items="userTypeOptions"
          item-title="title"
          item-value="value"
          color="primary"
          density="comfortable"
          variant="outlined"
          rounded="lg"
          prepend-inner-icon="mdi-account-switch"
          label="Login as"
          class="my-4 animated-field"
          hide-details
        >
          <template #selection="{ item }">
            <div class="d-flex align-center">
              <v-icon :icon="item.raw.icon" size="18" class="mr-2"></v-icon>
              {{ item.raw.title }}
            </div>
          </template>
          <template #item="{ props, item }">
            <v-list-item v-bind="props" :prepend-icon="item.raw.icon">
              <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-select>

        <!-- Enhanced login button with ripple effect -->
        <v-hover v-slot:default="{ isHovering, props }" close-delay="200">
          <v-btn
            v-bind="props"
            :elevation="isHovering ? 8 : 2"
            size="large"
            variant="elevated"
            color="primary"
            type="submit"
            :disabled="formAction.formProcess"
            :loading="formAction.formProcess"
            block
            class="login-btn mb-3"
            rounded="lg"
          >
            <v-icon :icon="selectedUserType.icon" class="mr-2"></v-icon>

            <span class="text-h6">Sign In</span>
          </v-btn>
        </v-hover>
        <div class="toggle-links">
          <span>
            Don't have an account?
            <a @click="switchMode('register')" class="toggle-link">Sign up</a>
          </span>
        </div>
        <!-- Social login divider -->
        <v-divider class="my-4">
          <span class="text-caption text-medium-emphasis px-3">Or continue with</span>
        </v-divider>

        <!-- Social login icons (replacing buttons) -->
        <v-row class="ma-0 justify-center">
          <v-col cols="6" class="pa-1 d-flex justify-center">
            <v-icon
              size="36"
              class="social-icon google--text"
              role="button"
              tabindex="0"
              @click="signInWithGoogle"
              @keyup.enter="signInWithGoogle"
              title="Sign in with Google"
            >
              mdi-google
            </v-icon>
          </v-col>
          <v-col cols="6" class="pa-1 d-flex justify-center">
            <v-icon
              size="36"
              class="social-icon facebook--text"
              role="button"
              tabindex="0"
              @click="signInWithFacebook"
              @keyup.enter="signInWithFacebook"
              title="Sign in with Facebook"
            >
              mdi-facebook
            </v-icon>
          </v-col>
        </v-row>
      </div>

      <div v-else class="auth-form-content register-content">
        <div class="mb-1">
          <v-chip color="primary" variant="tonal" class="mb-3">
            <v-icon left size="small">mdi-account</v-icon>
            Personal Information
          </v-chip>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="registerData.fname"
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
              v-model="registerData.lname"
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
          <v-col cols="12" md="6">
            <v-text-field
              v-model="registerData.number"
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
              v-model="registerData.email"
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

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="registerData.password"
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
              v-model="registerData.password_confirmation"
              :rules="[
                requiredValidator,
                confirmedValidator(registerData.password_confirmation, registerData.password),
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

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="registerData.address"
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
          <v-col cols="12" md="6">
            <v-select
              v-model="registerData.gender"
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

        <!-- Terms and Conditions -->
        <v-card class="mt-2 mb-4" variant="tonal" color="primary">
          <v-card-text class="text-center pa-4">
            <v-icon size="24" color="primary" class="mb-2">mdi-information</v-icon>
            <p class="text-body-2 mb-0">
              By creating an account, you agree to our
              <a @click="openTermsDialog" class="text-primary cursor-pointer">Terms of Service</a>
              and
              <a @click="openPrivacyDialog" class="text-primary cursor-pointer">Privacy Policy</a>
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

        <div class="toggle-links mt-3">
          <span>
            Already have an account?
            <a @click="switchMode('login')" class="toggle-link">Sign in</a>
          </span>
        </div>

        <!-- Registration Help -->
        <v-row class="mt-2" no-gutters>
          <v-col cols="12" class="text-center">
            <v-btn
              variant="text"
              size="small"
              color="primary"
              prepend-icon="mdi-help-circle"
              @click="openHelpDialog"
            >
              Need help with registration?
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-form>

    <!-- Terms of Service Dialog -->
    <v-dialog v-model="termsDialog" max-width="800" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center bg-primary text-white">
          <v-icon class="me-2" color="white">mdi-file-document-outline</v-icon>
          Terms of Service
        </v-card-title>

        <v-card-text class="pa-6" style="height: 500px">
          <div class="terms-content">
            <h3 class="text-h6 mb-3 text-primary">
              Parish Event Booking System - Terms of Service
            </h3>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">1. Acceptance of Terms</h4>
              <p class="text-body-2">
                By accessing and using the Parish Event Booking System, you accept and agree to be
                bound by the terms and provision of this agreement.
              </p>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">2. Service Description</h4>
              <p class="text-body-2">
                Our system provides online booking services for parish events including but not
                limited to:
              </p>
              <ul class="text-body-2 ml-4">
                <li>Wedding ceremonies</li>
                <li>Baptism services</li>
                <li>Funeral masses</li>
                <li>Thanksgiving services</li>
                <li>Other religious ceremonies</li>
              </ul>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">3. User Responsibilities</h4>
              <p class="text-body-2">Users agree to:</p>
              <ul class="text-body-2 ml-4">
                <li>Provide accurate and complete information when making bookings</li>
                <li>Respect the sacred nature of the parish and its services</li>
                <li>Arrive on time for scheduled appointments</li>
                <li>
                  Notify the parish office of any changes or cancellations at least 48 hours in
                  advance
                </li>
                <li>Comply with all parish guidelines and requirements</li>
              </ul>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">4. Booking Policies</h4>
              <ul class="text-body-2 ml-4">
                <li>All bookings are subject to parish approval and availability</li>
                <li>Required documents must be submitted before the scheduled date</li>
                <li>Fees and donations are as determined by parish policy</li>
                <li>
                  The parish reserves the right to reschedule or cancel services due to unforeseen
                  circumstances
                </li>
              </ul>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">5. Account Security</h4>
              <p class="text-body-2">
                You are responsible for maintaining the confidentiality of your account credentials
                and for all activities that occur under your account.
              </p>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">6. Limitation of Liability</h4>
              <p class="text-body-2">
                The parish and its staff shall not be liable for any indirect, incidental, special,
                or consequential damages arising from the use of this service.
              </p>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">7. Modifications</h4>
              <p class="text-body-2">
                The parish reserves the right to modify these terms at any time. Users will be
                notified of significant changes.
              </p>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">8. Contact Information</h4>
              <p class="text-body-2">
                For questions regarding these terms, please contact the parish office during regular
                business hours.
              </p>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="primary" @click="termsDialog = false"> I Understand </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Privacy Policy Dialog -->
    <v-dialog v-model="privacyDialog" max-width="800" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center bg-primary text-white">
          <v-icon class="me-2" color="white">mdi-shield-account</v-icon>
          Privacy Policy
        </v-card-title>

        <v-card-text class="pa-6" style="height: 500px">
          <div class="privacy-content">
            <h3 class="text-h6 mb-3 text-primary">Parish Event Booking System - Privacy Policy</h3>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">1. Information We Collect</h4>
              <p class="text-body-2">
                We collect the following information to provide our services:
              </p>
              <ul class="text-body-2 ml-4">
                <li>
                  <strong>Personal Information:</strong> Name, email address, phone number, address
                </li>
                <li>
                  <strong>Event Details:</strong> Service type, preferred dates, special
                  requirements
                </li>
                <li>
                  <strong>Religious Information:</strong> Baptismal records, marriage certificates
                  (when applicable)
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type, device information
                </li>
              </ul>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">2. How We Use Your Information</h4>
              <p class="text-body-2">Your information is used to:</p>
              <ul class="text-body-2 ml-4">
                <li>Process and manage your service bookings</li>
                <li>Communicate with you about your appointments</li>
                <li>Maintain parish records as required by canon law</li>
                <li>Send important updates about parish services</li>
                <li>Improve our booking system and services</li>
              </ul>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">3. Information Sharing</h4>
              <p class="text-body-2">
                We do not sell, trade, or rent your personal information to third parties.
                Information may be shared only:
              </p>
              <ul class="text-body-2 ml-4">
                <li>With parish staff directly involved in your service</li>
                <li>With diocesan authorities when required by canon law</li>
                <li>When required by law or legal process</li>
                <li>With your explicit consent</li>
              </ul>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">4. Data Security</h4>
              <p class="text-body-2">
                We implement appropriate security measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. This includes
                encryption of sensitive data and secure server infrastructure.
              </p>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">5. Data Retention</h4>
              <p class="text-body-2">
                Personal information is retained in accordance with canon law requirements and
                parish record-keeping policies. Sacramental records are maintained permanently as
                required by Church law.
              </p>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">6. Your Rights</h4>
              <p class="text-body-2">You have the right to:</p>
              <ul class="text-body-2 ml-4">
                <li>Access your personal information</li>
                <li>Request corrections to inaccurate data</li>
                <li>Request deletion of non-essential data</li>
                <li>Opt-out of non-essential communications</li>
                <li>File a complaint with relevant authorities</li>
              </ul>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">7. Cookies and Tracking</h4>
              <p class="text-body-2">
                Our website uses essential cookies to maintain your session and improve user
                experience. We do not use tracking cookies for advertising purposes.
              </p>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">8. Children's Privacy</h4>
              <p class="text-body-2">
                For services involving minors (such as baptisms), we collect only necessary
                information and require parental consent for all bookings.
              </p>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">9. Contact Us</h4>
              <p class="text-body-2">
                For privacy-related questions or to exercise your rights, please contact our parish
                office. We will respond to your request within 30 days.
              </p>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">10. Policy Updates</h4>
              <p class="text-body-2">
                This privacy policy may be updated periodically. We will notify users of significant
                changes through email or system notifications.
              </p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="primary" @click="privacyDialog = false"> I Understand </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Registration Help Dialog -->
    <v-dialog v-model="helpDialog" max-width="800" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center bg-primary text-white">
          <v-icon class="me-2" color="white">mdi-help-circle</v-icon>
          Registration Help & Support
        </v-card-title>

        <v-card-text class="pa-6" style="height: 500px">
          <div class="help-content">
            <h3 class="text-h6 mb-4 text-primary">
              <v-icon class="me-2" color="primary">mdi-account-plus</v-icon>
              How to Register for Parish Services
            </h3>

            <v-expansion-panels variant="accordion" class="mb-4">
              <!-- Getting Started -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="me-2" color="primary">mdi-rocket-launch</v-icon>
                  Getting Started
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pa-2">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">
                      Step-by-Step Registration:
                    </h4>
                    <ol class="text-body-2">
                      <li class="mb-2">
                        <strong>Fill Personal Information:</strong> Enter your complete name, phone
                        number, email, and address accurately.
                      </li>
                      <li class="mb-2">
                        <strong>Create Secure Password:</strong> Use at least 8 characters with a
                        mix of letters, numbers, and symbols.
                      </li>
                      <li class="mb-2">
                        <strong>Verify Information:</strong> Double-check all details before
                        submitting.
                      </li>
                      <li class="mb-2">
                        <strong>Accept Terms:</strong> Read and accept our Terms of Service and
                        Privacy Policy.
                      </li>
                      <li class="mb-2">
                        <strong>Submit Registration:</strong> Click "Create My Account" to complete
                        registration.
                      </li>
                    </ol>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Account Requirements -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="me-2" color="orange">mdi-account-check</v-icon>
                  Account Requirements
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pa-2">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Required Information:</h4>
                    <v-list dense>
                      <v-list-item>
                        <template #prepend>
                          <v-icon color="green" size="small">mdi-check-circle</v-icon>
                        </template>
                        <v-list-item-title class="text-body-2"
                          >Complete legal name (First & Last)</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item>
                        <template #prepend>
                          <v-icon color="green" size="small">mdi-check-circle</v-icon>
                        </template>
                        <v-list-item-title class="text-body-2"
                          >Valid email address</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item>
                        <template #prepend>
                          <v-icon color="green" size="small">mdi-check-circle</v-icon>
                        </template>
                        <v-list-item-title class="text-body-2"
                          >Active phone number</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item>
                        <template #prepend>
                          <v-icon color="green" size="small">mdi-check-circle</v-icon>
                        </template>
                        <v-list-item-title class="text-body-2">Complete address</v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <template #prepend>
                          <v-icon color="green" size="small">mdi-check-circle</v-icon>
                        </template>
                        <v-list-item-title class="text-body-2">Gender selection</v-list-item-title>
                      </v-list-item>
                    </v-list>

                    <h4 class="text-subtitle-1 font-weight-bold mb-2 mt-4">
                      Password Requirements:
                    </h4>
                    <v-list dense>
                      <v-list-item>
                        <template #prepend>
                          <v-icon color="blue" size="small">mdi-shield-check</v-icon>
                        </template>
                        <v-list-item-title class="text-body-2"
                          >Minimum 8 characters long</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item>
                        <template #prepend>
                          <v-icon color="blue" size="small">mdi-shield-check</v-icon>
                        </template>
                        <v-list-item-title class="text-body-2"
                          >Include uppercase letters (A-Z)</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item>
                        <template #prepend>
                          <v-icon color="blue" size="small">mdi-shield-check</v-icon>
                        </template>
                        <v-list-item-title class="text-body-2"
                          >Include lowercase letters (a-z)</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item>
                        <template #prepend>
                          <v-icon color="blue" size="small">mdi-shield-check</v-icon>
                        </template>
                        <v-list-item-title class="text-body-2"
                          >Add at least one number (0-9)</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item>
                        <template #prepend>
                          <v-icon color="blue" size="small">mdi-shield-check</v-icon>
                        </template>
                        <v-list-item-title class="text-body-2"
                          >Include special characters (!@#$%^&*)</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Available Services -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="me-2" color="purple">mdi-church</v-icon>
                  Available Services
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pa-2">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">
                      Parish Services You Can Book:
                    </h4>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card variant="tonal" color="primary" class="mb-2">
                          <v-card-text class="pa-3">
                            <div class="d-flex align-center">
                              <v-icon color="primary" class="me-2">mdi-baby-face</v-icon>
                              <div>
                                <div class="font-weight-bold">Baptism</div>
                                <div class="text-caption">Infant & Adult Baptism Services</div>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-card variant="tonal" color="pink" class="mb-2">
                          <v-card-text class="pa-3">
                            <div class="d-flex align-center">
                              <v-icon color="pink" class="me-2">mdi-heart</v-icon>
                              <div>
                                <div class="font-weight-bold">Wedding</div>
                                <div class="text-caption">Marriage Ceremonies</div>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-card variant="tonal" color="orange" class="mb-2">
                          <v-card-text class="pa-3">
                            <div class="d-flex align-center">
                              <v-icon color="orange" class="me-2">mdi-candle</v-icon>
                              <div>
                                <div class="font-weight-bold">Funeral</div>
                                <div class="text-caption">Memorial Services</div>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-card variant="tonal" color="green" class="mb-2">
                          <v-card-text class="pa-3">
                            <div class="d-flex align-center">
                              <v-icon color="green" class="me-2">mdi-hands-pray</v-icon>
                              <div>
                                <div class="font-weight-bold">Thanksgiving</div>
                                <div class="text-caption">Special Thanksgiving Mass</div>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Common Issues -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="me-2" color="red">mdi-alert-circle</v-icon>
                  Common Issues & Solutions
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pa-2">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Troubleshooting:</h4>

                    <v-alert type="warning" variant="tonal" class="mb-3">
                      <v-alert-title>Email Already Exists</v-alert-title>
                      <div class="text-body-2">
                        If you see this error, you may already have an account. Try logging in
                        instead or use the "Forgot Password" option.
                      </div>
                    </v-alert>

                    <v-alert type="error" variant="tonal" class="mb-3">
                      <v-alert-title>Password Too Weak</v-alert-title>
                      <div class="text-body-2">
                        Make sure your password meets all requirements listed above. Use a
                        combination of letters, numbers, and symbols.
                      </div>
                    </v-alert>

                    <v-alert type="info" variant="tonal" class="mb-3">
                      <v-alert-title>Form Validation Errors</v-alert-title>
                      <div class="text-body-2">
                        Check that all required fields are filled correctly. Red text indicates what
                        needs to be fixed.
                      </div>
                    </v-alert>
                    <v-alert type="success" variant="tonal" class="mb-3">
                      <v-alert-title>Registration Successful</v-alert-title>
                      <div class="text-body-2">
                        After successful registration, you'll be redirected to the login page. Use
                        your email and password to sign in.
                      </div>
                    </v-alert>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Contact Support -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="me-2" color="teal">mdi-phone</v-icon>
                  Contact Support
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="pa-2">
                    <h4 class="text-subtitle-1 font-weight-bold mb-2">Need Additional Help?</h4>
                    <p class="text-body-2 mb-3">
                      If you're still having trouble with registration, our parish staff is here to
                      help you.
                    </p>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card variant="outlined" class="mb-2">
                          <v-card-text class="pa-3">
                            <div class="d-flex align-center mb-2">
                              <v-icon color="teal" class="me-2">mdi-phone</v-icon>
                              <div class="font-weight-bold">Phone Support</div>
                            </div>
                            <div class="text-body-2">
                              Call us during office hours:<br />
                              <strong>(123) 456-7890</strong><br />
                              Mon-Fri: 9:00 AM - 5:00 PM<br />
                              Sat: 9:00 AM - 12:00 PM
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-card variant="outlined" class="mb-2">
                          <v-card-text class="pa-3">
                            <div class="d-flex align-center mb-2">
                              <v-icon color="teal" class="me-2">mdi-email</v-icon>
                              <div class="font-weight-bold">Email Support</div>
                            </div>
                            <div class="text-body-2">
                              Send us an email:<br />
                              <strong>support@parish.org</strong><br />
                              We respond within 24 hours<br />
                              during business days
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>

                    <v-card variant="tonal" color="blue" class="mt-3">
                      <v-card-text class="pa-3">
                        <div class="d-flex align-center mb-2">
                          <v-icon color="blue" class="me-2">mdi-map-marker</v-icon>
                          <div class="font-weight-bold">Visit Us In Person</div>
                        </div>
                        <div class="text-body-2">
                          Parish Office<br />
                          123 Church Street<br />
                          Your City, State 12345<br />
                          <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Quick Tips -->
            <v-card variant="tonal" color="indigo" class="mt-4">
              <v-card-text class="pa-4">
                <h4 class="text-subtitle-1 font-weight-bold mb-2 d-flex align-center">
                  <v-icon color="indigo" class="me-2">mdi-lightbulb</v-icon>
                  Quick Tips for Success
                </h4>
                <v-list dense>
                  <v-list-item class="pa-1">
                    <template #prepend>
                      <v-icon color="indigo" size="small">mdi-check</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2"
                      >Use a valid email address you check regularly</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item class="pa-1">
                    <template #prepend>
                      <v-icon color="indigo" size="small">mdi-check</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2"
                      >Write down your password in a safe place</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item class="pa-1">
                    <template #prepend>
                      <v-icon color="indigo" size="small">mdi-check</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2"
                      >Double-check your phone number for appointment
                      confirmations</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item class="pa-1">
                    <template #prepend>
                      <v-icon color="indigo" size="small">mdi-check</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2"
                      >Keep your contact information updated</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="primary" @click="helpDialog = false">
            <v-icon class="me-2">mdi-check</v-icon>
            Got It, Thanks!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.welcome-avatar {
  animation: pulse 2s infinite;
  transition: all 0.3s ease;
}

.welcome-text {
  animation: slideInDown 0.8s ease-out;
}

.animated-field {
  transition: all 0.3s ease;
}

.animated-field:hover {
  transform: translateY(-2px);
}

.login-btn {
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #1976d2, #42a5f5) !important;
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3) !important;
}

.social-btn {
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
}

.social-icon:hover,
.social-icon:focus {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(16, 24, 40, 0.08);
}

.google--text {
  color: #db4437; /* Google red */
}

.facebook--text {
  color: #1877f2; /* Facebook blue */
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced focus states */
.v-field--focused {
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2) !important;
}

/* Loading spinner enhancement */
.v-btn--loading .v-btn__content {
  opacity: 0.6;
}

.cursor-pointer {
  cursor: pointer;
  text-decoration: underline;
}

.cursor-pointer:hover {
  text-decoration: none;
}

.terms-content,
.privacy-content {
  line-height: 1.6;
}

.terms-content h4,
.privacy-content h4 {
  color: #1976d2;
  margin-top: 1rem;
}

.terms-content ul,
.privacy-content ul {
  margin-bottom: 1rem;
}

.terms-content li,
.privacy-content li {
  margin-bottom: 0.5rem;
}
</style>
