<!--<script setup>
import NavBar from '@/components/layout/NavBar.vue'
import { ref } from 'vue'

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)
</script>

<template>
  <NavBar>
    <template #content>
      <v-container fluid>
        <div class="bg-wrapper">
         Video background
          <v-responsive aspect-ratio="16/9">
            <video
              autoplay
              muted
              loop
              playsinline
              style="width: 100%; height: 100%; object-fit: cover"
            >
              <source src="public/homepage-bg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </v-responsive>

         Black overlay
          <div class="bg-overlay"></div>
        </div>
     <div class="bg-color"></div>

        <v-row>
          <v-col><h3 class="uppercase-text">Announcement Dashboard</h3> </v-col></v-row
        >
        <v-row>
          <v-col class="cardz">
            <v-card class="mx-auto card-shadow" max-width="344">
              <v-img height="200px" src="public/holyweek.jpg" cover></v-img>

              <v-card-title class="card-title">
                <b> HOLY WEEK MASS ACTIVITIES 2025 </b></v-card-title
              >

              <v-card-subtitle class="dates"> <b> Date Posted: </b>April 10, 2025 </v-card-subtitle>
              <v-card-text class="text2">
                We invite everyone to join us in remembering the passion, death, and resurrection of
                Jesus Christ this <b>Holy Week</b>. Here are the important activities happening in
                our parish:
              </v-card-text>
              <v-icon right>mdi-arrow-right</v-icon>
              <v-card-actions>
                <v-btn color="orange-lighten-2" text="See more ➔"> </v-btn>
                <v-spacer></v-spacer>

                <v-btn
                  :icon="show1 ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="show1 = !show1"
                ></v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show1">
                  <v-divider></v-divider>

                  <v-card-text class="text1">
                    <h3 class="no-italic">🕊️ PALM SUNDAY (Bendita sa Lukay)</h3>
                    <br />📅 <i>April 13 | 🕗 7:00 AM </i> <br />
                    <br />
                    ▫️ Regular Mass <br />
                    <br />
                    <hr />
                    <br />
                    <h3 class="no-italic">📖 HOLY MONDAY (Lunes Santo)</h3>
                    <br />📅 <i>April 14 | 🕗 5:00 PM </i> <br />
                    <br />
                    ▫️ Confession - in our respective Parish <br />
                    <br />
                    <hr />
                    <br />
                    <h3 class="no-italic">🙏 HOLY TUESDAY (Martes Santo)</h3>
                    <br />📅 <i>April 15 | 🕗 9:00 AM </i> <br />
                    <br />
                    ▫️ Crism Mass @Cathedral <br />
                    <br />
                    <hr />
                    <br />
                    <h3 class="no-italic">🕯️ HOLY WEDNESDAY (Miyerkules Santo)</h3>
                    <br />📅 <i>April 16 | in our respective Parish</i> <br />
                    <br />
                    ▫️ 🕗 6:00 AM - Regular Mass <br />
                    ▫️ 🕗9:00 AM - Mass for the Sick (Alagad Renewal)<br />
                    <br />
                    <hr />
                    <br />
                    <h3 class="no-italic">✝️ MAUNDAY THURSDAY (Huwebes Santo)</h3>
                    <br />📅 <i> April 17 | 🕗 5:30 PM</i> <br />
                    <br />
                    ▫️ Hugas sa Tiil - in our respective Parish<br />
                    <br />
                    <hr />
                    <br />
                    <h3 class="no-italic">🕯️ GOOD FRIDAY (Biyernes Santo)</h3>
                    <br />📅 <i> April 18 | </i> <br />
                    <br />
                    ▫️ 🕗 3:00 AM - Station of the Cross (Magsugod sa Simbahan, 1st Station) <br />
                    ▫️ 🕗 1:00 PM - Veneration of the Cross - Motorcade Santo Entierro and Mater
                    Dolorosa
                    <br />
                    <br />
                    <hr />
                    <br />
                    <h3 class="no-italic">🕳️ BLACK SATURDAY (Sabado De Gloria)</h3>
                    <br />📅 <i>April 19 | 🕗 5:30 PM </i> <br />
                    <br />
                    ▫️ Pagbag-o sa Kalayo sa tubig - in our respective Parish <br />
                    <br />
                    <hr />
                    <br />
                    <h3 class="no-italic">🌅 EASTER SUNDAY (Dominggo sa Pagkabanhaw)</h3>
                    <br />📅 <i>April 20 | 🕗 4:00 AM </i> <br />
                    <br />
                    ▫️ Sugat- Parish Ground <br />
                    <br />
                    <hr />
                    <br />
                    Let's spend this Holy Week together in prayer and reflection. Everyone is
                    welcome to attend!!
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>

          <v-col>
            <v-card class="mx-auto card-shadow" max-width="344">
              <v-img height="200px" src="public/banner-sunday-mass.jpg" cover></v-img>

              <v-card-title class="card-title"> <b> SUNDAY MASS SCHEDULE </b> </v-card-title>

              <v-card-subtitle class="dates"> <b> Date Posted: </b>April 21, 2025</v-card-subtitle>
              <v-card-text class="text2">
                Join us every Sunday to celebrate the Holy Mass! Let's receive God’s love and
                blessings together. Multiple schedules of Fr. Nilo & Fr. Robin are posted below.
              </v-card-text>

              <v-card-actions>
                <v-btn color="orange-lighten-2" text="See more ➔"></v-btn>

                <v-spacer></v-spacer>

                <v-btn
                  :icon="show2 ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="show2 = !show2"
                ></v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show2">
                  <v-divider></v-divider>

                  <v-card-text class="text1">
                    <h3 class="no-italic">👩‍⚖️ REV. FR. NILO LAPEZ</h3>
                    <br />📅 <i>April 26 | 5th Sunday of Lent </i> <br />
                    <br />
                    <hr />
                    <br />
                    ▫️ 🕗 6:00 AM - Birhen sa Carmen Chapel [LOWER BONBON] <br />
                    <br />
                    ▫️ 🕗 7:30 AM - San Jose Chapel [KINAMLUTAN] <br />
                    <br />▫️ 🕗 9:00 AM - San Vicente Ferrer Chapel [DUMAYOCDOC] <br />
                    <br />▫️ 🕗 10:30 AM - San Vicente Ferrer Chapel [UGABANG] <br />
                    <br />▫️ 🕗 5:00 PM - SILP [CENTRO] <br />
                    <br />
                    <hr />
                    <br />
                    <h3 class="no-italic">👩‍⚖️ REV. FR. ROBIN DUMAGUIT</h3>
                    <br />📅 <i>April 26 | 5th Sunday of Lent </i> <br />
                    <br />

                    <hr />
                    <br />
                    ▫️ 🕗 6:00am - SILP [Centro] <br />

                    <br />▫️ 🕗 7:30am - Birhen sa Baranggay Chapel [MILLENNIUM] <br />
                    <br />▫️ 🕗 9:00am - Christ the King Chapel [NAPOCOR] <br />
                    <br />▫️ 🕗 5:00pm - San Jose Chapel [KINAMLUTAN] <br />
                    <br />
                    <hr />
                    <br />
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="mx-auto card-shadow" max-width="344">
              <v-img height="200px" src="public/GKK.jpg" cover></v-img>

              <v-card-title class="card-title"> GKK MASS SCHEDULE 2025 </v-card-title>

              <v-card-subtitle class="dates"> <b> Date Posted: </b>April 25, 2025 </v-card-subtitle>
              <v-card-text class="text2">
                Celebrate the Holy Mass with our local community through the GKK. Masses are
                scheduled in different houses to bring the Eucharist closer to us.
              </v-card-text>

              <v-card-actions>
                <v-btn color="orange-lighten-2" text="See more ➔"></v-btn>

                <v-spacer></v-spacer>

                <v-btn
                  :icon="show3 ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="show3 = !show3"
                ></v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show3">
                  <v-divider></v-divider>

                  <v-card-text class="text1">
                    <h3 class="no-italic">🏡 HOUSE-TO-HOUSE MASS</h3>
                    <br />
                    <hr />

                    <br />📅 <i>March 29 | Friday </i> <br />
                    <br />
                    ▫️ 🕗 6:00 PM - GKK 1 Mass [CENTRO] <br />
                    <br />
                    <hr />

                    <br />📅 <i>April 1 | Monday </i> <br />
                    <br />
                    ▫️ 🕗 7:00 AM - GKK 2 Mass [CENTRO]<br />
                    <br />
                    <hr />
                    <br />📅 <i>April 5 | Thursday </i> <br />
                    <br />▫️ 🕗 9:00 AM - GKK 3 Mass [CENTRO] <br />
                    <br />
                    <hr />
                    <br />📅 <i>April 8 | Friday </i> <br />
                    <br />▫️ 🕗 10:30 AM - GKK 4 Mass [CENTRO] <br />
                    <br />
                    <hr />
                    <br />📅 <i>April 11 | Tuesday </i> <br />
                    <br />▫️ 🕗 11:00 PM - GKK 5 Mass [CENTRO] <br />
                    <br />
                    <hr />
                    <br />📅 <i>April 14 | Saturday </i> <br />
                    <br />

                    ▫️ 🕗 7:00 AM - GKK 6 Mass [CENTRO]<br />
                    <br />
                    <hr />

                    <br />📅 <i>April 17 | Tuesday </i> <br />
                    <br />▫️ 🕗 1:00 AM - GKK 7 Mass [CENTRO] <br />
                    <br />
                    <hr />
                    <br />📅 <i>April 20 | Friday </i> <br />
                    <br />▫️ 🕗 2:30 AM - GKK 8 Mass [CENTRO] <br />
                    <br />
                    <hr />
                    <br />📅 <i>April 23 | Friday </i> <br />
                    <br />▫️ 🕗 5:00 PM - GKK 9 Mass [CENTRO] <br />
                    <br />
                    <hr />

                    <br />📅 <i>April 26 | Friday </i> <br />
                    <br />

                    ▫️ 🕗 7:00 AM - GKK 10 Mass [CENTRO]<br />
                    <br />
                    <hr />

                    <br />📅 <i>April 26 | Friday </i> <br />
                    <br />▫️ 🕗 1:00 AM - GKK 11 Mass [CENTRO] <br />
                    <br />
                    <hr />
                    <br />📅 <i>April 29 | Friday </i> <br />
                    <br />▫️ 🕗 2:30 AM - GKK 12 Mass [CENTRO] <br />

                    <br />
                    <hr />
                    <br />
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </NavBar>
</template>

