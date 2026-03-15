<template>
  <div class="register-container" :class="{ 'mobile-view': isMobile }">
    <!-- Десктоп версия (левая панель) -->
    <div v-if="!isMobile" class="left-panel">
      <div class="logo">АФИША</div>
      <h1 class="title">Твой пропуск</h1>
      <span class="subtitle">в мир событий Московского Политеха</span>
      <p class="desc">
        Мы собираем для тебя все самые интересные мероприятия,
        форумы и возможности. От концертов и выставок до студенческих
        клубов — найди свой способ реализовать таланты и весело провести время!
      </p>
    </div>

    <!-- Форма регистрации (и для десктопа, и для мобилки) -->
    <div class="form-panel" :class="{ 'mobile-form': isMobile }">
      <div class="form-wrapper" :class="{ 'mobile-wrapper': isMobile }">
        <!-- Лого для мобилки -->
        <img v-if="isMobile" src="/media/logo.png" alt="Логотип" class="mobile-logo">

        <h1 class="form-title" :class="{ 'mobile-title': isMobile }">
          {{ isMobile ? 'Регистрация' : 'Регистрация' }}
        </h1>

        <!-- Сообщения об ошибках/успехе -->
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="success" class="alert alert-success">{{ success }}</div>

        <form @submit.prevent="handleRegister" class="register-form">
          <!-- Email -->
          <label class="form-label">
            <span>Электронная почта</span>
            <input 
              type="email" 
              v-model="form.email" 
              placeholder="Введите электронную почту"
              required
            >
          </label>

          <!-- Фамилия и Имя (рядом на десктопе, друг под другом на мобилке) -->
          <div class="name-row" :class="{ 'mobile-name-row': isMobile }">
            <label class="form-label half">
              <span>Фамилия</span>
              <input 
                type="text" 
                v-model="form.last_name" 
                placeholder="Введите фамилию"
                required
              >
            </label>

            <label class="form-label half">
              <span>Имя</span>
              <input 
                type="text" 
                v-model="form.first_name" 
                placeholder="Введите имя"
                required
              >
            </label>
          </div>

          <!-- Номер группы (только для мобилки) -->
          <label v-if="isMobile" class="form-label">
            <span>Номер группы</span>
            <input 
              type="text" 
              v-model="form.group_number" 
              placeholder="Введите номер группы"
              required
            >
          </label>

          <!-- Пароль -->
          <label class="form-label">
            <span>Пароль</span>
            <input 
              type="password" 
              v-model="form.password" 
              placeholder="Введите пароль"
              minlength="8"
              required
            >
          </label>

          <!-- Подтверждение пароля (только для мобилки) -->
          <label v-if="isMobile" class="form-label">
            <span>Подтверждение пароля</span>
            <input 
              type="password" 
              v-model="form.confirm_password" 
              placeholder="Повторите пароль"
              required
            >
          </label>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Отправляем...' : isMobile ? 'Зарегистрироваться' : 'Готово!' }}
          </button>
        </form>

        <!-- Ссылка на вход -->
        <span class="login-link">
          {{ isMobile ? 'Уже есть аккаунт?' : 'Ты уже с нами?' }}
          <router-link to="/login">вход</router-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isMobile = ref(window.innerWidth <= 768)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const form = reactive({
  email: '',
  first_name: '',
  last_name: '',
  group_number: '',
  password: '',
  confirm_password: ''
})

