<script setup>
import { ref } from 'vue'
import AdminHeader from '@/components/layout/AdminHeader.vue'
import ProfileHeader from '@/components/layout/ProfileHeader.vue'
const loading = ref(false)
const selection = ref(1)
function reserve() {
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
}
</script>

<template>
  <AdminHeader>
    <template #content>
      <v-container fluid>
        <v-row>
          <v-col cols>
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

              <v-img height="250" src="public/announcement4.gif" cover></v-img>

              <v-card-item>
                <v-card-title> ANNOUNCEMENT MANAGER </v-card-title>

                <v-card-subtitle>
                  <span class="me-1">Local Favorite</span>

                  <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>
                </v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <v-row align="center" class="mx-0">
                  <v-rating
                    :model-value="4.5"
                    color="amber"
                    density="compact"
                    size="small"
                    half-increments
                    readonly
                  ></v-rating>

                  <div class="text-grey ms-4">4.5 (413)</div>
                </v-row>

                <div class="my-4 text-subtitle-1">$ • Italian, Cafe</div>

                <div>
                  Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus
                  patio seating.
                </div>
              </v-card-text>

              <v-divider class="mx-4 mb-1"></v-divider>

              <v-card-title>Tonight's availability</v-card-title>

              <div class="px-4 mb-2">
                <v-chip-group v-model="selection" selected-class="bg-deep-purple-lighten-2">
                  <v-chip>5:30PM</v-chip>

                  <v-chip>7:30PM</v-chip>

                  <v-chip>8:00PM</v-chip>

                  <v-chip>9:00PM</v-chip>
                </v-chip-group>
              </div>

              <v-card-actions>
                <v-btn
                  color="deep-purple-lighten-2"
                  text="Reserve"
                  block
                  border
                  @click="reserve"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols>
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

              <v-img height="250" src="public/appointment3.gif" cover></v-img>

              <v-card-item>
                <v-card-title> APPOINMENTS LIST </v-card-title>

                <v-card-subtitle>
                  <span class="me-1">Local Favorite</span>

                  <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>
                </v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <v-row align="center" class="mx-0">
                  <v-rating
                    :model-value="4.5"
                    color="amber"
                    density="compact"
                    size="small"
                    half-increments
                    readonly
                  ></v-rating>

                  <div class="text-grey ms-4">4.5 (413)</div>
                </v-row>

                <div class="my-4 text-subtitle-1">$ • Italian, Cafe</div>

                <div>
                  Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus
                  patio seating.
                </div>
              </v-card-text>

              <v-divider class="mx-4 mb-1"></v-divider>

              <v-card-title>Tonight's availability</v-card-title>

              <div class="px-4 mb-2">
                <v-chip-group v-model="selection" selected-class="bg-deep-purple-lighten-2">
                  <v-chip>5:30PM</v-chip>

                  <v-chip>7:30PM</v-chip>

                  <v-chip>8:00PM</v-chip>

                  <v-chip>9:00PM</v-chip>
                </v-chip-group>
              </div>

              <v-card-actions>
                <v-btn
                  color="deep-purple-lighten-2"
                  text="Reserve"
                  block
                  border
                  @click="reserve"
                ></v-btn>
              </v-card-actions>
            </v-card> </v-col
        ></v-row>
      </v-container>
    </template>
  </AdminHeader>
</template>

<style scoped>
.card-shadow {
  box-shadow:
    -4px 0px 12px rgba(0, 0, 0, 0.1),
    4px 0px 12px rgba(0, 0, 0, 0.1),
    0px 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
