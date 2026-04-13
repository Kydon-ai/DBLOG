import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,  // 添加这行
  },
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 8188,      // 指定端口号（可选）
    // 配置代理解决CORS问题
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
        // 不重写路径，保持/api前缀
      },
    },
  },
})
