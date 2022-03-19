const routes = [
    {
        path: '/',
        component: projects
    },
    {
        path: '/employee',
        component: employee
    },
    {
        path: '/projects',
        component: projects
    }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})

const app = Vue.createApp({})
app.use(router);
app.mount('#app');