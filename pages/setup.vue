<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-farm-700">Wassoh Farm</h1>
        <p class="text-gray-500 mt-2">Créer le compte administrateur</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Premier administrateur</h2>

        <form class="space-y-4" @submit.prevent="handleSetup">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
            />
          </div>

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Identifiant</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
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
              minlength="4"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
            />
          </div>

          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-farm-600 hover:bg-farm-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
          >
            {{ loading ? 'Création...' : 'Créer le compte' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { setup: setupAdmin } = useAuth()
const router = useRouter()

const form = reactive({ name: '', username: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleSetup() {
  error.value = ''
  loading.value = true
  try {
    await setupAdmin(form.name, form.username, form.password)
    router.push('/')
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}
</script>
