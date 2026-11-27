import request from '@/utils/request'

const register = (register_data) => {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: register_data
  })
}

export { register }
