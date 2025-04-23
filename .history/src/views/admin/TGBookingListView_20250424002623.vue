<script setup>
import { ref } from 'vue'
import AdminHeader from '@/components/layout/AdminHeader.vue'

// Mock data: You can expand this or match it to actual form data
const desserts = ref([
  {
    FirstName: 'Elsa',
    LastName: 'Rose',
    MiddleInitial: 'M.',
    SelectedDate: '2025-04-30',
    SelectedTime: '10:00 AM',
    Venue: 'Brgy. Bonbon',
  },
])
</script>

<template>
  <AdminHeader>
    <template #content>
      <v-container>
        <v-row>
          <v-col>
            <v-table>
              <thead>
                <tr>
                  <th class="text-left"><b>Thanksgiving Mass Booking List</b></th>
                </tr>
                <tr>
                  <!-- Bride's Info Headers -->
                  <th class="text-left font-weight-bold">First Name</th>
                  <th class="text-left font-weight-bold">Last Name</th>
                  <th class="text-left font-weight-bold">Middle Initial</th>
                  <th class="text-left font-weight-bold">Selected Date</th>
                  <th class="text-left font-weight-bold">Selected Time</th>
                  <th class="text-left font-weight-bold">Venue</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in desserts" :key="index">
                  <!-- Bride's Info -->
                  <td>{{ item.FirstName }}</td>
                  <td>{{ item.LastName }}</td>
                  <td>{{ item.MiddleInitial }}</td>
                  <td>{{ item.SelectedDate }}</td>
                  <td>{{ item.SelectedTime }}</td>
                  <td>{{ item.Venue }}</td>
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

th {
  white-space: nowrap;
}

th,
td {
  border: 1px solid black;
}
</style>
