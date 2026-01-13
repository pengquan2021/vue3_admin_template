//封装本地存储 存数据和读数据的方法
const TOKEN_KEY = 'token'

export const SET_TOKEN = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const GET_TOKEN = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const REMOVE_TOKEN = () => {
  return localStorage.removeItem(TOKEN_KEY)
}
