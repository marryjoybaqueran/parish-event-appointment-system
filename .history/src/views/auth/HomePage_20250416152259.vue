<script setup>
import NavBar from '@/components/layout/NavBar.vue'
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <NavBar>
    <template #content>
      <v-container fluid>
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
              <!-- <v-icon right>mdi-arrow-right</v-icon>-->
              <v-card-actions>
                <v-btn color="orange-lighten-2" text="See more ➔"> </v-btn>
                <v-spacer></v-spacer>

                <v-btn
                  :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="show = !show"
                ></v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
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
                    Let’s spend this Holy Week together in prayer and reflection. Everyone is
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
                  :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="show = !show"
                ></v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
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
                  :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="show = !show"
                ></v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
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

<style scoped>
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
