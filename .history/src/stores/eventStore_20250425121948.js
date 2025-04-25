// src/stores/eventStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useEventStore = defineStore('eventStore', () => {
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
})
