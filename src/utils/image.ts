/**
 * 处理图片URL
 * 如果图片URL是相对路径（以/api开头），在开发环境中会通过Vite代理访问
 * 在生产环境中，需要拼接完整的服务器地址
 */
export const getImageUrl = (url: string | undefined | null): string => {
  if (!url) {
    return ''
  }

  // 如果已经是完整URL（以http://或https://开头），直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // 如果是相对路径（以/api开头），在开发环境中Vite代理会处理
  // 在生产环境中，需要拼接服务器地址
  if (url.startsWith('/api')) {
    // 开发环境：直接返回，Vite代理会处理
    if (import.meta.env.DEV) {
      return url
    }
    // 生产环境：拼接服务器地址
    const baseURL = import.meta.env.VITE_SERVE || 'http://sph-api.atguigu.cn'
    return `${baseURL}${url.replace(/^\/api/, '')}`
  }

  // 其他情况直接返回
  return url
}
