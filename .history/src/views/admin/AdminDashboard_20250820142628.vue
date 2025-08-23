<script setup>
import DashboardHeader from '@/components/layout/AdminHeader.vue'
import PreloaderView from '@/components/layout/PreloaderView.vue'
const surfaceColor = '#fff'
const curve = 40

const cards = [
  {
    image: 'Thanksgiving+Day+Mass.jpg',
    thumb:
      'https://static.vecteezy.com/system/resources/previews/024/277/794/non_2x/illustration-of-blessing-icon-in-flat-style-vector.jpg',
    title: 'Thanks Giving Mass Form List',
    link: '/thanksgiving-mass-form-bookinglist-view',
  },
  {
    image: 'weddingMass .png',
    thumb:
      'https://t4.ftcdn.net/jpg/10/70/41/13/360_F_1070411364_v5jwNkhBhfF96lMWYpsEL2n6HDMW5Eiv.jpg',
    title: 'Special Wedding Mass Form List',
    link: '/admin-booking-view',
  },
  {
    image: 'Baptism Mass.png',
    thumb: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/baptism-2647061-2195867.png',
    title: 'Baptism Mass Form List',
    link: '/baptism-mass-form-bookinglist-view',
  },
  {
    image: 'Funeral Mass.png',
    thumb:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0xNJsvUup5o5clS1lEOBViRkQ0ITR-VQ8NA&s',
    title: 'Funeral Mass Form List',
    link: '/funeral-mass-form-bookinglist-view',
  },
]
</script>

<template>
  <PreloaderView></PreloaderView>
  <DashboardHeader>
    <template #content>
      <v-container fluid>
        <div class="bg-wrapper">
          <!-- Video background -->
          <v-responsive aspect-ratio="16/9">
            <video
              autoplay
              muted
              loop
              playsinline
              style="width: 100%; height: 100%; object-fit: cover"
            >
              <source src="/silp bg gif.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </v-responsive>

          <!-- Black overlay -->
          <div class="bg-overlay"></div>
        </div>

        <div
          class="card-container"
          :style="{ '--surface-color': surfaceColor, '--curve': curve + 'px' }"
        >
          <row>
            <ul class="card-list">
              <li v-for="(card, index) in cards" :key="index">
                <a href="#" class="card">
                  <img :src="card.image" class="card__image" alt="" />
                  <div class="card__overlay">
                    <div class="card__header">
                      <svg class="card__arc" xmlns="http://www.w3.org/2000/svg">
                        <path />
                      </svg>
                      <img :src="card.thumb" class="card__thumb" alt="" />
                      <div class="card__header-text">
                        <h3 class="card__title">{{ card.title }}</h3>
                        <span v-if="card.tagline" class="card__tagline">{{ card.tagline }}</span>
                        <span class="card__status">{{ card.status }}</span>
                      </div>
                    </div>
                    <!-- Router Button (visible on hover) -->
                    <router-link :to="card.link" class="card__button"> View List </router-link>
                  </div>
                </a>
              </li>
            </ul>
          </row>
        </div>
      </v-container>
    </template>
  </DashboardHeader>
</template>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.cards {
  padding-top: 70px;
}
.float-card {
  animation: float 3s ease-in-out infinite;
}
.bg-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}
.center {
  max-width: auto;
  width: 100%;
  height: 100%;
}
.bg-wrapper > .v-responsive {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 2;
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

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 1rem;
  padding: 0;
  list-style-type: none;
}

.card {
  position: relative;
  display: block;
  height: 100%;
  border-radius: var(--curve);
  overflow: hidden;
  text-decoration: none;
  background-color: white;
}

.card__image {
  width: 100%;
  height: auto;
}

.card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  border-radius: var(--curve);
  background-color: var(--surface-color);
  transform: translateY(100%);
  transition: 0.2s ease-in-out;
}

.card:hover .card__overlay {
  transform: translateY(0);
}

.card__header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2em;
  padding: 1.5em;
  border-radius: var(--curve) 0 0 0;
  background-color: var(--surface-color);
  transform: translateY(-100%);
  transition: 0.2s ease-in-out;
}

.card:hover .card__header {
  transform: translateY(0);
}

.card__arc {
  width: 80px;
  height: 80px;
  position: absolute;
  bottom: 100%;
  right: 0;
  z-index: 1;
}

.card__arc path {
  fill: var(--surface-color);
  d: path('M 40 80 c 22 0 40 -22 40 -40 v 40 Z');
}

.card__thumb {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.card__title {
  font-size: 1em;
  margin: 0 0 0.3em;
  color: #6a515e;
}

.card__tagline {
  display: block;
  margin: 1em 0;
  font-size: 0.8em;
  color: #d7bdca;
}

.card__status {
  font-size: 0.8em;
  color: #d7bdca;
}

/*Button*/
.card__button {
  align-items: center;
  appearance: none;
  background-image: radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%);
  border: 0;
  border-radius: 6px;
  box-shadow:
    rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
    rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-family: 'Jomolhari', serif;
  height: 48px;
  justify-content: center;
  line-height: 1;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition:
    box-shadow 0.15s,
    transform 0.15s;
  user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow, transform;
  font-size: 18px;
}

.button:focus {
  box-shadow:
    #3c4fe0 0 0 0 1.5px inset,
    rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
    #3c4fe0 0 -3px 0 inset;
}

.button:hover {
  box-shadow:
    rgba(45, 35, 66, 0.4) 0 4px 8px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
    #3c4fe0 0 -3px 0 inset;
  transform: translateY(-2px);
}

.button:active {
  box-shadow: #3c4fe0 0 3px 7px inset;
  transform: translateY(2px);
}
</style>
