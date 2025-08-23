import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  // Mock data para sa unread notifications count
  // Future: This will be fetched from Supabase
  const unreadCount = ref(3)
  
  // Computed para sa notification badge visibility
  const hasUnreadNotifications = computed(() => unreadCount.value > 0)
  
  // Function para sa marking notifications as read
  const markAllAsRead = () => {
    unreadCount.value = 0
  }
  
  // Function para sa adding new notification
  const addNotification = () => {
    unreadCount.value += 1
  }
  
  // Function para sa marking single notification as read
  const markAsRead = () => {
    if (unreadCount.value > 0) {
      unreadCount.value -= 1
    }
  }
  
  // Function para sa fetching notifications from API (future implementation)
  const fetchNotifications = async () => {
    // Future: Fetch from Supabase
    // For now, set mock data
    unreadCount.value = 3
  }
  
  return {
    unreadCount,
    hasUnreadNotifications,
    markAllAsRead,
    addNotification,
    markAsRead,
    fetchNotifications
  }
})
