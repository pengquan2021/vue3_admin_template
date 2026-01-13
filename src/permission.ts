//路由鉴权，某一个路由什么条件下可以访问
import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from './store'
import useUserStore from './store/modules/user'
import setting from './setting'
import { nextTick } from 'vue'
nprogress.configure({ showSpinner: false })

//全局前置守卫
router.beforeEach(async (to, _, next) => {
  document.title = setting.title + '-' + to.meta.title
  //to代表要访问的对象  from代表从哪来  next放行函数
  nprogress.start()
  //获取用户仓库实例
  let userStore = useUserStore(pinia)
  //获取token，判断用户登录了还是未登录
  let token = userStore.token

  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 情况1：已经有用户信息且异步路由也已经挂载过，直接放行
      // 注意：仅 username 不够，因为刷新后 username 会从本地恢复，但路由没有恢复
      if (userStore.username && userStore.hasAddRoute) {
        next()
      } else {
        // 没有用户信息：获取用户信息并动态注册异步路由
        try {
          await userStore.userInfo()
          // 等待一个 tick，保证路由表更新完成
          await nextTick()
          next({ ...to, replace: true })
        } catch (error) {
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

//全局后置守卫
router.afterEach(() => {
  nprogress.done()
})
