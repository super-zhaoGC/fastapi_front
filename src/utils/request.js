// 引入 axios 用于发起 HTTP 请求
import axios from 'axios'
// 引入 Element Plus 的消息提示和弹窗组件
import { ElMessage, ElMessageBox } from 'element-plus'
// 引入获取本地存储 token 的工具函数
import { getToken } from '@/utils/auth'

// 全局标记：是否已弹出"重新登录"提示框，避免重复弹出
let isReLogin = {
  show: false
}

// 设置 axios 全局默认请求头，统一使用 JSON 格式与 UTF-8 编码
axios.defaults.headers["Content-Type"] = "application/json;charset=UTF-8"


// 创建 axios 实例，配置基础路径和超时时间
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 3000
})

// 处理登录过期：弹出确认框，提示用户重新登录
const handleReLogin = () => {
  // 若已弹出提示框，则直接返回，防止重复弹出
  if (isReLogin.show) {
    return
  }

  // 标记当前已弹出提示框
  isReLogin.show = true

  // 弹出确认框，询问用户是否重新登录
  ElMessageBox.confirm(
    '登录状态已过期,您可以继续留在当前页面,或者重新登录',
    '系统提示',
    {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 用户点击"重新登录"后重置标记
    isReLogin.show = false
  }).catch(() => {
    // 用户取消或关闭弹窗后重置标记
    isReLogin.show = false
  })
}

// 请求拦截器：在发送请求前统一处理
request.interceptors.request.use(
  config => {
    // 判断本次请求是否需要携带 token（默认需要）
    const isToken = config.headers?.isToken !== false
    // 判断本次请求是否需要做防重复提交校验（默认需要）
    const isRepeatSubmit = config.headers?.repeatSubmit !== false

    // 存在 token 且允许携带时，将 token 拼接到请求头
    if (getToken() && isToken) {
      config.headers["Authorization"] = "Bearer " + getToken()
    }

    // 针对 POST、PUT 请求做防重复提交校验
    if (!isRepeatSubmit && ['post', 'put'].includes(config.method)) {
      // 记录当前请求的关键信息（url、data、时间戳）
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime()
      }
      // 从 sessionStorage 中取出上一次请求信息
      const sessionValue = sessionStorage.getItem("sessionObj")
      const sessionObj = sessionValue ? JSON.parse(sessionValue) : null
      if (sessionObj) {
        // 解构上一次请求的 url、data、time
        const { url: s_url, data: s_data, time: s_time } = sessionObj
        // 设置重复提交判定时间间隔为 1 秒
        const interval = 1000

        // 如果 url、data 相同且间隔小于 1 秒，视为重复提交并提示
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = "请勿重复提交表单"
          ElMessage.error(message)
        }
      }
      // 将当前请求信息存入 sessionStorage，供下次请求比较
      sessionStorage.setItem("sessionObj", JSON.stringify(requestObj))
    }
    // 返回处理后的配置
    return config

  }, error => {
    // 请求发送前的错误处理
    ElMessage.error(error)
  }
)


// 响应拦截器：统一处理后端返回的数据和错误
request.interceptors.response.use(res => {
  // 如果请求的是文件流（blob），直接返回原始数据
  if (['blob'.includes(res.request.responseType)]) {
    return res.data
  }
  // 从响应中取出业务状态码和提示信息，无则赋予默认值
  const code = res.data.code || 200
  const msg = res.data.msg || "操作失败"

  // 状态码为 401 表示登录过期，弹出重新登录提示
  if (code === 401) {
    handleReLogin()
    return Promise.reject("登录状态已过期，请重新登录")
  }
  // 状态码不为 200 表示业务失败，弹出错误提示并抛出异常
  if (code !== 200) {
    ElMessage.error(msg)
    return Promise.reject(new Error(msg))
  }
  // 成功时直接返回后端数据
  return res.data
}, error => {
  // 解构错误信息与响应对象
  let { message, response } = error
  // HTTP 状态码为 401 表示登录过期，弹出重新登录提示
  if (response?.status === 401) {
    handleReLogin()
    return Promise.reject("登录状态已过期，请重新登录")
  }
  // 将常见的网络错误映射为友好的中文提示
  const errMap = {
    'Network Error': '后端接口连接异常', //网络断了
    'timeout': '系统接口请求超时',
    'Request failed with status code': '系统接口' + message.substr(message.length - 3) + '异常'
  }

  // 遍历错误映射，将匹配到的英文错误替换为中文提示
  Object.keys(errMap).forEach(key => {
    if (message.includes(key)) {
      message = errMap[key]
    }
  })
  // 弹出错误提示
  ElMessage.error(message)
  return Promise.reject(error)
}
)

// 导出封装的请求实例供全局使用
export default request