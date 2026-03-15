<template>
  <div class="confirm-container" :class="{ 'mobile-view': isMobile }">
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

    <!-- Форма подтверждения -->
    <div class="form-panel" :class="{ 'mobile-form': isMobile }">
      <div class="form-wrapper" :class="{ 'mobile-wrapper': isMobile }">
        <!-- Лого для мобилки -->
        <img 
          v-if="isMobile" 
          src="/media/logo.png" 
          alt="Логотип" 
          class="mobile-logo"
          @error="handleImageError"
        >

        <h1 class="form-title" :class="{ 'mobile-title': isMobile }">
          {{ isMobile ? 'Подтверждение' : 'Подтверждение регистрации' }}
        </h1>

        <!-- Проверка наличия user_id -->
        <template v-if="!registeredUserId">
          <p class="error-text">
            Не найден идентификатор пользователя.
          </p>
          <p class="error-subtext">
            Пожалуйста, <router-link to="/register">пройдите регистрацию</router-link> ещё раз.
          </p>
        </template>

        <!-- Форма подтверждения -->
        <template v-else>
          <p class="info-text" :class="{ 'mobile-info': isMobile }">
            {{ isMobile 
              ? 'Введите код подтверждения, отправленный на вашу почту'
              : 'Мы отправили код подтверждения на вашу почту. Введите его ниже, чтобы завершить регистрацию.'
            }}
          </p>

          <form @submit.prevent="handleConfirm" class="confirm-form">
            <!-- Сообщения об ошибках/успехе -->
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-if="success" class="alert alert-success">{{ success }}</div>

            <!-- Поле для кода -->
            <label class="form-label">
              <span>Код подтверждения</span>
              <input 
                type="text"
                v-model="confirmCode"
                placeholder="Введите код из письма"
                required
                maxlength="6"
                :disabled="isLoading"
              >
            </label>

            <!-- Кнопка подтверждения -->
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isLoading || !confirmCode"
            >
              {{ isLoading ? 'Проверяем...' : 'Подтвердить' }}
            </button>
          </form>

          <!-- Ссылка назад для мобилки -->
          <div v-if="isMobile" class="back-link">
            <router-link to="/register">← Назад к регистрации</router-link>
          </div>
        </template>

        <!-- Ссылка назад для десктопа (если нет user_id) -->
        <div v-if="!isMobile && !registeredUserId" class="back-link desktop">
          <router-link to="/register">← Вернуться к регистрации</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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

const confirmCode = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref('')
const registeredUserId = ref(null)

onMounted(() => {
  const userId = localStorage.getItem('registeredUserId')
  if (userId) {
    registeredUserId.value = userId
    console.log('Найден user_id:', userId)
  }
})

const handleImageError = (e) => {
  console.warn('Логотип не загрузился')
  e.target.style.display = 'none'
}

const handleConfirm = async () => {
  error.value = ''
  success.value = ''

  if (!registeredUserId.value) {
    error.value = 'Не найден идентификатор пользователя'
    return
  }

  if (!confirmCode.value.trim()) {
    error.value = 'Введите код подтверждения'
    return
  }

  if (confirmCode.value.length < 4) {
    error.value = 'Код должен содержать минимум 4 символа'
    return
  }

  const payload = {
    user_id: registeredUserId.value,
    confirm_code: confirmCode.value.trim()
  }

  isLoading.value = true

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json().catch(() => null)

    if (response.status === 201 || response.ok) {
      success.value = 'Регистрация успешно подтверждена!'
      
      localStorage.removeItem('registeredUserId')
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      const message = data?.message || data?.detail || 'Неверный код подтверждения'
      error.value = message
    }
  } catch (err) {
    console.error('Confirm error:', err)
    error.value = 'Проблема с подключением к серверу'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ========== ОБЩИЕ СТИЛИ ========== */
.confirm-container {
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
  height: 100vh;
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

/* Текст на десктопе */
.info-text {
  margin-bottom: 30px;
  color: #666;
  line-height: 1.5;
}

.error-text {
  color: #dc3545;
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;
}

.error-subtext {
  text-align: center;
  color: #666;
}

.error-subtext a {
  color: #ff2fa8;
  text-decoration: none;
  font-weight: 600;
}

/* ========== МОБИЛЬНАЯ ВЕРСИЯ ========== */
.confirm-container.mobile-view {
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

.mobile-info {
  text-align: center;
  color: #666;
  margin: 20px 0;
}

/* Форма подтверждения */
.confirm-form {
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

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
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

/* Ссылка назад */
.back-link {
  text-align: center;
  margin-top: 20px;
}

.back-link a {
  color: #ff2fa8;
  text-decoration: none;
  font-size: 16px;
}

.back-link a:hover {
  text-decoration: underline;
}

.back-link.desktop {
  margin-top: 30px;
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
  .confirm-container {
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
}
</style>