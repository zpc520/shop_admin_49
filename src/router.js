import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import index from './components/index.vue'
import users from './components/users/users.vue'
import roles from './components/rights/roles.vue'
import rights from './components/rights/rights.vue'

Vue.use(Router)
// 解决目前点击相同导航的bug
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  routes: [
    { path: '/', redirect: '/index' },
    { path: '/login', component: login },
    { path: '/index',
      component: index,
      children: [
        { path: '/users', component: users },
        { path: '/roles', component: roles },
        { path: '/rights', component: rights }
      ]
    }
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
