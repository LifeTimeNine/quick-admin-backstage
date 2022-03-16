import Storage from './storage'

const TokenKey = 'admin_access_token'

export function getTokenData() {
  return Storage.get(TokenKey)
}

export function setTokenData(data) {
  return Storage.set(TokenKey, data)
}

export function getToken() {
  return getTokenData() ? getTokenData().access_token : null
}

export function removeTokenData() {
  return Storage.remove(TokenKey)
}
