import { onMounted, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import { useWeddingStore } from '@/stores/weddingBookingData.js'

// Composable nga nag-handle sa wedding bookings logic
export function useWeddingHeader() {
	const weddingStore = useWeddingStore()
	const { mobile } = useDisplay()
	const router = useRouter()

	const userBookings = computed(() => weddingStore.bookings)

	const formatDate = (dateString: string | undefined) => {
		if (!dateString) return 'No date'
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: mobile.value ? 'short' : 'long',
			day: 'numeric',
		})
	}

	const getStatusColor = (isApprove?: boolean) => {
		if (isApprove === true) {
			return 'success'
		} else if (isApprove === false) {
			return 'warning'
		} else {
			return 'info'
		}
	}

	const getStatusText = (isApprove?: boolean) => {
		if (isApprove === true) {
			return 'Approved'
		} else if (isApprove === false) {
			return 'Pending'
		} else {
			return 'Unknown'
		}
	}

	const handleBookingClick = (booking: any) => {
		// Click lang kung approved ang booking - redirect to wedding form para ma-continue
		if (booking.is_approve === true) {
			router.push('/wedding-mass-continue')
		}
	}

	const isClickable = (booking: any) => {
		return booking.is_approve === true
	}

	onMounted(async () => {
		await weddingStore.fetchUserWeddingBookings()
	})

	return {
		weddingStore,
		mobile,
		userBookings,
		formatDate,
		getStatusColor,
		getStatusText,
		handleBookingClick,
		isClickable,
	}
}
