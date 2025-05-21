import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Contact from '../views/Contact.vue';
import AdminLogin from '../views/AdminLogin.vue';
import AdminPanel from '../views/AdminPanel.vue';
import NotFound from '../views/NotFound.vue';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/monthly',
    name: 'MonthlyUnder2',
    component: Home,
    props: { filter: 'monthly2' }
  },
  {
    path: '/under15',
    name: 'AnnualUnder15',
    component: Home,
    props: { filter: 'annual15' }
  },
  {
    path: '/under25',
    name: 'AnnualUnder25',
    component: Home,
    props: { filter: 'annual25' }
  },
  {
    path: '/nat',
    name: 'NatOpenVZ',
    component: Home,
    props: { filter: 'natopenVZ' }
  },
  {
    path: '/highspec',
    name: 'HighSpec',
    component: Home,
    props: { filter: 'highSpec' }
  },
  {
    path: '/storage',
    name: 'Storage',
    component: Home,
    props: { filter: 'storage' }
  },
  {
    path: '/free',
    name: 'FreeVPS',
    component: Home,
    props: { filter: 'free' }
  },
  {
    path: '/vds',
    name: 'VDSServer',
    component: Home,
    props: { filter: 'vds' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/adminshuhao1031',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/adminshuhao1031/panel',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// 简单的路由守卫，检查是否已登录
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 强制刷新登录状态检查
    store.commit('syncLoginStatus');
    
    // 使用store来检查登录状态
    if (!store.getters.isLoggedIn) {
      next({ name: 'AdminLogin' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
