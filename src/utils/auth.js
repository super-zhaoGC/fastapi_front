// 获取本地存储中的 token（用于登录态判断）
const getToken = () => {
  return localStorage.getItem('tokenKey')
}

// 将 token 保存到本地存储（登录成功后调用）
const setToken = (token) => {
  localStorage.setItem('tokenKey', token)
}

// 移除本地存储中的 token（退出登录时调用）
const removeToken = () => {
  localStorage.removeItem('tokenKey')
}

export { getToken, setToken, removeToken }