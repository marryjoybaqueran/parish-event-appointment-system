<script setup>
import { ref } from 'vue'
import AdminHeader from '@/components/layout/AdminHeader.vue'

const loading = ref(false)
function reserve() {
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
}
</script>

<template>
  <AdminHeader>
    <template #content>
      <v-container fluid>
        <div class="bg-color">
          <v-img src="cross gif.gif" cover /></div>
        </div>
        <v-row>
          <v-col cols lg="6" md="12" sm="12">
            <v-card
              :disabled="loading"
              :loading="loading"
              class="mx-auto my-12 card-shadow"
              max-width="374"
            >
              <template v-slot:loader="{ isActive }">
                <v-progress-linear
                  :active="isActive"
                  color="deep-purple"
                  height="4"
                  indeterminate
                ></v-progress-linear>
              </template>

              <v-img height="250" src="public/announcement8.gif" cover></v-img>

              <v-card-item>
                <v-card-title class="card-title"> ANNOUNCEMENT MANAGER </v-card-title>
              </v-card-item>

              <v-divider class="mx-4 mb-1"></v-divider>
              <RouterLink to="/admin-announcement-manager" class="router-link">
                <v-card-actions>
                  <v-btn
                    class="view"
                    color="deep-purple-lighten-2"
                    text="View"
                    block
                    border
                    @click="reserve"
                  ></v-btn> </v-card-actions
              ></RouterLink>
            </v-card>
          </v-col>
          <v-col cols lg="6" md="12" sm="12">
            <v-card
              :disabled="loading"
              :loading="loading"
              class="my-12 card-shadow"
              max-width="374"
            >
              <template v-slot:loader="{ isActive }">
                <v-progress-linear
                  :active="isActive"
                  color="deep-purple"
                  height="4"
                  indeterminate
                ></v-progress-linear>
              </template>

              <v-img height="250" src="public/appointment5.gif" cover></v-img>

              <v-card-item>
                <v-card-title class="card-title"> APPOINMENTS LIST </v-card-title>
              </v-card-item>

              <v-divider class="mx-4 mb-1"></v-divider>
              <RouterLink to="/admin-booking-view" class="router-link">
                <v-card-actions>
                  <v-btn
                    color="deep-purple-lighten-2"
                    text="view"
                    block
                    border
                    @click="reserve"
                  ></v-btn> </v-card-actions
              ></RouterLink>
            </v-card> </v-col
        ></v-row>
      </v-container>
    </template>
  </AdminHeader>
</template>

<style scoped>
.bg-color {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  background-color: #ecc5fb;
}
.card-shadow {
  box-shadow:
    -4px 0px 12px rgba(0, 0, 0, 0.1),
    4px 0px 12px rgba(0, 0, 0, 0.1),
    0px 4px 12px rgba(0, 0, 0, 0.1);
}
.router-link {
  text-decoration: none;
  color: inherit;
}

.router-link:hover {
  text-decoration: none;
  background-color: skyblue;
}

.card-title {
  font-family: Cambria, Georgia, serif;
  font-weight: bolder;
  text-align: center;
}
</style>
