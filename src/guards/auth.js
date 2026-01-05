// Simple auth guard example
export const authGuard = (to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const isPublic = to.meta?.public
  if (isPublic || token) {
    next()
  } else {
    next({ name: 'login' })
  }
}
