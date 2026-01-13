import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'

import type { UserState } from './types/types'
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token'
//引入路由
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
import type {
  loginFromData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
import { defineStore } from 'pinia'
import router from '@/router'
//引入深拷贝方法
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'

// 用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any[], routes: string[]) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
    return false
  })
}

//创建用户相关的小仓库
let useUserStore = defineStore('User', {
  //存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //用户唯一标识token
      menuRoutes: constantRoute, //仓库存储生成菜单需要的数组（路由）
      username: '',
      avatar: '',
      hasAddRoute: false, //标记路由是否已添加
      buttons: [], //存储是否有按钮权限的数组
    }
  },
  // 持久化配置：只持久化 token、username、avatar，不持久化 menuRoutes
  persist: {
    // 使用 plugin 的 pick 字段选择要持久化的 state 字段
    pick: ['token', 'username', 'avatar'],
  },
  //处理异步|逻辑的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: loginFromData) {
      try {
        // 登录请求
        let result: loginResponseData = await reqLogin(data)

        if (result.code == 200) {
          this.token = result.data as string
          // 本地存储token
          SET_TOKEN(result.data as string)
          return 'OK'
        } else {
          return Promise.reject(new Error(result.message))
        }
      } catch (error: any) {
        // 打印详细的错误信息
        console.error('登录请求失败:', error)
        console.error('错误响应:', error.response)
        // 如果错误响应有数据，也打印出来
        if (error.response && error.response.data) {
          console.error('错误响应数据:', error.response.data)
        }
        return Promise.reject(error)
      }
    },
    //获取用户信息的方法
    async userInfo() {
      let result: userInfoResponseData = await reqUserInfo()
      //如果获取用户信息成功则存储
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        console.log(this.buttons)

        //计算用户需要的异步路由
        let userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        )
        //菜单的数据（将异步路由与任意路由展开，确保类型为 RouteRecordRaw[]）
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute]
        //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
        //如果路由还未添加，则添加路由（避免重复添加）
        if (!this.hasAddRoute) {
          //先添加异步路由
          userAsyncRoute.forEach((route: any) => {
            router.addRoute(route)
          })
          //再添加任意路由（404路由），必须最后添加，否则会拦截所有路由
          anyRoute.forEach((route: any) => {
            router.addRoute(route)
          })
          this.hasAddRoute = true
        }

        //等待路由系统更新完成
        await new Promise((resolve) => setTimeout(resolve, 10))
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录方法
    async userLogout() {
      //退出登录请求
      let result: any = await reqLogout()
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        this.hasAddRoute = false //重置路由添加标志
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  //计算属性
  getters: {},
})

//暴露
export default useUserStore
