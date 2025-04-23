<script setup>
import { ref } from 'vue'
import AdminHeader from '@/components/layout/AdminHeader.vue'

// Mock data: You can expand this or match it to actual form data
const desserts = ref([
  {
    deceasedFirstName: 'Elsa',
    deceasedLastName: 'Snowman',
    deceasedMiddleInitial: 'B.',
    deceasedDateOfBirth: '1995-02-23',
    deceasedDateOfDeath: '2023-06-12',
    deceasedAge: 60,
    deceasedSelectedFuneralDate: '2023-06-24',
    deceasedSelectedFuneralTime: '8:00AM',

    ContactPersonFirstName: 'Via',
    ContactPersonLastName: 'Reid',
    ContactPersonMiddleName: 'J.',
    ContactPersonPlaceOfBirth: 'Mother',
    ContactPersonDOB: '0985747648',
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
                  <th colspan="15" class="text-left"><b>Deceased Information</b></th>
                  <th colspan="17">
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
                  <th class="text-left font-weight-bold">First Name</th>
                  <th class="text-left font-weight-bold">Last Name</th>
                  <th class="text-left font-weight-bold">Middle Initial</th>
                  <th class="text-left font-weight-bold">Relationship</th>
                  <th class="text-left font-weight-bold">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in desserts" :key="index">
                  <!-- Bride's Info -->
                  <td>{{ item.deceasedFirstName }}</td>
                  <td>{{ item.deceasedLastName }}</td>
                  <td>{{ item.deceasedMiddleInitial }}</td>
                  <td>{{ item.deceasedDateofBirth }}</td>
                  <td>{{ item.deceasedDateofDeath }}</td>
                  <td>{{ item.deceasedAge }}</td>
                  <td>{{ item.deceasedSelectedFuneralDate }}</td>
                  <td>{{ item.deceasedSelectedFuneralTime }}</td>

                  <!-- Groom's Info -->
                  <td>{{ item.groomFirstName }}</td>
                  <td>{{ item.groomLastName }}</td>
                  <td>{{ item.groomMiddleName }}</td>
                  <td>{{ item.groomPlaceOfBirth }}</td>
                  <td>{{ item.groomDOB }}</td>
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
