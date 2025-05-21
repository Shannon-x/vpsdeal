import { createRouter, createWebHashHistory } from 'vue-router';
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
    path: '/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/panel',
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
  history: createWebHashHistory('/adminshuhao1031/'),
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
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth) {
    if (store.getters.isLoggedIn) { // 如果Vuex状态已经是登录
      next(); // 直接放行
    } else {
      // Vuex状态显示未登录，尝试从localStorage同步
      store.commit('syncLoginStatus');
      if (store.getters.isLoggedIn) { // 再次检查
        next();
      } else {
        next({ name: 'AdminLogin' }); // 仍然未登录，则跳转到登录页
      }
    }
  } else {
    next(); // 不需要认证的路由，直接放行
  }
});

export default router;
