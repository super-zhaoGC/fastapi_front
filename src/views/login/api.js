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
    url: "/getInfo",
    method: "get"
  })
}

export { login, getInfo }