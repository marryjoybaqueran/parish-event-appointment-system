import { supabase, tableSearch } from '@/utils/supabase'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthUserStore } from './authUser'

export const useAnnouncementsStore = defineStore('announcements', () => {
  const authStore = useAuthUserStore()

  const announcementsFromApi = ref([])
  const announcements = ref([])

  function $reset() {
    announcementsFromApi.value = []
    announcements.value = []
  }

  async function getAnnouncementsFromApi() {
    const response = await axios.get('https://api.restful-api.dev/objects')

    announcementsFromApi.value = response.data

    await supabase.from('announcements').delete().neq('id', 0)

    const transformedData = announcementsFromApi.value.map((announcement) => ({
      user_id: authStore.userData.id,
      title: announcement.title,
      date_posted: announcement.data?.date_posted ?? new Date().toISOString(),
      summary: announcement.data?.summary ?? '',
      image_url: announcement.data?.image_url ?? '',
      details: announcement.data?.details ?? '',
    }))

    const { data } = await supabase.from('announcements').insert(transformedData).select()

    if (data) await getAnnouncements({ search: '' })
  }

  async function getAnnouncements({ search }) {
    search = tableSearch(search)

    const { data } = await supabase.from('announcements').select('*').ilike('title', `%${search}%`)

    announcements.value = data
  }

  async function addAnnouncement(formData) {
    return await supabase.from('announcements').insert([formData]).select()
  }

  return {
    announcementsFromApi,
    announcements,
    $reset,
    getAnnouncementsFromApi,
    getAnnouncements,
    addAnnouncement,
  }
})
