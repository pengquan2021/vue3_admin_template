import { createApp } from 'vue'

import App from './App.vue'
//导入element-plus插件及样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { zhCn } from 'element-plus/es/locales.mjs' //引入element国际化（中文）
// @ts-ignore - 临时忽略虚拟模块的类型错误
import 'virtual:svg-icons-register'
import globalComponents from './components/index.ts'
//引入全局样式
import './styles/index.scss'
//引入暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'
//引入路由
import router from '@/router/index.ts'
//引入仓库
import pinia from './store'
//引入路由鉴权文件
import './permission.ts'

//创建应用实例对象
const app = createApp(App)

//安装插件
// 先注册全局组件
app.use(globalComponents)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.use(pinia)
//引入自定义指令文件
import { isHasButton } from '@/directive/has'
isHasButton(app)
//将应用实例挂载到挂载点上
app.mount('#app')
