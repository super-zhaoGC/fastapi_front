import { createRouter, createWebHistory } from 'vue-router'


import Layout from '@/views/layout'


const constantRoutes = [
  {
    path:'/',
    component:Layout,
    redirect:'index',
    children:[
      {
        path:'index',
        name:'index',
        meta:{
          title:'首页'
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
