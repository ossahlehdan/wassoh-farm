<template>
  <div>
    <h1 class="text-2xl font-bold text-farm-800 mb-6">Sites</h1>

    <!-- Add form -->
    <form class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="addSite">
      <h2 class="text-sm font-semibold text-gray-700">Ajouter un site</h2>
      <div class="grid grid-cols-2 gap-3">
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="Nom du site"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
        />
        <input
          v-model="form.location"
          type="text"
          placeholder="Localisation"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
        />
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
        v-for="site in sites"
        :key="site.id"
        class="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
      >
        <p class="font-medium text-gray-900">{{ site.name }}</p>
        <p v-if="site.location" class="text-xs text-gray-500">{{ site.location }}</p>
      </div>
      <p v-if="sites.length === 0" class="text-center py-8 text-gray-400">Aucun site</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $authFetch, isAdmin } = useAuth()

if (!isAdmin.value) {
  navigateTo('/')
}
const sites = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const form = reactive({ name: '', location: '' })

async function fetchSites() {
  loading.value = true
  try {
    sites.value = await $authFetch('/api/sites')
  } finally {
    loading.value = false
  }
}

async function addSite() {
  error.value = ''
  try {
    await $authFetch('/api/sites', { method: 'POST', body: form })
    form.name = ''
    form.location = ''
    await fetchSites()
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'Erreur'
  }
}

onMounted(fetchSites)
</script>
