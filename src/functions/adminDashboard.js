import { supabase } from '@/utils/supabase'
import { ref } from 'vue'

export const eventCategories = ref([
  {
    name: 'announcement',
    label: 'Announcement',
    color: '#9C27B0',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: 'mdi-bullhorn',
  },
  {
    name: 'mass',
    label: 'Holy Mass',
    color: '#f093fb',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: 'mdi-church',
  },
  {
    name: 'event',
    label: 'Parish Event',
    color: '#43e97b',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: 'mdi-calendar-star',
  },
  {
    name: 'celebration',
    label: 'Celebration',
    color: '#FF9800',
    gradient: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
    icon: 'mdi-party-popper',
  },
  {
    name: 'wedding',
    label: 'Wedding',
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: 'mdi-heart',
  },
  {
    name: 'baptism',
    label: 'Baptism',
    color: '#4facfe',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: 'mdi-water',
  },
  {
    name: 'funeral',
    label: 'Funeral',
    color: '#424242',
    gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    icon: 'mdi-cross',
  },
  {
    name: 'thanksgiving',
    label: 'Thanksgiving',
    color: '#FF5722',
    gradient: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)',
    icon: 'mdi-hands-pray',
  },
])

// Helpers
export function getEventColor(type) {
  const category = eventCategories.value.find((cat) => cat.name === type)
  return category?.color || '#757575'
}

export function getEventGradient(type) {
  const category = eventCategories.value.find((cat) => cat.name === type)
  return category?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

// Dashboard functions
export async function loadPendingBookings(pendingBookings, stats) {
  try {
    const { data, error } = await supabase.from('bookings').select('*').eq('status', 'pending')
    if (data && !error) {
      pendingBookings.value = data.map((booking) => ({
        ...booking,
        type: booking.type,
        table: 'bookings',
      }))
      stats.value.pendingApprovals = data.length
    }
  } catch (error) {
    console.error('Error loading pending bookings:', error)
  }
}

export async function loadEvents(events, stats) {
  try {
    const { data, error } = await supabase
      .from('parish_events')
      .select('*')
      .order('date', { ascending: true })

    if (data && !error) {
      events.value = data
      stats.value.upcomingEvents = data.filter((e) => new Date(e.date) >= new Date()).length
    }
  } catch (error) {
    console.error('Error loading events:', error)
  }
}

export async function loadStats(stats) {
  try {
    const { count, error } = await supabase.from('bookings').select('*', { count: 'exact' })
    if (!error) {
      stats.value.totalBookings = count || 0
      stats.value.totalMembers = Math.floor((count || 0) * 1.5)
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

export async function loadCalendarEvents(calendarEvents) {
  try {
    const { data, error } = await supabase.from('bookings').select('*').eq('status', 'approved')
    if (data && !error) {
      const events = data.map((booking) => {
        let title, location
        if (booking.type === 'wedding') {
          title = `Wedding: ${booking.bride_firstname} & ${booking.groom_firstname}`
          location = 'Parish Church'
        } else if (booking.type === 'baptism') {
          title = `Baptism: ${booking.first_name} ${booking.last_name}`
          location = 'Parish Church'
        } else if (booking.type === 'funeral') {
          title = `Funeral: ${booking.first_name} ${booking.last_name}`
          location = 'Parish Church'
        } else if (booking.type === 'thanksgiving') {
          title = `Thanksgiving: ${booking.first_name} ${booking.last_name}`
          location = booking.venue
        }

        return {
          id: booking.id,
          date: booking.event_date,
          time: booking.event_time,
          title,
          location,
          type: booking.type,
          color: getEventColor(booking.type),
          gradient: getEventGradient(booking.type),
          status: booking.status,
          booking_data: booking,
        }
      })

      const { data: parishEvents } = await supabase.from('parish_events').select('*')
      const parishEventsMapped = (parishEvents || []).map((event) => ({
        id: event.id,
        date: event.date,
        time: event.time,
        title: event.title,
        location: 'Parish',
        type: event.type,
        color: getEventColor(event.type),
        gradient: getEventGradient(event.type),
        status: 'confirmed',
        description: event.description,
      }))

      calendarEvents.value = [...events, ...parishEventsMapped].sort(
        (a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`),
      )
    }
  } catch (error) {
    console.error('Error loading calendar events:', error)
  }
}

export async function loadRecentActivities(recentActivities) {
  try {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .order('changed_at', { ascending: false })
      .limit(10)

    if (data && !error) {
      recentActivities.value = data.map((activity) => {
        let icon = 'mdi-history'
        let color = 'grey'
        if (activity.action.includes('Approved')) {
          icon = 'mdi-check-circle'
          color = 'green'
        } else if (activity.action.includes('Denied')) {
          icon = 'mdi-close-circle'
          color = 'red'
        }
        return { ...activity, icon, color }
      })
    }
  } catch (error) {
    console.error('Error loading recent activities:', error)
  }
}

export async function approveBooking(booking, loadDashboardData) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) throw userError

    const { error } = await supabase
      .from(booking.table)
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user.id,
      })
      .eq('id', booking.id)

    if (error) throw error

    await supabase.from('audit_log').insert([
      {
        action: `Approved ${booking.type} booking`,
        user_id: user.id,
        old_role: 'pending',
        new_role: 'approved',
        changed_at: new Date().toISOString(),
      },
    ])

    await loadDashboardData()
    return { success: true }
  } catch (error) {
    console.error('Error approving booking:', error)
    return { error }
  }
}

export async function denyBooking(booking, loadDashboardData) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) throw userError

    const { error } = await supabase
      .from(booking.table)
      .update({
        status: 'denied',
        denied_at: new Date().toISOString(),
        denied_by: user.id,
      })
      .eq('id', booking.id)

    if (error) throw error

    await supabase.from('audit_log').insert([
      {
        action: `Denied ${booking.type} booking`,
        user_id: user.id,
        old_role: 'pending',
        new_role: 'denied',
        changed_at: new Date().toISOString(),
      },
    ])

    await loadDashboardData()
    return { success: true }
  } catch (error) {
    console.error('Error denying booking:', error)
    return { error }
  }
}

export async function createEvent(eventData, loadDashboardData) {
  try {
    const { error } = await supabase.from('parish_events').insert([
      {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        type: eventData.type,
        created_at: new Date().toISOString(),
      },
    ])

    if (!error) {
      await loadDashboardData()
      return { success: true }
    } else {
      return { error }
    }
  } catch (error) {
    console.error('Error creating event:', error)
    return { error }
  }
}
