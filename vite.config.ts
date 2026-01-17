import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    // port: 5173,      // 指定端口号（可选）
    // 配置代理解决CORS问题
    proxy: {
      '/api': {
        target: 'http://localhost:8001', // 后端服务器地址
        changeOrigin: true, // 允许跨域
        secure: false, // 不验证SSL证书
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径，去掉/api前缀
      },
    },
  },
})
