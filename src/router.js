import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import index from './components/index.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/index' },
    { path: '/login', component: login },
    { path: '/index', component: index }
  ]
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
