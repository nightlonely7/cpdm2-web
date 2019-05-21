import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginPage.vue')
        },
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/Home.vue')
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/views/About.vue')
        },
        {
            path: '/documents',
            name: 'documents',
            component: () => import('@/views/DocumentPage.vue')
        },
        {
            path: '/documents/:id',
            name: 'document detail',
            component: () => import('@/views/DocumentDetailPage.vue')
        },
        {
            path: '/processes',
            name: 'processes',
            component: () => import('@/views/ProcessPage.vue')
        }
    ]
})
