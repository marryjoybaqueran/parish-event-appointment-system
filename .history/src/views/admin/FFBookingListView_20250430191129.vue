<script setup>
import { ref } from 'vue'
import { supabase } from '@/utils/supabase.js'
import AdminHeader from '@/components/layout/AdminHeader.vue'

// Mock data: You can expand this or match it to actual form data
const deceased_info = ref([
  {
    first_name: '',
    last_name: '',
    middle_name: '',
    birth_date: '',
    death_date: '',
    age: '',
    funeral_date: '',
    funeral_time: '',
    contact_fullname: '',
    relationship: '',
    email: '',
    number: '',
  },
])

const loadThanksGivingInfo = async () => {
  const { data, error } = await supabase.from('bookings').select('*')
  if (error) {
    console.error('Error loading thanksgiving form info:', error.message)
  } else {
    funeral_info.value = data
  }
}

onMounted(() => {
  loadFuneralInfo()
})
</script>

<template>
  <AdminHeader>
    <template #content>
      <v-container>
        <h1 class="pb-5">Funeral List</h1>
        <v-row>
          <v-col>
            <v-table>
              <thead>
                <tr>
                  <th colspan="8" class="text-left"><b>Deceased Information</b></th>
                  <th colspan="5">
                    <b>Contact Person Information</b>
                  </th>
                </tr>
                <tr>
                  <!-- Deceased Information -->
                  <th class="text-left font-weight-bold">First Name</th>
                  <th class="text-left font-weight-bold">Last Name</th>
                  <th class="text-left font-weight-bold">Middle Initial</th>
                  <th class="text-left font-weight-bold">Date of Birth</th>
                  <th class="text-left font-weight-bold">Date of Death</th>
                  <th class="text-left font-weight-bold">Age</th>
                  <th class="text-left font-weight-bold">Selected Funeral Date</th>
                  <th class="text-left font-weight-bold">Selected Funeral Time</th>

                  <!-- Contact Person Information -->
                  <th class="text-left font-weight-bold">Contact Fullname</th>
                  <th class="text-left font-weight-bold">Relationship</th>
                  <th class="text-left font-weight-bold">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in deceased_info" :key="index">
                  <!-- Bride's Info -->
                  <td>{{ item.first_name }}</td>
                  <td>{{ item.last_name }}</td>
                  <td>{{ item.middle_name }}</td>
                  <td>{{ item.birth_date }}</td>
                  <td>{{ item.death_date }}</td>
                  <td>{{ item.age }}</td>
                  <td>{{ item.funeral_date }}</td>
                  <td>{{ item.funeral_time }}</td>

                  <!-- Groom's Info -->
                  <td>{{ item.contact_fullname }}</td>
                  <td>{{ item.relationship }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.number }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
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

th,
td {
  white-space: nowrap;
}

th,
td {
  border: 1px solid black;
}
</style>
