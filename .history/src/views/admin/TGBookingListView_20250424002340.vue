<script setup>
import { ref } from 'vue'
import AdminHeader from '@/components/layout/AdminHeader.vue'

// Mock data: You can expand this or match it to actual form data
const desserts = ref([
  {
    brideFirstName: 'Elsa',
    brideLastName: 'Rose',
    brideMiddleName: 'M.',
    bridePlaceOfBirth: 'Manila',
    brideDOB: '1995-06-12',
    brideAge: 29,
    brideCitizenship: 'Filipino',
    brideReligion: 'Catholic',
    brideCivilStatus: 'Single',
    brideSex: 'Female',
    brideResidence: 'QC',
    brideMotherName: 'Maria Rose',
    brideMotherCitizenship: 'Filipino',
    brideFatherName: 'Jose Rose',
    brideFatherCitizenship: 'Filipino',

    groomFirstName: 'Liam',
    groomLastName: 'Smith',
    groomMiddleName: 'J.',
    groomPlaceOfBirth: 'Cebu',
    groomDOB: '1990-11-22',
    groomAge: 34,
    groomCitizenship: 'Filipino',
    groomReligion: 'Catholic',
    groomCivilStatus: 'Single',
    groomSex: 'Male',
    groomResidence: 'Makati',
    groomMotherName: 'Linda Smith',
    groomMotherCitizenship: 'Filipino',
    groomFatherName: 'John Smith',
    groomFatherCitizenship: 'Filipino',
    weddingDate: '2025-06-01',
    weddingTime: '3:00 PM',
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
                  <td>{{ item.brideFirstName }}</td>
                  <td>{{ item.brideLastName }}</td>
                  <td>{{ item.brideMiddleName }}</td>
                  <td>{{ item.bridePlaceOfBirth }}</td>
                  <td>{{ item.brideDOB }}</td>
                  <td>{{ item.brideAge }}</td>
                  <td>{{ item.brideCitizenship }}</td>
                  <td>{{ item.brideReligion }}</td>
                  <td>{{ item.brideCivilStatus }}</td>
                  <td>{{ item.brideSex }}</td>
                  <td>{{ item.brideResidence }}</td>
                  <td>{{ item.brideMotherName }}</td>
                  <td>{{ item.brideMotherCitizenship }}</td>
                  <td>{{ item.brideFatherName }}</td>
                  <td>{{ item.brideFatherCitizenship }}</td>

                  <!-- Groom's Info -->
                  <td>{{ item.groomFirstName }}</td>
                  <td>{{ item.groomLastName }}</td>
                  <td>{{ item.groomMiddleName }}</td>
                  <td>{{ item.groomPlaceOfBirth }}</td>
                  <td>{{ item.groomDOB }}</td>
                  <td>{{ item.groomAge }}</td>
                  <td>{{ item.groomCitizenship }}</td>
                  <td>{{ item.groomReligion }}</td>
                  <td>{{ item.groomCivilStatus }}</td>
                  <td>{{ item.groomSex }}</td>
                  <td>{{ item.groomResidence }}</td>
                  <td>{{ item.groomMotherName }}</td>
                  <td>{{ item.groomMotherCitizenship }}</td>
                  <td>{{ item.groomFatherName }}</td>
                  <td>{{ item.groomFatherCitizenship }}</td>
                  <td>{{ item.weddingDate }}</td>
                  <td>{{ item.weddingTime }}</td>
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
