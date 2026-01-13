import type { categoryObj } from '@/api/product/attr/type'
import type { RouteRecordRaw } from 'vue-router'

//定义小仓库数据类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  hasAddRoute: boolean //标记路由是否已添加
  buttons: string[] //按钮权限
}

//定义分类仓库state对象的ts类型
export interface CategoryState {
  c1Id: string | number
  c1Arr: categoryObj[]
  c2Id: string | number
  c2Arr: categoryObj[]
  c3Id: string | number
  c3Arr: categoryObj[]
}