const isLoading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  error.value = ''
  success.value = ''

  if (!form.email || !form.first_name || !form.last_name || !form.password) {
    error.value = 'Пожалуйста, заполните все поля'
    return
  }

  if (isMobile.value && form.password !== form.confirm_password) {
    error.value = 'Пароли не совпадают'
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        group_number: form.group_number,
        password: form.password
      })
    })

    const data = await response.json()

    if (response.ok) {
      if (data.user_id) {
        localStorage.setItem('registeredUserId', String(data.user_id))
      }
      
      success.value = 'Регистрация успешна! Перенаправляем...'
      
      setTimeout(() => {
        router.push('/confirm')
      }, 1500)
    } else {
      error.value = data.message || data.detail || 'Ошибка регистрации'
    }
  } catch (err) {
    console.error('Register error:', err)
    error.value = 'Проблема с подключением к серверу'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Общие стили */
.register-container {
  min-height: 100vh;
  display: flex;
  font-family: "Gilroy", sans-serif;
}

/* ========== ДЕСКТОП ВЕРСИЯ ========== */
.left-panel {
  width: 50%;
  background: linear-gradient(to bottom, #ff2fa8 0 50%, #ffffff 50% 100%);
  color: white;
  padding: 30px 50px;
  position: relative;
  overflow: hidden;
}

.logo {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 60px;
}

.left-panel .title {
  font-size: 42px;
  font-weight: 800;
  margin-left: 40px;
}

.left-panel .subtitle {
  display: inline-block;
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 1.5px;
  margin-top: 10px;
  margin-left: 40px;
}

.left-panel .desc {
  font-size: 16px;
  font-weight: 600;
  margin-top: 40px;
  line-height: 1.5;
  letter-spacing: 0.5px;
  max-width: 340px;
  margin-left: 200px;
}

/* Форма на десктопе */
.form-panel {
  width: 50%;
  background: linear-gradient(to bottom, #ff2fa8 0 50%, #ffffff 50% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.form-wrapper {
  background: white;
  padding: 50px;
  border-radius: 35px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 0 40px rgba(0,0,0,0.15);
}

.form-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 30px;
  color: #ff2fa8;
}

/* ========== МОБИЛЬНАЯ ВЕРСИЯ ========== */
.register-container.mobile-view {
  flex-direction: column;
  background: white;
}

.mobile-view .form-panel {
  width: 100%;
  background: white;
  padding: 20px;
  min-height: 100vh;
  align-items: flex-start;
}

.mobile-view .form-wrapper {
  background: transparent;
  box-shadow: none;
  padding: 20px 0;
  border-radius: 0;
}

.mobile-logo {
  max-width: 5rem;
  max-height: 5rem;
  object-fit: cover;
  margin: 20px auto;
  display: block;
}

.mobile-title {
  font-size: 24px !important;
  color: black !important;
  text-align: center;
  margin-bottom: 20px;
}

/* Общие стили для формы */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.form-label {
  display: flex;
  flex-direction: column;
  color: #909090;
  gap: 0.4rem;
  font-size: 16px;
  width: 100%;
}

.form-label.half {
  width: 48%;
}

.name-row {
  display: flex;
  gap: 4%;
  width: 100%;
}

.name-row.mobile-name-row {
  flex-direction: column;
  gap: 1rem;
}

.mobile-name-row .form-label.half {
  width: 100%;
}

input {
  border: 1px solid #D4D4D4;
  background-color: transparent;
  color: #333;
  border-radius: 15px;
  font-size: 13px;
  padding: 1rem;
  width: 100%;
  transition: all 0.3s;
}

input:focus {
  border-color: #ff2fa8;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(255, 47, 168, 0.25);
}

input::placeholder {
  color: #D4D4D4;
}

/* Кнопка */
.submit-btn {
  background: #ff2fa8;
  color: white;
  border-radius: 3rem;
  width: 100%;
  border: 0;
  padding: 0.8rem;
  font-size: 20px;
  font-weight: 600;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #ff1d9c;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 47, 168, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Ссылка на вход */
.login-link {
  text-align: center;
  font-size: 16px;
  margin-top: 20px;
  display: block;
}

.login-link a {
  color: #ff2fa8;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
}

.login-link a:hover {
  text-decoration: underline;
}

/* Алерты */
.alert {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-danger {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

/* Медиа-запрос для мобилок */
@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }
  
  .form-panel {
    width: 100%;
    background: white;
    padding: 20px;
  }
  
  .form-wrapper {
    background: transparent;
    box-shadow: none;
    padding: 20px 0;
  }
  
  .form-title {
    font-size: 24px;
    color: black;
    text-align: center;
  }
  
  .name-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-label.half {
    width: 100%;
  }
}
</style>