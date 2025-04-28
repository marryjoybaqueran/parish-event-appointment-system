import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

//Form Action Utils
export const formActionDefault = {
  formProcess: false,
  formStatus: 200,
  formErrorMessage: '',
  formSuccessMessage: '',
}

// Check if the session exists and is valid; Return false if there's an error
export const isAuthenticated = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error getting session:', error.message)
    return false
  }

  return !!data.session
}

//Retrieve User Information
export const getUserInformation = async () => {
  const {
    data: {
      user: { user_metadata },
    },
  } = await supabase.auth.getUser()

  return user_metadata
}

// Function to fetch all bookings from the database
/* export const fetchBookings = async () => {
  const { data, error } = await supabase.from('bookings').select('*').limit(1000)

  if (error) {
    console.error('Error fetching bookings:', error)
    return { error }
  }

  return { data }
}*/

export const fetchBookings = async () => {
  const { data, error, count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact' }) // Including count of rows
    .range(0, 1000) // Pagination: adjust the range as necessary

  if (error) {
    console.error('Error fetching bookings:', error)
    return { error }
  }

  console.log('Total bookings count:', count) // Optional: log the count
  return { data, count }
}

export const tableSearch = (search) => {
  return (search || = '')
}
