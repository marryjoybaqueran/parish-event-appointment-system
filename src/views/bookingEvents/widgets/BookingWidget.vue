<script setup>
const emit = defineEmits(['selected'])

const items = [
  {
    name: '💍 Special Wedding Mass',
    description: 'Celebrate your sacred union',
    color: 'pink-lighten-4',
    icon: 'mdi-heart',
  },
  {
    name: '⚰️ Funeral Mass',
    description: 'Honor and remember',
    color: 'grey-lighten-3',
    icon: 'mdi-cross',
  },
  {
    name: '🎁 Thanksgiving Mass',
    description: 'Express gratitude and joy',
    color: 'amber-lighten-4',
    icon: 'mdi-gift',
  },
  {
    name: '✝️ Baptism Mass (Christening)',
    description: 'Welcome new life in faith',
    color: 'blue-lighten-4',
    icon: 'mdi-water',
  },
]

function selectItem(item) {
  emit('selected', item)
}
</script>

<template>
  <v-card rounded="lg" elevation="12">
    <v-card-title class="text-h6 text-center">Choose an event</v-card-title>
    <v-card-text>
      <v-row class="g-6">
        <v-col v-for="item in items" :key="item.name" cols="12" sm="6" lg="3">
          <v-card
            rounded="lg"
            elevation="8"
            :class="item.color"
            @click.stop="selectItem(item)"
            hover
            class="mass-card fixed-size-card"
          >
            <v-card-text class="pa-6 text-center">
              <v-icon :icon="item.icon" size="48" class="mb-4" color="primary" />

              <h3 class="text-subtitle-2 font-weight-medium mb-3">
                {{ item.name.replace(/^[^\s]*\s/, '') }}
              </h3>

              <p class="text-body-2 mb-4">
                {{ item.description }}
              </p>

              <div v-if="item.name && item.name.startsWith('💍')">
                <v-row class="d-flex justify-center" align="center" no-gutters>
                  <v-btn
                    variant="outlined"
                    color="primary"
                    size="small"
                    class="mx-1 my-2"
                    href="/pdf/marriage_banns.pdf"
                    target="_blank"
                    rel="noopener"
                    download
                    width="100%"
                    @click.stop
                  >
                    Marriage Banns
                    <v-icon end>mdi-download</v-icon>
                  </v-btn>

                  <v-btn
                    variant="outlined"
                    color="primary"
                    size="small"
                    class="mx-1 my-2"
                    href="/pdf/marriage_interview.pdf"
                    target="_blank"
                    rel="noopener"
                    download
                    width="100%"
                    @click.stop
                  >
                    Marriage Interview
                    <v-icon end>mdi-download</v-icon>
                  </v-btn>

                  <v-btn
                    variant="outlined"
                    color="primary"
                    size="small"
                    class="mx-1 my-2"
                    href="/pdf/jurisdiction_for_marriage.pdf"
                    target="_blank"
                    rel="noopener"
                    download
                    width="100%"
                    @click.stop
                  >
                    Jurisdiction
                    <v-icon end>mdi-download</v-icon>
                  </v-btn>
                </v-row>
              </div>
              <div v-else>
                <v-btn variant="outlined" color="primary" size="small">
                  Download Form
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* reuse some classes from BookEvent.vue for consistent look */
.fixed-size-card {
  width: 260px;
  max-width: 260px;
  height: 320px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
}

.mass-card {
  height: 100%;
  border-radius: 16px !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mass-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
}
</style>
