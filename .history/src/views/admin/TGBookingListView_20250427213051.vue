<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js' // Make sure you have supabase initialized
import AdminHeader from '@/components/layout/AdminHeader.vue'

// State to store Thanksgiving data
const thanks_giving_info = ref([])

// Fetch Thanksgiving data from Supabase when the component mounts
const fetchThanksgivingInfo = async () => {
  const { data, error } = await supabase.from('bookings').select('*')

  if (error) {
    console.error('Error fetching Thanksgiving data:', error.message)
  } else {
    thanks_giving_info.value = data
  }
}

// Call the function on mounted
onMounted(() => {
  fetchThanksgivingInfo()
})
</script>

<template>
  <AdminHeader>
    <template #content>
      <v-container>
        <h1 class="pb-5">Thanksgiving Mass List</h1>
        <v-row>
          <v-col>
            <v-table>
              <thead>
                <tr>
                  <th colspan="6" class="text-left"><b>Thanksgiving Mass</b></th>
                </tr>
                <tr>
                  <!-- Headers -->
                  <th class="text-left font-weight-bold">First Name</th>
                  <th class="text-left font-weight-bold">Last Name</th>
                  <th class="text-left font-weight-bold">Middle Initial</th>
                  <th class="text-left font-weight-bold">Selected Date</th>
                  <th class="text-left font-weight-bold">Selected Time</th>
                  <th class="text-left font-weight-bold">Venue</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in thanks_giving_info" :key="index">
                  <td>{{ item.first_name }}</td>
                  <td>{{ item.last_name }}</td>
                  <td>{{ item.middle_initial }}</td>
                  <td>{{ item.selected_date }}</td>
                  <td>{{ item.selected_time }}</td>
                  <td>{{ item.venue }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>

        <!-- Button to simulate adding a new record -->
        <v-btn @click="addThanksgivingRecord" color="primary" large>
          Add Thanksgiving Booking
        </v-btn>
      </v-container>
    </template>
  </AdminHeader>
</template>

<style scoped>
.card-shadow {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.flex-grow-1 {
  flex-grow: 1;
}

th {
  white-space: nowrap;
}

th,
td {
  border: 1px solid black;
}
</style>
