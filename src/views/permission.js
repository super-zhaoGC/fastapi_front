// 引入路由实例
import router from '@/router'
// 引入用户状态仓库，用于获取/刷新用户信息
import useUserStore from '@/stores/modules/userStore'
// 引入读取本地 token 的工具函数
import { getToken } from '@/utils/auth'
// 引入请求模块中导出的重新登录开关标记，用于避免重复弹出
import { isReLogin } from '@/utils/request'
// 引入 Element Plus 的消息提示组件（本文件里用到 ElMessage，必须显式引入）
import { ElMessage } from 'element-plus'

// 白名单：无需登录即可访问的路由路径
const whiteList = ["/login", "/register"]
// 判断指定路径是否在白名单中
const isWhiteList = (path) => {
  return whiteList.includes(path)
}

// 全局前置守卫：在每次路由跳转前执行
router.beforeEach((to, from, next) => {
  // 用户仓库实例必须在守卫回调内部获取，不能放在模块顶层：
  // 本文件被 main.js 通过 import 引入，ESM 的 import 会先于 main.js 的函数体执行，
  // 此时 app.use(pinia) 还没执行，Pinia 尚未激活，顶层调用会抛出
  // "getActivePinia() was called but there was no active Pinia"。
  // 放在这里则可在每次导航时拿到已激活的 store（Pinia 内部会缓存，重复调用无开销）。
  const userStore = useUserStore()

  // 已登录状态（本地存在 token）
  if (getToken()) {
    // 已登录时禁止访问登录/注册页，直接跳转到首页
    if (to.path === '/login' || to.path === '/register') {
      next({ path: '/' })
      // 目标路径在白名单内（如"/"首页）直接放行
    } else if (isWhiteList(to.path)) {
      next()
    } else {
      // 进入其它页面时，若仓库中还没有用户信息，则需要先拉取
      if (userStore.name === '') {
        // 置位标记，防止多个请求同时触发重新登录弹窗
        isReLogin.show = true
        // 调用接口获取用户信息
        userStore.getInfo().then((res) => {
          // 获取成功后复位标记，并继续跳转到目标页面
          isReLogin.show = false
          next({ path: to.path })
        }).catch((err) => {
          // 获取用户信息失败（如 token 失效），执行退出登录并回到登录页
          userStore.logout().then(() => {
            ElMessage.error(err)
            next({ path: '/login' })
          })
        })
      } else {
        // 用户信息已存在，直接放行
        next()
      }
    }
  } else {
    // 未登录状态
    // 如果目标路径在白名单内，放行
    if (isWhiteList(to.path)) {
      next()
    } else {
      // 否则跳转到登录页
      next("/login")
    }
  }
})