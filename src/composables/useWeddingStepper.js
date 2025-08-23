import { ref, computed } from 'vue'
import { useWeddingStore } from '@/stores/weddingData.js'

export function useWeddingStepper() {
  // Stepper state
  const currentStep = ref(1)
  const totalSteps = 3

  // Form interaction tracking
  const formTouched = ref(false)
  const step1Touched = ref(false)
  const step3Touched = ref(false)

  // Form validation rules
  const nameRules = [(v) => !!v || 'This field is required']
  const dateRules = [(v) => !!v || 'Date is required']

  // Form data state
  const formData = ref({
    bride_firstname: '',
    bride_lastname: '',
    groom_firstname: '',
    groom_lastname: '',
    wedding_date: '',
    attached_images: [], // Array para sa multiple images
  selected_pdf_title: '',
  })

  // Load any previously selected PDF title from localStorage
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('wedding_selected_pdf')
      if (saved) formData.value.selected_pdf_title = saved
    }
  } catch (err) {
    // ignore localStorage read errors but log for dev
    console.debug('Could not read wedding_selected_pdf from localStorage', err)
  }

  // Store references
  const weddingStore = useWeddingStore()
  const formAction = weddingStore.formAction

  // Step validation computeds
  const step1Valid = computed(() => {
    return formData.value.bride_firstname && 
           formData.value.bride_lastname && 
           formData.value.groom_firstname && 
           formData.value.groom_lastname && 
           formData.value.wedding_date
  })

  const step3Valid = computed(() => {
    return formData.value.attached_images.length > 0
  })

  // Show validation warnings based on touch interaction
  const showStep1Warning = computed(() => {
    return step1Touched.value && !step1Valid.value
  })

  const showStep3Warning = computed(() => {
    return step3Touched.value && !step3Valid.value
  })

  const canProceedToNextStep = computed(() => {
    if (currentStep.value === 1) return step1Valid.value
    if (currentStep.value === 2) return true // PDF step, no validation needed
    if (currentStep.value === 3) return step3Valid.value
    return false
  })

  const isLastStep = computed(() => currentStep.value === totalSteps)
  const isFirstStep = computed(() => currentStep.value === 1)

  // Step navigation functions
  const nextStep = () => {
    // Mark steps as touched when user tries to proceed
    if (currentStep.value === 1) {
      step1Touched.value = true
    }
    if (currentStep.value === 3) {
      step3Touched.value = true
    }

    if (currentStep.value < totalSteps && canProceedToNextStep.value) {
      currentStep.value++
    }
  }

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  // Reset form state
  const resetForm = () => {
    formData.value = {
      bride_firstname: '',
      bride_lastname: '',
      groom_firstname: '',
      groom_lastname: '',
      wedding_date: '',
      attached_images: [],
      selected_pdf_title: '',
    }
    currentStep.value = 1
    // Reset touched states
    formTouched.value = false
    step1Touched.value = false
    step3Touched.value = false
    // Clear selected PDF from localStorage as well
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('wedding_selected_pdf')
      }
    } catch (err) {
      // ignore localStorage clear errors but log for dev
      console.debug('Could not remove wedding_selected_pdf from localStorage', err)
    }
  }

  // Submit wedding booking function
  const submitWeddingBooking = async (refVform) => {
    // Validate na naka-complete na ang lahat ng steps
    if (!step1Valid.value || !step3Valid.value) {
      return false
    }

    const payload = {
      bride_firstname: formData.value.bride_firstname,
      bride_lastname: formData.value.bride_lastname,
      groom_firstname: formData.value.groom_firstname,
      groom_lastname: formData.value.groom_lastname,
      wedding_date: formData.value.wedding_date,
  attached_images: formData.value.attached_images,
  title: formData.value.selected_pdf_title || (typeof window !== 'undefined' ? window.localStorage.getItem('wedding_selected_pdf') || '' : ''),
    }

    // First fetch: Insert the wedding booking
    const insertSuccess = await weddingStore.createWedding(payload)
    if (insertSuccess) {
      // Second fetch: Get the recently inserted data
      const recentBooking = await weddingStore.fetchRecentWeddingBooking()
      if (recentBooking) {
        console.log('Recent wedding booking saved with ID:', recentBooking.id, recentBooking)
        // Reset form and UI
        refVform?.value?.reset()
        resetForm()
        return true
      }
    }
    return false
  }

  return {
    // State
    currentStep,
    totalSteps,
    formData,
    formAction,
    nameRules,
    dateRules,
    
    // Computed
    step1Valid,
    step3Valid,
    showStep1Warning,
    showStep3Warning,
    canProceedToNextStep,
    isLastStep,
    isFirstStep,
    
    // Functions
    nextStep,
    prevStep,
    resetForm,
    submitWeddingBooking,
  }
}
