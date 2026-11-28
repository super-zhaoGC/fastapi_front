import { createRouter, createWebHistory } from 'vue-router'


import Layout from '@/views/layout'


const constantRoutes = [
  {
    path: "/login",
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: {
      title: '登录'
    }
  },
  {
    path: "/register",
    component: () => import('@/views/register/index.vue'),
    hidden: true,
    meta: {
      title: '注册'
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        name: 'index',
        meta: {
          title: '首页'
        },
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true, // 不会在侧边菜单中显示
    children: [
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人中心'
        },
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router