<style scoped></style>
.bg-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

/* Make sure v-responsive fills the wrapper */
.bg-wrapper > .v-responsive {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* The dark overlay */
.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15); /* 25% opacity */
  z-index: 1;
}

.card-shadow {
  box-shadow:
    -4px 0px 12px rgba(0, 0, 0, 0.1),
    4px 0px 12px rgba(0, 0, 0, 0.1),
    0px 4px 12px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-family: Cambria, Georgia, serif;
  font-weight: bolder;
}

.dates {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.text1 {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-style: italic;
  font-weight: bold;
  letter-spacing: 1px;
  line-height: 1.5;
}
.text2 {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

.no-italic {
  font-style: normal;
}
</style>
-->
<script setup>
import { ref, onMounted } from 'vue'
import { useAnnouncementsStore } from '@/stores/eventStore.js'
import NavBar from '@/components/layout/NavBar.vue'

const announcementsStore = useAnnouncementsStore()
const tableFilters = ref({
  search: '',
})

import { useDisplay } from 'vuetify'
const { mobile, smAndDown } = useDisplay()

// On page load, fetch announcements
onMounted(async () => {
  // Fetch announcements if they aren't already loaded
  if (announcementsStore.announcements.length === 0) {
    await announcementsStore.getAnnouncements(tableFilters.value)
  }
})
onMounted(() => {
  class TxtType {
    constructor(el, toRotate, period) {
      this.toRotate = toRotate
      this.el = el
      this.loopNum = 0
      this.period = parseInt(period, 10) || 2000
      this.txt = ''
      this.tick()
      this.isDeleting = false
    }

    tick() {
      const i = this.loopNum % this.toRotate.length
      const fullTxt = this.toRotate[i]

      this.txt = this.isDeleting
        ? fullTxt.substring(0, this.txt.length - 1)
        : fullTxt.substring(0, this.txt.length + 1)

      this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>'

      let delta = 200 - Math.random() * 100
      if (this.isDeleting) delta /= 2

      if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period
        this.isDeleting = true
      } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false
        this.loopNum++
        delta = 500
      }

      setTimeout(() => this.tick(), delta)
    }
  }

  const elements = document.getElementsByClassName('typewrite')
  for (let i = 0; i < elements.length; i++) {
    const toRotate = elements[i].getAttribute('data-type')
    const period = elements[i].getAttribute('data-period')
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period)
    }
  }
})
</script>

