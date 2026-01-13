import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  //获取各种环境下对应的变量
  let env = loadEnv(mode, process.cwd())
  // 提供兜底，方便在缺少环境变量时仍可启动并指向公开接口
  const baseApi = env.VITE_APP_BASE_API || '/api'
  const serveTarget = env.VITE_SERVE || 'http://sph-api.atguigu.cn'
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        enable: command === 'serve',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },

    //scss全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variable.scss" as *;
            @use "@/styles/reset.scss" as *;
          `,
        },
      },
    },
    //代理跨域
    server: {
      proxy: {
        [baseApi]: {
          //获取数据的服务器地址设置
          target: serveTarget,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(new RegExp(`^${baseApi}`), ''),
        },
      },
    },
  }
})
