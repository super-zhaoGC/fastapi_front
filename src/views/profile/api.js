import request from '@/utils/request'

const updateProfile = (data) => {
  return request({
    url: "/system/user/profile",
    method: "put",
    data: data
  })
}
const updatePwd = (data) => {
  return request({
    url: "/system/user/updatePwd",
    method: "put",
    data: data
  })
}

export { updateProfile, updatePwd }
