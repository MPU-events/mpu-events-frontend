<template>
  <div class="app-container" :class="{ 'mobile-view': isMobile }">
    <div class="container-fluid">
      <div class="row">
        <!-- Боковая панель -->
        <div 
          class="col-md-3 col-lg-2 sidebar" 
          :class="{ 'active': sidebarActive }"
          @click.self="closeSidebarOnMobile"
        >
          <button 
            class="menu-toggle d-md-none" 
            @click="toggleSidebar"
            :class="{ 'active': sidebarActive }"
          >
            <i class="bi bi-list"></i>
          </button>
          
          <div class="logo-section">
            <div class="logo">АФИША</div>
          </div>
          
          <div class="nav-section">
            <!-- Главная -->
            <a 
              href="#" 
              class="nav-item"
              :class="{ active: activeNav === 'home' }"
              @click.prevent="setActiveNav('home')"
            >
              <div class="nav-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" stroke-width="2.1" fill="none"/>
                  <rect x="18" y="4" width="10" height="10" rx="2" stroke="currentColor" stroke-width="2.1" fill="none"/>
                  <rect x="4" y="18" width="10" height="10" rx="2" stroke="currentColor" stroke-width="2.1" fill="none"/>
                  <rect x="18" y="18" width="10" height="10" rx="2" stroke="currentColor" stroke-width="2.1" fill="none"/>
                </svg>
              </div>
              <div class="nav-text">Главная</div>
            </a>
            
            <!-- Мой календарь -->
            <a 
              href="#" 
              class="nav-item"
              :class="{ active: activeNav === 'calendar' }"
              @click.prevent="setActiveNav('calendar')"
            >
              <div class="nav-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="6" width="24" height="22" rx="3" stroke="currentColor" stroke-width="2" fill="none"/>
                  <line x1="4" y1="12" x2="28" y2="12" stroke="currentColor" stroke-width="2"/>
                  <circle cx="10" cy="18" r="1.5" fill="currentColor"/>
                  <circle cx="16" cy="18" r="1.5" fill="currentColor"/>
                  <circle cx="22" cy="18" r="1.5" fill="currentColor"/>
                  <circle cx="10" cy="23" r="1.5" fill="currentColor"/>
                  <circle cx="16" cy="23" r="1.5" fill="currentColor"/>
                  <circle cx="22" cy="23" r="1.5" fill="currentColor"/>
                  <path d="M10 3L10 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M22 3L22 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="nav-text">Календарь</div>
            </a>
          </div>
          
          <div class="logout-section">
            <button class="logout-btn" @click="handleLogout">
              <div class="logout-text">Выход</div>
              <div class="logout-icon">
                <i class="bi bi-box-arrow-right"></i>
              </div>
            </button>
          </div>
        </div>
        
        <!-- Основное содержимое -->
        <div class="col-md-9 col-lg-10 main-content" @click="closeSidebarOnMobile">
          <!-- Шапка с поиском и аватаркой -->
          <div class="header">
            <div class="search-row">
              <div class="search-wrapper">
                <i class="bi bi-search search-icon"></i>
                <input 
                  type="text" 
                  class="search-input" 
                  placeholder="Поиск по событиям"
                  v-model="searchQuery"
                  @keyup.enter="performSearch"
                >
              </div>
              <div class="user-avatar">
                <span>JD</span>
              </div>
            </div>
            
            <!-- Фильтры поиска -->
            <div class="search-filters">
              <button 
                v-for="filter in filters" 
                :key="filter.id"
                class="filter-btn"
                :class="{ active: activeFilter === filter.id }"
                @click="setActiveFilter(filter.id)"
              >
                {{ filter.name }}
              </button>
            </div>
          </div>
          
          <!-- Контентная область -->
          <div class="content-area">
            <!-- Статистика -->
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">{{ stats.activeEvents }}</div>
                <div class="stat-label">Активных событий</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ stats.participants }}</div>
                <div class="stat-label">Участников</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ stats.newThisWeek }}</div>
                <div class="stat-label">Новых за неделю</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ stats.categories }}</div>
                <div class="stat-label">Категорий</div>
              </div>
            </div>
            
            <!-- Ближайшие события -->
            <div class="events-section">
              <div class="section-header">
                <h2 class="section-title">Ближайшие события</h2>
                <a href="#" class="view-all" @click.prevent="viewAllEvents">Смотреть все</a>
              </div>
              
              <!-- Сетка событий (превью) -->
              <div class="events-grid">
                <div 
                  v-for="event in displayedEvents" 
                  :key="event.id"
                  class="event-preview"
                  @click="openEventModal(event.id)"
                >
                  <img 
                    :src="getEventImage(event)" 
                    :alt="event.title" 
                    class="event-preview__image"
                    @error="handleImageError"
                  >
                  <div class="event-preview__content">
                    <h3 class="event-preview__title">{{ event.title }}</h3>
                    <div class="event-preview__date">
                      <i class="bi bi-calendar"></i>
                      {{ formatEventDate(event) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно с детальным постом -->
    <div 
      class="modal-overlay" 
      :class="{ active: modalActive }"
      @click.self="closeModal"
    >
      <div class="modal-content">
        <div v-if="selectedEvent" class="post">
          <button class="post__close-btn" @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9397 10.94C11.2209 10.6591 11.6022 10.5013 11.9997 10.5013C12.3972 10.5013 12.7784 10.6591 13.0597 10.94L37.0597 34.94C37.207 35.0773 37.3252 35.2429 37.4072 35.4269C37.4892 35.6109 37.5333 35.8096 37.5368 36.011C37.5404 36.2124 37.5033 36.4124 37.4279 36.5992C37.3525 36.786 37.2402 36.9557 37.0977 37.0981C36.9553 37.2405 36.7856 37.3528 36.5989 37.4283C36.4121 37.5037 36.212 37.5408 36.0106 37.5372C35.8092 37.5337 35.6106 37.4896 35.4266 37.4076C35.2426 37.3256 35.077 37.2074 34.9397 37.06L10.9397 13.06C10.6588 12.7788 10.501 12.3975 10.501 12C10.501 11.6025 10.6588 11.2213 10.9397 10.94Z" fill="black"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M37.0597 10.94C37.3406 11.2213 37.4984 11.6025 37.4984 12C37.4984 12.3975 37.3406 12.7788 37.0597 13.06L13.0597 37.06C12.7753 37.325 12.3993 37.4692 12.0106 37.4624C11.622 37.4555 11.2513 37.2981 10.9764 37.0233C10.7016 36.7484 10.5442 36.3777 10.5373 35.9891C10.5305 35.6005 10.6747 35.2244 10.9397 34.94L34.9397 10.94C35.2209 10.6591 35.6022 10.5013 35.9997 10.5013C36.3972 10.5013 36.7784 10.6591 37.0597 10.94Z" fill="black"/>
            </svg>
          </button>
          
          <div class="post__wrapper">
            <img 
              class="post__image" 
              :src="getModalImage(selectedEvent)" 
              :alt="selectedEvent.title"
              @error="handleModalImageError"
            >
            <div class="post__content">
              <h3 class="post__title">{{ selectedEvent.title }}</h3>
              <ul class="post__details">
                <li class="post__detail">
                  <svg class="post__detail-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.88889 31.0002C5.09444 31.0002 4.41459 30.7165 3.84933 30.149C3.28407 29.5816 3.00096 28.8986 3 28.1002V7.80019C3 7.00269 3.28311 6.32022 3.84933 5.75279C4.41556 5.18535 5.09541 4.90115 5.88889 4.90019H7.33333V3.45019C7.33333 3.03935 7.472 2.69522 7.74933 2.41779C8.02667 2.14035 8.36948 2.00115 8.77778 2.00019C9.18607 1.99922 9.52937 2.13842 9.80767 2.41779C10.086 2.69715 10.2241 3.04129 10.2222 3.45019V4.90019H21.7778V3.45019C21.7778 3.03935 21.9164 2.69522 22.1938 2.41779C22.4711 2.14035 22.8139 2.00115 23.2222 2.00019C23.6305 1.99922 23.9738 2.13842 24.2521 2.41779C24.5304 2.69715 24.6686 3.04129 24.6667 3.45019V4.90019H26.1111C26.9056 4.90019 27.5859 5.18439 28.1521 5.75279C28.7183 6.32119 29.001 7.00365 29 7.80019V28.1002C29 28.8977 28.7174 29.5806 28.1521 30.149C27.5868 30.7174 26.9065 31.0011 26.1111 31.0002H5.88889ZM5.88889 28.1002H26.1111V13.6002H5.88889V28.1002Z" fill="#2B2B2B"/>
                  </svg>
                  <p class="post__detail-text">
                    <span class="post__date">{{ selectedEvent.date }}</span>,
                    <span class="post__date">{{ selectedEvent.time }}</span>
                  </p>
                </li>
                <li class="post__detail">
                  <svg class="post__detail-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9997 28.4334C15.6886 28.4334 15.3775 28.3778 15.0663 28.2667C14.7552 28.1556 14.4775 27.9889 14.233 27.7667C12.7886 26.4334 11.5108 25.1334 10.3997 23.8667C9.28856 22.6 8.36101 21.3725 7.61701 20.184C6.87301 18.9956 6.30634 17.8511 5.91701 16.7507C5.52767 15.6502 5.33301 14.6 5.33301 13.6C5.33301 10.2667 6.40545 7.61113 8.55034 5.63335C10.6952 3.65558 13.1783 2.66669 15.9997 2.66669C18.821 2.66669 21.3046 3.65558 23.4503 5.63335C25.5961 7.61113 26.6681 10.2667 26.6663 13.6C26.6663 14.6 26.4721 15.6502 26.0837 16.7507C25.6952 17.8511 25.1286 18.9956 24.3837 20.184C23.6388 21.3725 22.7108 22.6 21.5997 23.8667C20.4886 25.1334 19.2108 26.4334 17.7663 27.7667C17.5219 27.9889 17.2441 28.1556 16.933 28.2667C16.6219 28.3778 16.3108 28.4334 15.9997 28.4334Z" fill="#9D2ACD"/>
                  </svg>
                  <p class="post__detail-text">{{ selectedEvent.location }}</p>
                </li>
              </ul>
              <div class="post__description">
                <p class="post__description-text">{{ selectedEvent.description }}</p>
                <button class="post__more-btn" @click="showMoreInfo">Подробнее</button>
              </div>
              <button class="post__action-btn" @click="registerForEvent">Зарегистрироваться</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ========== МОБИЛЬНОСТЬ ==========
const isMobile = ref(window.innerWidth <= 992)
const sidebarActive = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 992
  if (!isMobile.value) {
    sidebarActive.value = false
  }
}

const toggleSidebar = () => {
  sidebarActive.value = !sidebarActive.value
}

const closeSidebarOnMobile = () => {
  if (isMobile.value) {
    sidebarActive.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// ========== НАВИГАЦИЯ ==========
const activeNav = ref('home')

const setActiveNav = (nav) => {
  activeNav.value = nav
  if (nav === 'calendar') {
    alert('Переход в календарь')
  }
}

// ========== ПОИСК И ФИЛЬТРЫ ==========
const searchQuery = ref('')
const activeFilter = ref('all')

const filters = [
  { id: 'all', name: 'Все события' },
  { id: 'sport', name: 'Спорт' },
  { id: 'concerts', name: 'Концерты' },
  { id: 'theater', name: 'Театр' },
  { id: 'exhibitions', name: 'Выставки' },
  { id: 'other', name: 'Другое' }
]

const setActiveFilter = (filterId) => {
  activeFilter.value = filterId
  alert(`Фильтр: ${filters.find(f => f.id === filterId).name}`)
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    alert(`Поиск: "${searchQuery.value}"\n\nРезультаты поиска будут отображены здесь.`)
  }
}

// ========== СТАТИСТИКА ==========
const stats = reactive({
  activeEvents: 24,
  participants: 156,
  newThisWeek: 12,
  categories: 8
})

// ========== ДАННЫЕ СОБЫТИЙ ==========
const eventsData = {
  1: {
    id: 1,
    title: 'Турнир по армрестлингу',
    image: '/media/post_img_1.png',  
    date: '7 ноября',
    time: '12:00-17:00',
    location: 'г. Москва, Измайловское шоссе 71, корпус 2Б (Гостиница Измайлово, корпус Бета)',
    description: 'Приглашаем тебя на турнир по армрестлингу среди Окружных Советов МФП, которые пройдут в следующих весовых категориях: Мужчины: 70/80/90/90+ кг, Женщины: 65/65+ кг. Победителей ждут ценные призы и кубки!'
  },
  2: {
    id: 2,
    title: 'Выставка современного искусства',
    image: '',  // Заглушка
    date: '15 ноября',
    time: '19:00-22:00',
    location: 'г. Москва, ул. Крымский Вал, 10 (Парк Горького)',
    description: 'Выставка современного искусства от молодых художников. Живопись, скульптура, инсталляции. В программе: работы более 50 авторов, лекции искусствоведов и встречи с художниками.'
  },
  3: {
    id: 3,
    title: 'Концерт классической музыки',
    image: '',  // Заглушка
    date: '20 ноября',
    time: '18:30-21:00',
    location: 'г. Москва, ул. Большая Никитская, 13/6 (Консерватория)',
    description: 'Вечер классической музыки. Исполняют произведения Чайковского, Рахманинова, Моцарта. Лауреаты международных конкурсов.'
  },
  4: {
    id: 4,
    title: 'Мастер-класс по фотографии',
    image: '',  // Заглушка
    date: '25 ноября',
    time: '16:00-19:00',
    location: 'г. Москва, ул. Тверская, 15 (Фотошкола)',
    description: 'Научитесь делать профессиональные фотографии на смартфон. Практические советы и живое общение. Темы: композиция, работа со светом, обработка в мобильных приложениях.'
  }
}

const displayedEvents = computed(() => {
  return Object.values(eventsData)
})

const formatEventDate = (event) => {
  return `${event.date}, ${event.time.split('-')[0]}`
}

// Функция для получения изображения события (превью)
const getEventImage = (event) => {
  if (event.image) {
    return event.image  
  }
  // Для остальных - заглушка с градиентом
  return `https://via.placeholder.com/300x180/9D2ACD/ffffff?text=${encodeURIComponent(event.title)}`
}

// Функция для получения изображения в модальном окне
const getModalImage = (event) => {
  if (event.image) {
    return event.image  
  }
  // Для остальных - заглушка
  return `https://via.placeholder.com/500x400/9D2ACD/ffffff?text=${encodeURIComponent(event.title)}`
}

const handleImageError = (e) => {
  // Если реальная картинка не загрузилась, показываем заглушку
  e.target.src = 'https://via.placeholder.com/300x180/9D2ACD/ffffff?text=Event'
}

const handleModalImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/500x400/9D2ACD/ffffff?text=Event'
}

// ========== МОДАЛЬНОЕ ОКНО ==========
const modalActive = ref(false)
const selectedEvent = ref(null)

const openEventModal = (eventId) => {
  selectedEvent.value = eventsData[eventId]
  if (selectedEvent.value) {
    modalActive.value = true
    document.body.style.overflow = 'hidden'
  }
}

const closeModal = () => {
  modalActive.value = false
  document.body.style.overflow = ''
}

// Закрытие по Escape
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalActive.value) {
      closeModal()
    }
  })
})

