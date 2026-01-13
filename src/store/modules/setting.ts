//小仓库：layout相关配置仓库
import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false,
      refsh: false, //控制右上角刷新效果
    }
  },
})

export default useLayoutSettingStore
