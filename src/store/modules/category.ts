//商品分类全局组件的小仓库

import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { categoryResponseData } from '@/api/product/attr/type'
import { defineStore } from 'pinia'
import type { CategoryState } from './types/types'

let useCategoryStore = defineStore('category', {
  state: (): CategoryState => {
    return {
      //存储c1的数据
      c1Arr: [],
      //存储c1ID
      c1Id: '',
      //存储c2的数据
      c2Arr: [],
      //存储c2ID
      c2Id: '',
      //存储c3的数据
      c3Arr: [],
      //存储c3ID
      c3Id: '',
    }
  },
  actions: {
    //获取一级分类数据的方法
    async getC1() {
      let result: categoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },

    //获取二级分类数据的方法
    async getC2() {
      let result: categoryResponseData = await reqC2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    //获取三级分类数据的方法
    async getC3() {
      let result: categoryResponseData = await reqC3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
