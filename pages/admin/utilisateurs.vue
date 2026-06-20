<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Utilisateurs</h1>

    <!-- Add / Edit form -->
    <form class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="handleSubmit">
      <h2 class="text-sm font-semibold text-gray-700">
        {{ editing ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur' }}
      </h2>
      <input
        v-model="form.name"
        type="text"
        required
        placeholder="Nom"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
      />
      <input
        v-model="form.username"
        type="text"
        required
        placeholder="Identifiant"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
      />
      <input
        v-model="form.password"
        type="password"
        :required="!editing"
        :placeholder="editing ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'"
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
      <div class="flex gap-2">
        <button type="submit" class="px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700">
          {{ editing ? 'Enregistrer' : 'Ajouter' }}
        </button>
        <button
          v-if="editing"
          type="button"
          class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
          @click="cancelEdit"
        >
          Annuler
        </button>
      </div>
    </form>

    <!-- List -->
    <div v-if="loading" class="text-center py-8 text-gray-400">Chargement...</div>
    <div v-else class="space-y-3">
      <div
        v-for="u in users"
        :key="u.id"
        class="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900">{{ u.name }}</p>
            <p class="text-xs text-gray-500">{{ u.username }}</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <span
                class="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                :class="u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
              >
                {{ u.role === 'admin' ? 'Admin' : 'Employé' }}
              </span>
              <p v-if="u.siteName" class="text-xs text-gray-400 mt-1">{{ u.siteName }}</p>
            </div>
            <button class="text-xs text-farm-600 hover:underline" @click="startEdit(u)">Modifier</button>
            <button class="text-xs text-red-500 hover:underline" @click="deleteUser(u.id)">Supprimer</button>
          </div>
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
const editing = ref<number | null>(null)
const form = reactive({ name: '', username: '', password: '', role: 'employee', siteId: '' })

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

function startEdit(user: any) {
  editing.value = user.id
  form.name = user.name
  form.username = user.username
  form.password = ''
  form.role = user.role
  form.siteId = user.siteId ? String(user.siteId) : ''
}

function cancelEdit() {
  editing.value = null
  form.name = ''
  form.username = ''
  form.password = ''
  form.role = 'employee'
  form.siteId = ''
}

async function handleSubmit() {
  error.value = ''
  try {
    const body = { ...form, siteId: form.siteId ? Number(form.siteId) : null }
    if (editing.value) {
      if (!body.password) delete (body as any).password
      await $authFetch(`/api/users/${editing.value}`, { method: 'PUT', body })
      editing.value = null
    } else {
      await $authFetch('/api/users', { method: 'POST', body })
    }
    form.name = ''
    form.username = ''
    form.password = ''
    form.role = 'employee'
    form.siteId = ''
    await fetchData()
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'Erreur'
  }
}

async function deleteUser(id: number) {
  if (!confirm('Supprimer cet utilisateur ?')) return
  try {
    await $authFetch(`/api/users/${id}`, { method: 'DELETE' })
    await fetchData()
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'Erreur lors de la suppression'
  }
}

onMounted(fetchData)
</script>
