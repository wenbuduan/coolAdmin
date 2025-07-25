import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import Compression from 'vite-plugin-compression';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { EleAdminResolver } from 'ele-admin-plus/es/utils/resolvers';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';
  const alias = {
    '@/': resolve('src') + '/',
    'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
  };
  const plugins = [vue()];
  if (isBuild) {
    // 组件按需引入
    plugins.push(
      Components({
        dts: false,
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          }),
          EleAdminResolver({
            importStyle: 'sass'
          })
        ]
      })
    );
    // gzip压缩
    plugins.push(
      Compression({
        disable: !isBuild,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      })
    );
  } else {
    // 开发环境全局安装
    alias['./as-needed'] = './global-import';
  }
  return {
    resolve: { alias },
    server: {
      proxy: {
        // '/api': 'https://v2.eleadmin.com'
        // 这里可以写你自己的后端接口地址，如：
        // '/api': 'http://localhost:8088'
        // 注意, 这种方式需要接口都有一个统一的前缀, 这里 /api 就是所有接口都会有的前缀
        // 如果接口没有统一前缀可以这样写最后把 /api 去掉

        '/api': {
          target: 'http://localhost:8088',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    plugins,
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    },
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/renderers',
        'echarts/components',
        'vue-echarts',
        'echarts-wordcloud',
        'sortablejs',
        'vuedraggable'
      ]
    },
    build: {
      target: 'chrome63',
      chunkSizeWarningLimit: 2000,
      minify: 'esbuild'
    }
  };
});
