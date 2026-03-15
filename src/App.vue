<template>
  <div id="app">
    <div v-if="false" class="logo"> 
      <img src="./assets/logo.png" alt="logo">
    </div>
    
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
/* Глобальные стили всего приложения */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

/* Стили для лого */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>