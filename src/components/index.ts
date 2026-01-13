//注册全局组件

import SvgIcon from './SvgIcon/index.vue'
import Category from './Category/index.vue'
import type { App, Component } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const allGloablComponent: { [name: string]: Component } = {
  SvgIcon: SvgIcon,
  Category: Category,
}
export default {
  install(app: App) {
    Object.keys(allGloablComponent).forEach((key: string) => {
      app.component(key, allGloablComponent[key]!)
    })
    //将element-plus提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
