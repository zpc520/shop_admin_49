import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import index from './components/index.vue'
import users from './components/users/users.vue'
import roles from './components/rights/roles.vue'
import rights from './components/rights/rights.vue'
import categories from './components/products/categories.vue'
import goods from './components/products/goods.vue'
import goodsAdd from './components/products/googs-add.vue'

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
        { path: '/rights', component: rights },
        { path: '/categories', component: categories },
        { path: '/goods', component: goods },
        { path: '/goods-add', component: goodsAdd }
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
