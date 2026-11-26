// 引入路由实例
import router from '@/router'

// 白名单：无需登录即可访问的路由路径
const whiteList = ["/login", "/register"]

// 判断指定路径是否在白名单中
const isWhiteList = (path) => {
  return whiteList.includes(path)
}

// 全局前置守卫：在每次路由跳转前执行
router.beforeEach((to, from, next) => {
  // 如果目标路径在白名单内，放行
  if (isWhiteList(to.path)) {
    next()
  } else {
    // 否则跳转到登录页
    next("/login")
  }
})