<template>
  <NavBar>
    <template #content>
      <v-container fluid pa-0>
        <!--Background Image-->
        <div class="bg-wrapper">
          <v-responsive aspect-ratio="16/9">
            <video
              autoplay
              muted
              loop
              playsinline
              style="height: 100%; width: 100%; object-fit: cover"
            >
              <source src="/homepage-bg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </v-responsive>
        </div>

        <v-row class="mt-10">
          <!-- Left Half: Video Background with Welcome Text -->

          <v-col cols="12" md="6" class="position-relative">
            <!-- Headline Top Left -->
            <h1 class="text-top text-uppercase" :class="mobile ? 'small-text' : 'large-text'">
              Faith. Community. Worship.
              <a class="typewrite" data-period="2000" data-type='["Welcome to our website!"]'>
                <span class="wrap"></span>
              </a>
            </h1>

            <!-- Centered Text & Button -->

            <p class="text-left" :class="smAndDown ? 'small-p text-center' : 'large-p'">
              Easily book parish services and pick the perfect schedule for your special moment —
              anytime, online.
            </p>
            <br />
            <br />

            <RouterLink to="/book-event" class="router-link">
              <v-btn
                class="btn-0 mt-4 rounded-pill button"
                size="x-large"
                variant="flat"
                :class="smAndDown ? 'small-header' : 'large-header'"
              >
                Book Now
              </v-btn></RouterLink
            >
          </v-col>
          <br />

          <v-col cols="12" md="6">
            <v-img src="gridpic.jpg" class="float-card"></v-img>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </NavBar>
