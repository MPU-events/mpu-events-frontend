<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Страница не найдена</p>
    <router-link to="/">На главную</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px;
}

.not-found h1 {
  font-size: 72px;
  color: #ff2fa8;
}

.not-found a {
  color: #ff2fa8;
  text-decoration: none;
  font-size: 18px;
}
</style>