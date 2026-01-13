import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
//创建大仓库
let pinia = createPinia()
//持久化插件
pinia.use(piniaPluginPersistedstate)

//暴露
export default pinia
