export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { initAuth, isLoggedIn } = useAuth()
  initAuth()

  const publicPages = ['/login', '/setup']
  if (publicPages.includes(to.path)) return

  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
})