// ========== ДЕЙСТВИЯ ==========
const handleLogout = () => {
  if (confirm('Вы действительно хотите выйти?')) {
    alert('Выход выполнен')
    router.push('/login')
  }
}

const viewAllEvents = () => {
  alert('Просмотр всех событий')
}

const showMoreInfo = () => {
  alert('Открытие подробной информации о событии')
}

const registerForEvent = () => {
  alert('Регистрация на событие')
}
</script>

<style scoped>
/* Подключение шрифта Gilroy */
@font-face {
  font-family: 'Gilroy';
  src: url('/fonts/Gilroy-Light.otf') format('opentype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gilroy';
  src: url('/fonts/Gilroy-ExtraBold.otf') format('opentype');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}

:root {
  --primary-color: #ef5dd9;
  --sidebar-bg: #F8F9FA;
  --border-color: #E5E7EB;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --active-color: #9333EA;
  --purple-btn: #9D2ACD;
  font-size: 62.5%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  font-family: 'Gilroy', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #F5F7FB;
  color: var(--text-primary);
  height: 100vh;
  overflow: hidden;
}

.container-fluid {
  height: 100vh;
  padding: 0;
}

.row {
  height: 100%;
  margin: 0;
}

/* Боковая панель */
.sidebar {
  background-color: #fff;
  height: 100%;
  padding: 0;
  border-right: 1px solid var(--border-color);
  position: relative;
}

.logo-section {
  padding: 28px 20px 20px;
}

.logo {
  font-size: 48px;
  font-weight: 600;
  color: black;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
  text-align: center;
  font-family: 'Gilroy', sans-serif;
  line-height: 1.2;
}

/* Навигация */
.nav-item {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
}

.nav-item .nav-text {
  font-size: 22px;
  font-weight: 500;
  font-family: 'Gilroy', sans-serif;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.nav-item.active {
  background-color: rgba(139, 92, 246, 0.08);
  color: var(--active-color);
  border-left: 3px solid var(--active-color);
}

.nav-item.active .nav-icon svg {
  color: var(--active-color);
}

.nav-item:hover .nav-icon svg {
  color: var(--active-color);
}

.nav-icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
  width: 32px;
  height: 32px;
  display: block;
}

.nav-item .nav-icon svg {
  color: #2B2B2B;
  transition: color 0.2s;
}

.nav-item:not(.active):nth-child(2) .nav-icon svg {
  color: #909090;
}

.nav-section {
  padding: 20px 0;
}

.nav-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 20px 12px;
}

