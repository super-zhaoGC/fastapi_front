import request from '@/utils/request'

const login = (data) => {
  return request({
    url: "/login",
    headers: {
      isToken: false
    },
    method: "post",
    data: data
  })
}

const getInfo = () => {
  return request({
    // 后端真实路由: GET /login/getInfo
    url: "/login/getInfo",
    method: "get"
  })
}

export { login, getInfo }