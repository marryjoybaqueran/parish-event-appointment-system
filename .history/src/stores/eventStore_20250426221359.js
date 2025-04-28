/*// src/stores/eventStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useEventStore = defineStore('events', () => {
  // Define reactive state
  const events = ref([])

  // Define action to fetch events from API
  async function getEventsFromApi() {
    try {
      const response = await axios.get('https://api.restful-api.dev/objects')
      events.value = response.data
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  // Define action to add an event (optional if you want to add functionality)
  async function addEvent(eventData) {
    try {
      const response = await axios.post('https://api.restful-api.dev/objects', eventData)
      events.value.push(response.data) // Add new event to the state
    } catch (error) {
      console.error('Error adding event:', error)
    }
  }

  // Define action to delete an event
  async function deleteEvent(eventId) {
    try {
      await axios.delete(`https://api.restful-api.dev/objects/${eventId}`)
      events.value = events.value.filter((event) => event.id !== eventId) // Remove the event from the state
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  return { events, getEventsFromApi, addEvent, deleteEvent }
})*/

import { supabase } from '@/utils/supabase'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthUserStore } from './authUser'

export const useAnnouncementsStore = defineStore('announcements', () => {
  const authStore = useAuthUserStore

  // State
  const announcementsFromApi = ref([])
  const announcements = ref([])

  // Actions
  async function getAnnouncementsFromApi() {
    const response = await axios.get('https://api.restful-api.dev/objects')

    announcementsFromApi.value = response.data

    const transformedData = announcementsFromApi.value.map((items) => {
      return {
        title: announcement.title,
        date_posted: announcement.data['Date Posted'] ?? '',
        summary: announcement.data['Summary'] ?? 0,
        user_id: authStore.userData.id,
      }
    })

    const { data } = await supabase
      .from('announcements')
      .insert([{ some_column: 'someValue' }, { some_column: 'otherValue' }])
      .select()
  }

  // Retrieve from Supabase
  async function getAnnouncements() {
    const { data } = await supabase.from('announcements').select('*')

    announcements.value = data
  }

  return { announcementsFromApi, announcements, getAnnouncementsFromApi, getAnnouncements }
})
