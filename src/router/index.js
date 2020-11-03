import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)
const routes =[
    {
        path:'/',
        redirect:'/home',
        children:[
            {
                path:'home',
                name:'Home',
                meta: { title:'首页' },
                component:()=>import('../views/home.vue')
            },
        ]
    },
   
    {
        path:'/menu1',
        name:'菜单一',
        meta: { title:'菜单一' },
        component:()=>import('@/views/menu1/menu1.vue')
    },
    {
        path:'/menu2',
        name:'菜单二',
        meta: { title:'菜单二' },
        children:[
            {
                path:'menu2-1',
                name:'菜单2-1',
                meta:{title:'菜单2-1'},
                component:()=>import('@/views/menu2/menu2-1.vue')
            },
            {
                path:'menu2-2',
                name:'菜单2-2',
                meta:{title:'菜单2-2'},
                component:()=>import('@/views/menu2/menu2-2.vue')
            },
            {
                path:'menu2-3',
                name:'菜单2-3',
                meta:{title:'菜单2-3'},
                component:()=>import('@/views/menu2/menu2-3.vue')
            }
        ]
    },
    {
        path:'/menu3',
        name:'菜单三',
        meta: { title:'菜单三' },
        children:[
            {
                path:'menu3-1',
                name:'菜单3-1',
                meta:{title:'菜单3-1'},
                component:()=>import('@/views/menu3/menu3-1.vue')
            },
            {
                path:'menu3-2',
                name:'菜单3-2',
                meta:{title:'菜单3-2'},
                component:()=>import('@/views/menu3/menu3-2.vue')
            }
        ]
    },
    {
        path:'/menu4',
        name:'菜单四',
        meta: { title:'菜单四' },
        children:[
            {
                path:'menu4-1',
                name:'菜单4-1',
                meta:{title:'菜单4-1'},
                component:()=>import('@/views/menu4/menu4-1.vue')
            },
            {
                path:'menu4-2',
                name:'菜单4-2',
                meta:{title:'菜单4-2'},
                component:()=>import('@/views/menu4/menu4-2.vue')
            }
        ]
    }
]
const router = new VueRouter({
    mode:'hash',
    routes
})
export default router