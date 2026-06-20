<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Transferts d'intrants</h1>
      <button v-if="isAdmin" class="flex items-center gap-2 px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700"
        @click="showForm = !showForm">
        <Icon name="lucide:plus" size="16" />
        {{ showForm ? 'Fermer' : 'Nouveau transfert' }}
      </button>
    </div>

    <form v-if="showForm" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="addMovement">
      <h2 class="text-sm font-semibold text-gray-700">Nouveau transfert</h2>
      <select v-model="form.intrantId" required
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
        <option value="" disabled>Intrant...</option>
        <option v-for="i in intrantsList" :key="i.id" :value="i.id">{{ i.name }} ({{ i.unit }})</option>
      </select>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Depuis</label>
          <select v-model="form.fromSiteId"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
            <option value="">Entrepôt central</option>
            <option v-for="s in sitesList" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Vers</label>
          <select v-model="form.toSiteId" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
            <option value="" disabled>Site destination...</option>
            <option v-for="s in sitesList" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <input v-model="form.quantity" type="number" min="0" step="any" required placeholder="Quantité"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        <input v-model="form.date" type="date" required
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
      </div>
      <textarea v-model="form.note" rows="2" placeholder="Note (optionnel)"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-farm-500" />
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <button type="submit" class="px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700">Transférer</button>
    </form>

    <div v-if="loading" class="text-center py-8 text-gray-400">Chargement...</div>
    <div v-else class="space-y-3">
      <div v-for="m in movements" :key="m.id" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-start justify-between">
          <div>
            <p class="font-medium text-gray-900">{{ m.intrantName }}</p>
            <p class="text-xs text-gray-500">{{ m.fromSiteName || 'Entrepôt central' }} &rarr; {{ m.toSiteName }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-blue-600">{{ m.quantity }} {{ m.intrantUnit }}</p>
            <p class="text-xs text-gray-400">{{ formatDate(m.date) }}</p>
          </div>
        </div>
      </div>
      <p v-if="movements.length === 0" class="text-center py-8 text-gray-400">Aucun transfert</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $authFetch, isAdmin } = useAuth()
const intrantsList = ref<any[]>([])
const sitesList = ref<any[]>([])
const movements = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const showForm = ref(false)
const form = reactive({ intrantId: '', fromSiteId: '', toSiteId: '', quantity: '', date: new Date().toISOString().split('T')[0], note: '' })

async function fetchData() {
  loading.value = true
  try {
    const [i, s, m] = await Promise.all([
      $authFetch<any[]>('/api/intrants'),
      $authFetch<any[]>('/api/sites'),
      $authFetch<any[]>('/api/intrants/mouvements'),
    ])
    intrantsList.value = i
    sitesList.value = s
    movements.value = m
  } finally { loading.value = false }
}

async function addMovement() {
  error.value = ''
  try {
    await $authFetch('/api/intrants/mouvements', {
      method: 'POST',
      body: {
        intrantId: Number(form.intrantId),
        fromSiteId: form.fromSiteId ? Number(form.fromSiteId) : null,
        toSiteId: Number(form.toSiteId),
        quantity: form.quantity,
        date: form.date,
        note: form.note,
      },
    })
    Object.assign(form, { intrantId: '', fromSiteId: '', toSiteId: '', quantity: '', note: '' })
    showForm.value = false
    await fetchData()
  } catch (e: any) { error.value = e.data?.message || e.statusMessage || 'Erreur' }
}

onMounted(fetchData)
</script>
