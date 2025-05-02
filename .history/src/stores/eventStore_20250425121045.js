import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventStore = defineStore('events', () => {
  // State
  const items = ref([])

  // Actions
  async function getEventsFromApi() {
    const response = await axios.get('https://api.restful-api.dev/objects')
    items.value = response.data
  }

  // Return state and actions
  return { items, getEventsFromApi }
})
