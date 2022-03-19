import Storage from './storage'

const TokenKey = 'admin_access_token'

export function getToken() {
  return Storage.get(TokenKey)
}

export function setToken(data) {
  return Storage.set(TokenKey, data)
}

export function removeToken() {
  return Storage.remove(TokenKey)
}
