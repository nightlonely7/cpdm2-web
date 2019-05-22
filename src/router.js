import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store.js'

Vue.use(Router);

const router = new Router({
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

router.beforeEach((to, from, next) => {

    if (to.path === '/login') {
        if (store.getters['AUTHENTICATION_STORE/isLoggedIn']) {
            store.dispatch('AUTHENTICATION_STORE/INIT')
                .then(() => next('/documents'))
                .catch(() => next('/login'));
            return;
        }
        next();
        return;
    }
    if (!store.getters['AUTHENTICATION_STORE/isLoggedIn']) {
        next('/login');
        return;
    }
    if (!store.getters['AUTHENTICATION_STORE/isInit']) {
        store.dispatch('AUTHENTICATION_STORE/INIT')
            .then(() => next())
            .catch(() => next('/login'));
        return;
    }
    next();
});

export default router;