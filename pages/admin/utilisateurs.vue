<template>
  <div>
    <h1 class="text-2xl font-bold text-farm-800 mb-6">Utilisateurs</h1>

    <!-- Add form -->
    <form class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="addUser">
      <h2 class="text-sm font-semibold text-gray-700">Ajouter un utilisateur</h2>
      <input
        v-model="form.name"
        type="text"
        required
        placeholder="Nom"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
      />
      <input
        v-model="form.email"
        type="email"
        required
        placeholder="Email"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
      />
      <input
        v-model="form.password"
        type="password"
        required
        placeholder="Mot de passe"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
      />
      <div class="grid grid-cols-2 gap-3">
        <select
          v-model="form.role"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500"
        >
          <option value="employee">Employé</option>
          <option value="admin">Admin</option>
        </select>
        <select
          v-if="form.role === 'employee'"
          v-model="form.siteId"
          required
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500"
        >
          <option value="" disabled>Site...</option>
          <option v-for="s in sites" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <button type="submit" class="px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700">
        Ajouter
      </button>
    </form>

    <!-- List -->
    <div v-if="loading" class="text-center py-8 text-gray-400">Chargement...</div>
    <div v-else class="space-y-3">
      <div
        v-for="u in users"
        :key="u.id"
        class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between"
      >
        <div>
          <p class="font-medium text-gray-900">{{ u.name }}</p>
          <p class="text-xs text-gray-500">{{ u.email }}</p>
        </div>
        <div class="text-right">
          <span
            class="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
            :class="u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
          >
            {{ u.role === 'admin' ? 'Admin' : 'Employé' }}
          </span>
          <p v-if="u.siteName" class="text-xs text-gray-400 mt-1">{{ u.siteName }}</p>
        </div>
      </div>
      <p v-if="users.length === 0" class="text-center py-8 text-gray-400">Aucun utilisateur</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $authFetch, isAdmin } = useAuth()

if (!isAdmin.value) {
  navigateTo('/')
}
const users = ref<any[]>([])
const sites = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const form = reactive({ name: '', email: '', password: '', role: 'employee', siteId: '' })

async function fetchData() {
  loading.value = true
  try {
    const [u, s] = await Promise.all([
      $authFetch<any[]>('/api/users'),
      $authFetch<any[]>('/api/sites'),
    ])
    users.value = u
    sites.value = s
  } finally {
    loading.value = false
  }
}

async function addUser() {
  error.value = ''
  try {
    await $authFetch('/api/users', {
      method: 'POST',
      body: { ...form, siteId: form.siteId ? Number(form.siteId) : null },
    })
    form.name = ''
    form.email = ''
    form.password = ''
    form.role = 'employee'
    form.siteId = ''
    await fetchData()
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'Erreur'
  }
}

onMounted(fetchData)
</script>