/* Кнопка выхода */
.logout-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: transparent;
  border: 0px;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 22px;
  width: 100%;
  transition: all 0.2s;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: rgba(0, 0, 0, 0.03);
  color: var(--text-primary);
}

.logout-text {
  font-weight: 500;
  font-family: 'Gilroy', sans-serif;
}

.logout-icon {
  font-size: 24px;
  display: flex;
  align-items: center;
}

/* Основное содержимое */
.main-content {
  height: 100%;
  padding: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 24px 32px;
}

/* Строка с поиском и аватаркой */
.search-row {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.search-wrapper {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 16px 24px 16px 56px;
  border: 1px solid var(--border-color);
  text-align: center;
  border-radius: 40px;
  font-size: 22px;
  color: var(--text-primary);
  background-color: #fff;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-family: 'Gilroy', sans-serif;
  font-weight: 500;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(239, 93, 217, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
}

.search-input::placeholder {
  font-weight: 500;
  font-family: 'Gilroy', sans-serif;
  color: var(--text-secondary);
  font-size: 22px;
}

.search-icon {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 24px;
  z-index: 1;
}

/* Аватарка пользователя */
.user-avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--primary-color), #b339a0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 20px;
  font-family: 'Gilroy', sans-serif;
  box-shadow: 0 4px 12px rgba(239, 93, 217, 0.3);
  border: 2px solid white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(239, 93, 217, 0.4);
}

