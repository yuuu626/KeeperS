/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useUserStore } from '@/stores/user'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})


router.beforeEach(async (to, from, next) => {
  const user = useUserStore()
  if (from === START_LOCATION) { 
    await user.profile()
  }
  next()
  //  next() 可以放路由或網址，做重新導向，或擋一些東西
  // 如果使用者有登入的話，他要去註冊或是登入頁面的話，就next重新導向到首頁
  // to 是要去哪一頁，如果要去的那頁的路徑有包含登入或註冊就把他丟到首頁
  // if (user.isLogin && ['/register', '/login'].includes(to.path)) {
  // next('/')
  // // 需要登入的頁面，但沒有登入的話丟到登入頁
  // } else if (to.meta.login && !user.isLogin) {
  //   next('/login')
  //   // 要去的頁面需要管理員，但他不是管理員的話，丟回首頁
  // } else if (to.meta.admin && !user.isAdmin) {
  //   next('/')
  // } else {
  //   next()
  // }
})


router.afterEach((to, from) => {
  document.title = to.meta.title
})






// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
