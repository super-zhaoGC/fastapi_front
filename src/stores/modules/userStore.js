// 引入 Pinia 的 defineStore 方法，用于定义状态仓库
import { defineStore } from 'pinia'
// 引入 token 的读取、写入、清除工具函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 引入登录接口和获取用户信息接口
import { login, getInfo } from '@/views/login/api'
// 引入默认头像图片
import defaultAvatar from '@/assets/images/profile.jpg'

// 定义用户状态仓库（仓库 id 为 'user'）
const useUserStore = defineStore(
  'user',
  {
    // 仓库初始数据（state）
    state: () => ({
      // token 初始化时从本地存储中读取，保证刷新页面后登录态不丢失
      token: getToken(),
      // 用户 id
      id: '',
      // 用户名称
      name: '',
      // 用户头像地址
      avatar: '',
    }),
    // 仓库的动作方法（actions）
    actions: {
      // 登录操作：调用登录接口并保存 token
      login(userInfo) {
        //异步操作：使用 Promise 封装，返回执行结果供调用方使用
        return new Promise((resolve, reject) => {
          //调用登录接口，传入用户信息（用户名、密码等）
          login(userInfo).then(res => {
            //登录成功
            //1.保存token到本地存储(这样一来刷新页面后也不会丢失)
            setToken(res.token)

            //2.更新Store中的token（保持本地与内存状态一致）
            this.token = res.token

            //3.告诉调用者: 成功了!
            resolve()
          }).catch(error => {
            //登录失败：将错误传递出去
            reject(error)
          })
        })
      },
      // 获取用户信息：调用接口后处理并存入仓库
      getInfo() {
        return new Promise((resolve, reject) => {
          // 调用获取用户信息接口
          getInfo().then(res => {
            // 后端返回的用户信息
            const user = res.data
            // 优先使用后端返回的头像地址
            let avatar = user.avatar || ""
            // 若头像地址既不是 http:// 也不是 https:// 开头
            if (avatar.indexOf("http://") === -1 && avatar.indexOf("https://") === -1) {
              if (avatar) {
                // 有相对路径头像，则拼接服务器基础地址
                avatar = import.meta.env.VITE_BASE_URL + avatar
              } else {
                // 无头像时使用默认头像
                avatar = defaultAvatar
              }
            }
            // 将用户信息更新到仓库状态
            this.id = user.id
            this.name = user.name
            this.avatar = avatar
            // 返回原始响应数据供调用方使用
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 退出登录：清空内存与本地存储中的登录态
      logout() {
        return new Promise(resolve => {
          // 清空仓库中的 token
          this.token = ''
          // 清除本地存储中的 token
          removeToken()
          // 通知调用方退出成功
          resolve()
        })
      }
    }
  }
)
// 导出用户状态仓库
export default useUserStore