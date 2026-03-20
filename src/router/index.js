import { createRouter, createWebHistory } from 'vue-router'

import Register from '../views/Registration/Register.vue'

import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/NavMenu.vue')
  },
  {
    path: '/home',
    name: 'Home_posts',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/new-home',
    name: 'NewHome',
    component: HomeView
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/confirm',
    name: 'Confirm',
    component: () => import('../views/Registration/Confirm.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