/* Фильтры поиска */
.search-filters {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  background-color: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background-color: #E5E7EB;
}

.filter-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Контентная область */
.content-area {
  padding: 0 32px 32px;
  flex: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background-color: #fff;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.events-section {
  margin-top: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.view-all {
  font-size: 14px;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Стили для превью событий на главной */
.event-preview {
  background-color: #fff;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.event-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.event-preview__image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  background-color: #E5E7EB;
}

.event-preview__content {
  padding: 16px;
}

.event-preview__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.event-preview__date {
  font-size: 14px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.event-preview__date i {
  font-size: 14px;
}

/* Модальное окно с детальным постом */
.modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.modal-overlay.active {
  display: flex;
}

.modal-content {
  max-width: 1100px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 40px;
  background: transparent;
}

.post {
  position: relative;
  padding: 60px;
  background-image: url('/media/post_back.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 40px;
  line-height: 1.5;
  width: 100%;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  min-width: 1000px;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Контейнер для содержимого */
.post__wrapper {
  display: flex;
  flex-direction: row;
  gap: 50px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  align-items: center;
}

.post__close-btn {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 45px;
  height: 45px;
  border: 0;
  background-color: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

/* Картинка */
.post__image {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.post__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.post__title {
  font-size: 32px;
  margin-bottom: 25px;
  font-weight: 800;
  color: #222;
  line-height: 1.2;
}

.post__details {
  list-style: none;
  margin-bottom: 25px;
  padding: 0;
  width: 100%;
}

.post__detail {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  align-items: flex-start;
  width: 100%;
}

.post__detail-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.post__detail-text {
  font-size: 18px;
  line-height: 1.5;
  color: #333;
  margin: 0;
  width: calc(100% - 43px);
  word-wrap: break-word;
}

.post__date {
  font-size: 18px;
  font-weight: 600;
  width: 100%;
  color: #222;
}

.post__description {
  margin-bottom: 25px;
  width: 100%;
}

.post__description-text {
  font-size: 20px;
  margin-bottom: 15px;
  line-height: 1.6;
  color: #444;
  width: 100%;
  word-wrap: break-word;
}

.post__more-btn {
  background-color: transparent;
  border: 0;
  font-size: 18px;
  padding-left: 0;
  color: #666;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 10px;
}

.post__more-btn:hover {
  color: #9333EA;
}

/* Кнопка Зарегистрироваться */
.post__action-btn {
  background-color: #D4D4D4;
  border: 0;
  font-size: 20px;
  font-weight: 600;
  padding: 15px 40px;
  border-radius: 50px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
  align-self: flex-start;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: none;
  width: auto;
}

.post__action-btn:hover {
  background-color: #c0c0c0;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Меню-бургер */
.menu-toggle {
  display: none;
  position: absolute;
  top: 28px;
  right: -50px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  z-index: 1001;
  cursor: pointer;
}

/* Адаптивность */
@media (max-width: 1200px) {
  .post {
    min-width: 900px;
    min-height: 650px;
    padding: 50px;
  }
  
  .post__wrapper {
    max-width: 800px;
    gap: 40px;
  }
  
  .post__image {
    width: 280px;
    height: 280px;
  }
}

@media (max-width: 992px) {
  .sidebar {
    width: 300px;
    position: fixed;
    left: -300px;
    z-index: 1000;
    transition: left 0.3s;
  }
  
  .sidebar.active {
    left: 0;
  }
  
  .main-content {
    width: 100%;
  }
  
  .menu-toggle {
    display: block;
  }
  
  .post {
    max-width: 100%;
  }
  
  .modal-content {
    max-width: 95%;
  }
  
  .post {
    min-width: auto;
    min-height: auto;
    padding: 40px;
  }
  
  .post__wrapper {
    max-width: 100%;
    gap: 30px;
  }
  
  .post__image {
    width: 250px;
    height: 250px;
  }
  
  .post__description-text {
    font-size: 18px;
  }
  
  .post__detail-text {
    width: calc(100% - 43px);
  }
}

@media (max-width: 768px) {
  .header {
    padding: 20px;
  }
  
  .content-area {
    padding: 0 20px 20px;
  }
  
  .logo {
    font-size: 42px;
  }
  
  .nav-item .nav-text,
  .logout-btn .logout-text {
    font-size: 20px;
  }
  
  .search-input {
    font-size: 20px;
    padding: 14px 20px 14px 50px;
  }
  
  .search-input::placeholder {
    font-size: 20px;
  }
  
  .search-icon {
    left: 20px;
    font-size: 22px;
  }
  
  .user-avatar {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-overlay {
    padding: 20px;
  }
  
  .post {
    padding: 30px;
  }
  
  .post__wrapper {
    flex-direction: column;
    gap: 25px;
  }
  
  .post__image {
    width: 220px;
    height: 220px;
  }
  
  .post__close-btn {
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
  
  .post__description-text {
    font-size: 18px;
  }
  
  .post__action-btn {
    align-self: stretch;
    text-align: center;
    width: 100%;
  }
  
  .post__detail-text {
    width: calc(100% - 43px);
  }
}

@media (max-width: 576px) {
  .logo {
    font-size: 36px;
  }
  
  .nav-item .nav-text,
  .logout-btn .logout-text {
    font-size: 18px;
  }
  
  .search-row {
    gap: 10px;
  }
  
  .search-input {
    font-size: 18px;
    padding: 12px 16px 12px 45px;
  }
  
  .search-input::placeholder {
    font-size: 18px;
  }
  
  .search-icon {
    font-size: 20px;
    left: 15px;
  }
  
  .user-avatar {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .search-filters {
    overflow-x: auto;
    padding-bottom: 8px;
    flex-wrap: nowrap;
  }
}
</style>
