import {createRouter, createWebHashHistory} from 'vue-router'

import layout from "@/pages/layout.vue";
import technology from "@/pages/technology/technology.vue";
import format from "@/pages/format/format.vue";
import size from "@/pages/size/size.vue";
import print from "@/pages/print/print.vue";

const history = createWebHashHistory()

const routes = [
    {
        path: '/',
        name: 'layout',
        component: layout,
        redirect: '/print',
        children: [
            {
                path: '/technology',
                name: 'technology',
                component: technology
            },
            {
                path: '/format',
                name: 'format',
                component: format
            },
            {
                path: '/size',
                name: 'size',
                component: size
            },
            {
                path: '/print',
                name: 'print',
                component: print
            }
        ]
    },
]

// 在 Vue-router新版本中，需要使用createRouter来创建路
export default createRouter({
    // 指定路由的模式,此处使用的是hash模式
    history,
    // 路由地址
    routes: routes
})
