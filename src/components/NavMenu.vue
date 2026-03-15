<template>
  <nav class="nav-menu">
    <router-link to="/login">Войти</router-link>
    <router-link to="/posts">Посты</router-link>
    <router-link to="/register">регистрация</router-link>
    <router-link to="/confirm">подтверждение</router-link>
  </nav>
</template>

<style scoped>
.nav-menu {
  padding: 20px;
  background: #f5f5f5;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* Стили для активной ссылки */
.router-link-active {
  color: #ff2fa8;
  font-weight: bold;
}

.router-link-exact-active {
  border-bottom: 2px solid #ff2fa8;
}
</style>