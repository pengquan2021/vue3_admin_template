import { createWebHashHistory, createRouter } from 'vue-router'
import { constantRoute } from './routes'

//路由配置
export default createRouter({
  //路由模式：hash
  history: createWebHashHistory(),
  routes: constantRoute,
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})
