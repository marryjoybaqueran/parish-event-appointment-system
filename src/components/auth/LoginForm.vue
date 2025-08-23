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

    <v-form class="modern-form" ref="refVform" @submit.prevent="onFormSubmit">
      <div class="form-header">
        <h2 class="welcome-title">{{ isLoginMode ? 'Sign In' : 'Create Account' }}</h2>
      </div>

      <div v-if="isLoginMode" class="auth-form-content">
        <div class="user-type-section">
          <v-select
            v-model="loginData.userType"
            :items="userTypeOptions"
            item-title="title"
            item-value="value"
            density="compact"
            variant="outlined"
            rounded="lg"
            prepend-inner-icon="mdi-account-switch"
            label="Login as"
            class="user-type-select"
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
        </div>

        <div class="field-section">
          <v-text-field
            v-model="loginData.email"
            density="compact"
            placeholder="Email address"
            prepend-inner-icon="mdi-email-outline"
            :rules="[requiredValidator, emailValidator]"
            variant="outlined"
            class="field-input"
            hide-details="auto"
          />
        </div>

        <div class="field-section">
          <v-text-field
            v-model="loginData.password"
            density="compact"
            :rules="[requiredValidator]"
            placeholder="Password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="isPasswordVisible ? 'text' : 'password'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
            class="field-input"
            hide-details="auto"
          />
        </div>

        <div class="forgot-password-section">
          <a class="forgot-password-link" href="#" target="_blank"> Forgot password? </a>
        </div>

        <v-btn
          class="submit-btn login-btn"
          size="large"
          variant="flat"
          type="submit"
          :disabled="formAction.formProcess"
          :loading="formAction.formProcess"
          block
        >
          <v-icon :icon="selectedUserType.icon" class="mr-2"></v-icon>
          Sign In
        </v-btn>

        <div class="toggle-links">
          <span>
            Don't have an account?
            <a @click="switchMode('register')" class="toggle-link">Sign up</a>
          </span>
        </div>
      </div>

      <div v-else class="auth-form-content register-content">
        <div class="field-row">
          <v-row no-gutters>
            <v-col cols="12" sm="6" class="field-col">
              <v-text-field
                v-model="registerData.fname"
                :rules="[requiredValidator]"
                label="First Name"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                class="field-input"
                hide-details="auto"
                required
              />
            </v-col>
            <v-col cols="12" sm="6" class="field-col">
              <v-text-field
                v-model="registerData.lname"
                :rules="[requiredValidator]"
                label="Last Name"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                class="field-input"
                hide-details="auto"
                required
              />
            </v-col>
          </v-row>
        </div>

        <div class="field-row">
          <v-row no-gutters>
            <v-col cols="12" sm="8" class="field-col">
              <v-text-field
                v-model="registerData.address"
                :rules="[requiredValidator]"
                label="Address"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-map-marker-outline"
                class="field-input"
                hide-details="auto"
                required
              />
            </v-col>
            <v-col cols="12" sm="4" class="field-col">
              <v-select
                v-model="registerData.gender"
                :items="['Male', 'Female']"
                label="Gender"
                :rules="[requiredValidator]"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-gender-male-female"
                class="field-input"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </div>

        <div class="field-row">
          <v-row no-gutters>
            <v-col cols="12" sm="6" class="field-col">
              <v-text-field
                v-model="registerData.number"
                :rules="[requiredValidator]"
                label="Phone Number"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-phone-outline"
                class="field-input"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" sm="6" class="field-col">
              <v-text-field
                v-model="registerData.email"
                :rules="[requiredValidator, emailValidator]"
                label="Email address"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-email-outline"
                class="field-input"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </div>

        <div class="field-row">
          <v-row no-gutters>
            <v-col cols="12" sm="6" class="field-col">
              <v-text-field
                v-model="registerData.password"
                label="Password"
                :rules="[requiredValidator, passwordValidator]"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                :type="isPasswordVisible ? 'text' : 'password'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                prepend-inner-icon="mdi-lock-outline"
                density="compact"
                variant="outlined"
                class="field-input"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" sm="6" class="field-col">
              <v-text-field
                v-model="registerData.password_confirmation"
                :rules="[
                  requiredValidator,
                  confirmedValidator(registerData.password_confirmation, registerData.password),
                ]"
                label="Confirm Password"
                :append-inner-icon="isPasswordConfirmationVisible ? 'mdi-eye' : 'mdi-eye-off'"
                :type="isPasswordConfirmationVisible ? 'text' : 'password'"
                @click:append-inner="isPasswordConfirmationVisible = !isPasswordConfirmationVisible"
                prepend-inner-icon="mdi-lock-outline"
                density="compact"
                variant="outlined"
                class="field-input"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </div>

        <v-btn
          class="submit-btn register-btn"
          size="large"
          variant="flat"
          type="submit"
          block
          :disabled="formAction.formProcess"
          :loading="formAction.formProcess"
        >
          Sign Up
        </v-btn>

        <div class="toggle-links">
          <span>
            Already have an account?
            <a @click="switchMode('login')" class="toggle-link">Sign in</a>
          </span>
        </div>
      </div>
    </v-form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
}

.modern-form {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.welcome-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.auth-form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register-content {
  gap: 0.75rem;
}

.user-type-section {
  margin-bottom: 0.5rem;
}

.user-type-select :deep(.v-field) {
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background: #f9fafb;
}

.user-type-select :deep(.v-field:hover) {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.user-type-select :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.field-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 0.25rem;
}

.forgot-password-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.forgot-password-link {
  font-size: 0.75rem;
  color: #1976d2;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password-link:hover {
  color: #1565c0;
  text-decoration: underline;
}

.field-row {
  margin-bottom: 0.75rem;
}

.field-col {
  padding: 0 0.5rem;
}

.field-col:first-child {
  padding-left: 0;
}

.field-col:last-child {
  padding-right: 0;
}

.field-input :deep(.v-field) {
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  background: #f9fafb;
}

.field-input :deep(.v-field:hover) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.field-input :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.field-input :deep(.v-field__prepend-inner) {
  color: #667eea;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.field-input :deep(.v-field--focused .v-field__prepend-inner) {
  opacity: 1;
}

.submit-btn {
  margin-top: 1rem;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
  height: 48px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white !important;
}

.login-btn.on-hover {
  background: linear-gradient(135deg, #637be9 0%, #667de0 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(129, 123, 209, 0.3) !important;
}

.register-btn.on-hover-register {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3) !important;
}

.toggle-links {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.7);
}

.toggle-link {
  color: #1976d2;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.toggle-link:hover {
  color: #1565c0;
  text-decoration: underline;
}

.field-row :deep(.v-row) {
  margin: 0 -0.5rem;
}

@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }

  .modern-form {
    padding: 1.5rem;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .auth-form-content {
    gap: 0.75rem;
  }

  .register-content {
    gap: 0.5rem;
  }

  .field-col {
    padding: 0 0.25rem;
    margin-bottom: 0.5rem;
  }

  .field-row :deep(.v-row) {
    margin: 0 -0.25rem;
  }

  .submit-btn {
    height: 44px;
    font-size: 0.9rem;
  }

  .toggle-links {
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .modern-form {
    padding: 1rem;
  }

  .field-col {
    padding: 0;
    margin-bottom: 0.75rem;
  }

  .field-row :deep(.v-row) {
    margin: 0;
  }

  .welcome-title {
    font-size: 1.25rem;
  }
}
</style>
