interface AuthUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'employee'
  siteId: number | null
}

const user = ref<AuthUser | null>(null)
const token = ref<string | null>(null)
const initialized = ref(false)

export function useAuth() {
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isEmployee = computed(() => user.value?.role === 'employee')

  function setAuth(newToken: string, newUser: AuthUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('auth_token', newToken)
    localStorage.setItem('auth_user', JSON.stringify(newUser))
  }

  function clearAuth() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  function initAuth() {
    if (initialized.value) return
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
    initialized.value = true
  }

  async function login(email: string, password: string) {
    const data = await $fetch<{ token: string; user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    setAuth(data.token, data.user)
    return data.user
  }

  async function setup(name: string, email: string, password: string) {
    const data = await $fetch<{ token: string; user: AuthUser }>('/api/auth/setup', {
      method: 'POST',
      body: { name, email, password },
    })
    setAuth(data.token, data.user)
    return data.user
  }

  function logout() {
    clearAuth()
    navigateTo('/login')
  }

  // Helper to get auth headers for API calls
  function authHeaders(): Record<string, string> {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  // Authenticated fetch helper
  function $authFetch<T>(url: string, opts: any = {}): Promise<T> {
    return $fetch(url, {
      ...opts,
      headers: { ...opts.headers, ...authHeaders() },
    }) as Promise<T>
  }

  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    isEmployee,
    initAuth,
    login,
    setup,
    logout,
    authHeaders,
    $authFetch,
  }
}
