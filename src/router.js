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
        },
        {
            path: '/processes_creating',
            name: 'processes creating',
            component: () => import('@/views/ProcessCreatingPage.vue')
        },
        {
            path: '/processes/:id',
            name: 'processes detail',
            component: () => import('@/views/ProcessDetailPage.vue')
        },
        {
            path: '/departments',
            name: 'departments',
            component: () => import('@/views/DepartmentPage.vue')
        },
    ]
})

router.beforeEach((to, from, next) => {
    console.log('aaa');
    if (to.path === '/login') {
        if (store.getters['AUTHENTICATION_STORE/isLoggedIn']) {
            store.dispatch('AUTHENTICATION_STORE/INIT')
                .then(() => next('/documents'))
                .catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        } else {
                            console.log(error)
                        }
                        next('/login')
                    }
                );
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