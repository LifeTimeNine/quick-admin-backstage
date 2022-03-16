
const Storage = {
  set(key, value) {
    return localStorage.setItem(key, JSON.stringify(value))
  },
  get(key) {
    return JSON.parse(localStorage.getItem(key))
  },
  remove(key) {
    return localStorage.removeItem(key)
  }
}

export default Storage