</template>

<style scoped>
/* your CSS remains same */
.button {
  display: block;
  margin: 0 auto;
}
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

.float-card {
  animation: float 3s ease-in-out infinite;
}

.cardx {
  border-color: rgb(49, 49, 95);
}
.heart {
  background-color: whitesmoke;
}

body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

h1 {
  font-family: 'Jomolhari', serif;
  font-weight: 700;
  color: rgb(49, 49, 95);
}

.small-text {
  font-size: 30px;
  text-align: center;
}

.large-text {
  font-size: 3rem;
}

.bg-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  padding-left: 40px;
  object-fit: cover;
}

p {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  color: rgb(23, 26, 25);
}

.btn-0 {
  background-color: rgb(49, 49, 95);
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  color: rgb(204, 195, 195);
  font-weight: bold;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.btn-0:hover {
  transform: translateY(-12px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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
  background-color: rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.card-shadow {
  box-shadow:
    -4px 0px 12px rgba(0, 0, 0, 0.1),
    4px 0px 12px rgba(0, 0, 0, 0.1),
    0px 4px 12px rgba(0, 0, 0, 0.1);
}

.typewrite {
  color: rgb(116, 39, 39);
  text-decoration: none;
}

.card-title {
  font-family: Cambria, Georgia, serif;
  font-weight: bolder;
  text-align: center;
}

.dates {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.text2 {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}
.text-uppercase {
  text-transform: uppercase;
  font-weight: bold;
}

.text-left {
  padding-bottom: 60px;
  text-align: center;
}

.text-top {
  padding-bottom: 60px;
}

.small-p {
  font-size: 20px;
  text-align: center;
}

.large-p {
  font-size: 22px;
}

.router-link {
  text-decoration: none;
  color: inherit;
}

.router-link:hover {
  text-decoration: none;
}
</style>
