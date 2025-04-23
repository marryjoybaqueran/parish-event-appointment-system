<script setup>
import { ref } from 'vue'
import AdminHeader from '@/components/layout/AdminHeader.vue'

// Mock data: You can expand this or match it to actual form data
const desserts = ref([
  {
    BaptisedFirstName: 'Rapunzel',
    BaptisedLastName: 'Ron',
    BaptisedbrideMiddleInitial: 'M.',
    BaptisedPlaceOfBirth: 'Bonbon',
    BaptisedDateOfBirth: '2024-06-12',
    BaptisedDateSelected: '8:45 AM',
    BaptisedTimeSelected: 'Filipino',

    MotherFirstName: 'Liam',
    MotherLastName: 'Smith',
    MotherMiddleName: 'J.',

    FatherFirstName: 'Liam',
    FatherLastName: 'Smith',
    FatherMiddleName: 'J.',

    Sponsor1FirstName: 'Liam',
    Sponsor1LastName: 'Smith',
    Sponsor1MiddleName: 'J.',

    Sponsor2FirstName: 'Liam',
    Sponsor2LastName: 'Smith',
    Sponsor2MiddleName: 'J.',

    Sponsor3FirstName: 'Liam',
    Sponsor3LastName: 'Smith',
    Sponsor3MiddleName: 'J.',
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
                  <th colspan="7" class="text-left"><b>Baptised Information</b></th>
                  <th colspan="17">
                    <b>Mother's Name</b>
                  </th>

                  <th colspan="15" class="text-left"><b>Father's Name</b></th>
                  <th colspan="17">
                    <b>Sponsor 1</b>
                  </th>

                  <th colspan="15" class="text-left"><b>Sponsor 2</b></th>
                  <th colspan="17">
                    <b>Sponsor 3</b>
                  </th>
                </tr>
                <tr>
                  <!-- Baptised Information -->
                  <th class="text-left font-weight-bold">First Name</th>
                  <th class="text-left font-weight-bold">Last Name</th>
                  <th class="text-left font-weight-bold">Middle Initial</th>
                  <th class="text-left font-weight-bold">Place of Birth</th>
                  <th class="text-left font-weight-bold">Date of Birth</th>
                  <th class="text-left font-weight-bold">Date Selected</th>
                  <th class="text-left font-weight-bold">Time Selected</th>

                  <!-- Mother's Name -->
                  <th class="text-left font-weight-bold">First Name</th>
                  <th class="text-left font-weight-bold">Last Name</th>
                  <th class="text-left font-weight-bold">Middle Name</th>

                  <!-- Father's Name -->
                  <th class="text-left font-weight-bold">First Name</th>
                  <th class="text-left font-weight-bold">Last Name</th>
                  <th class="text-left font-weight-bold">Middle Name</th>

                  <!-- Sponsored by: -->
                  <th class="text-left font-weight-bold">First Name</th>
                  <th class="text-left font-weight-bold">Last Name</th>
                  <th class="text-left font-weight-bold">Middle Name</th>

                  <!-- Sponsored by: -->
                  <th class="text-left font-weight-bold">First Name</th>
                  <th class="text-left font-weight-bold">Last Name</th>
                  <th class="text-left font-weight-bold">Middle Name</th>

                  <!-- Sponsored by: -->
                  <th class="text-left font-weight-bold">First Name</th>
                  <th class="text-left font-weight-bold">Last Name</th>
                  <th class="text-left font-weight-bold">Middle Name</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in desserts" :key="index">
                  <!-- Baptised Info -->
                  <td>{{ item.BaptisedFirstName }}</td>
                  <td>{{ item.BaptisedLastName }}</td>
                  <td>{{ item.BaptisedMiddleInitial }}</td>
                  <td>{{ item.BaptisedPlaceOfBirth }}</td>
                  <td>{{ item.BaptisedDateOfBirth }}</td>
                  <td>{{ item.BaptisedDateSelected }}</td>
                  <td>{{ item.BaptisedTimeSelected }}</td>

                  <!-- Mothers Info -->
                  <td>{{ item.MotherFirstName }}</td>
                  <td>{{ item.MotherLastName }}</td>
                  <td>{{ item.MotherMiddleName }}</td>

                  <!-- Groom's Info -->
                  <td>{{ item.FatherFirstName }}</td>
                  <td>{{ item.FatherLastName }}</td>
                  <td>{{ item.FatherMiddleName }}</td>

                  <!-- Groom's Info -->
                  <td>{{ item.Sponsor1FirstName }}</td>
                  <td>{{ item.Sponsor1LastName }}</td>
                  <td>{{ item.Sponsor1MiddleName }}</td>

                  <!-- Groom's Info -->
                  <td>{{ item.Sponsor2FirstName }}</td>
                  <td>{{ item.Sponsor2LastName }}</td>
                  <td>{{ item.Sponsor2MiddleName }}</td>

                  <!-- Groom's Info -->
                  <td>{{ item.Sponsor3FirstName }}</td>
                  <td>{{ item.Sponsor3LastName }}</td>
                  <td>{{ item.Sponsor3MiddleName }}</td>
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
