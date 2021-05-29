
import vue from '@vitejs/plugin-vue'

import alias from '@rollup/plugin-alias';

const path = require('path')

/*https://cn.vitejs.dev/config/*/
export default {
    plugins: [
        vue(),
        alias({
            entries: [
                { find: '@', replacement: path.join(__dirname, './src') },
            ]
        })
    ],

    base: './',

    build: {
        outDir: 'dist'
    },

    // 引入第三方的配置
    optimizeDeps: {
        include: [ "axios"]
    },

    server: {
        port: 3000,
        open: true,
        // 是否开启 https
        https: false,
        proxy: {
            //如果是 /lsbdb 打头，则访问地址如下
            '/jyorder': {
                target: 'https://app.whohelp.cc/jyorder',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/jyorder/, '')
            }
        }
    },

}
