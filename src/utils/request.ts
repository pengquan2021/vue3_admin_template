//进行axios二次封装：使用请求和相应拦截器
import useUserStore from '@/store/modules/user'
import axios from 'axios'
import { ElMessage } from 'element-plus'
//1、创建axios实例(还可以配置基础路径和超时时间)
// 如果未提供环境变量，默认走/api，便于本地通过代理转发
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 5000,
})
//2、请求拦截器
request.interceptors.request.use((config) => {
  //获取仓库内token
  let userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  //config配置对象，有一个headers属性，即请求头，经常给 服务器端携带参数
  //返回配置对象
  return config
})
//3、响应拦截器
request.interceptors.response.use(
  //3.1成功的回调
  (response) => {
    return response.data
  },
  //3.2失败的回调//处理网络错误
  (error) => {
    //定义一个变量存储网络错误信息
    let msg = ''
    //http状态码
    let status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)
//4、对外暴露
export default request
