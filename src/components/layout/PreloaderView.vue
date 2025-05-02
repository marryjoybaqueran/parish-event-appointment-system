<!--<script setup>
import { ref, onMounted } from 'vue'

const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 5000)
})
</script>

<template>
  <div v-if="isLoading" class="preloaderBg">
    <div class="preloader"></div>
    <div class="preloader2"></div>
  </div>
</template>

<style scoped>
.preloaderBg {
  position: fixed;
  z-index: 10;
  top: 0;
  background: #fff;
  width: 100%;
  height: 100%;
  text-align: center;
}

.preloader {
  margin: auto;
  background: url(logo.png) no-repeat center;
  background-size: 150px;
  width: 300px;
  height: 300px;
}

.preloader2 {
  border: 5px solid #f3f3f3;
  border-top: 5px solid gold;
  border-radius: 50%;
  width: 250px;
  height: 250px;
  animation: spin 1s ease-in-out infinite;
  position: relative;
  margin: auto;
  top: -280px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
-->
<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)

onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    loading.value = false
  }, 3000)
})
</script>

<template>
  <!-- Show loading spinner while loading -->
  <transition name="fade" appear>
    <div v-if="loading" class="preloader-container">
      <div class="loading-spinner"></div>
    </div>
  </transition>
</template>

<style scoped>
/* Fade transition classes */

.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.preloader-container {
  position: fixed;
  inset: 0;
  background-color: #0087ca;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) translateZ(0);
  width: 90px;
  height: 90px;
  z-index: 1000;
  background: url(logo.png) center no-repeat;
  background-size: contain;
}

.loading-spinner::after {
  content: '';
  position: absolute;
  width: 120px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 100%;
  margin: -15px;
  box-shadow: 0 4px 0 0 #eab532;
  animation: lds-eclipse 1s linear infinite;
}

@keyframes lds-eclipse {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
