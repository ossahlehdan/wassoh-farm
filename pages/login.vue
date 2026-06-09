<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-farm-700">Wassoh Farm</h1>
        <p class="text-gray-500 mt-2">Gestion financière agricole</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Connexion</h2>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
              placeholder="••••••••"
            />
          </div>

          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-farm-600 hover:bg-farm-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
          >
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login, isLoggedIn, initAuth } = useAuth()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

onMounted(() => {
  initAuth()
  if (isLoggedIn.value) {
    router.replace('/')
  }
})

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await login(form.email, form.password)
    router.push('/')
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>
