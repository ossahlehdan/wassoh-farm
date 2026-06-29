<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Cultures</h1>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700"
        @click="showForm = !showForm"
      >
        <Icon name="lucide:plus" size="16" />
        {{ showForm ? 'Fermer' : 'Nouvelle culture' }}
      </button>
    </div>

    <!-- Form -->
    <form v-if="showForm" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="handleSubmit">
      <h2 class="text-sm font-semibold text-gray-700">{{ editing ? 'Modifier' : 'Nouvelle culture' }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Culture</label>
          <input v-model="form.name" type="text" required placeholder="Ex: Riz, Maïs, Manioc..."
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Site / Parcelle</label>
          <select v-model="form.siteId" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
            <option value="" disabled>Choisir un site...</option>
            <option v-for="s in sites" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Superficie</label>
          <input v-model="form.area" type="number" min="0" step="0.01" placeholder="Superficie"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Unité</label>
          <select v-model="form.areaUnit"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
            <option value="ha">Hectares</option>
            <option value="m2">m²</option>
            <option value="acre">Acres</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Date de semis</label>
          <input v-model="form.startDate" type="date" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Statut</label>
        <select v-model="form.status"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
          <option value="en_cours">En cours</option>
          <option value="recoltee">Récoltée</option>
          <option value="abandonnee">Abandonnée</option>
        </select>
      </div>
      <textarea v-model="form.note" rows="2" placeholder="Note (optionnel)"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-farm-500" />
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <div class="flex gap-2">
        <button type="submit" class="px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700">
          {{ editing ? 'Enregistrer' : 'Ajouter' }}
        </button>
        <button v-if="editing" type="button" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm" @click="cancelEdit">Annuler</button>
      </div>
    </form>

    <!-- List -->
    <div v-if="loading" class="text-center py-8 text-gray-400">Chargement...</div>
    <div v-else class="space-y-3">
      <div v-for="c in culturesList" :key="c.id" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <p class="font-medium text-gray-900">{{ c.name }}</p>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="statusClass(c.status)">{{ statusLabel(c.status) }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ c.siteName }} &middot; Semis {{ formatDate(c.startDate) }}</p>
            <p v-if="c.area" class="text-xs text-gray-400">{{ c.area }} {{ c.areaUnit === 'm2' ? 'm²' : c.areaUnit }}</p>
            <p v-if="c.pepiniereId" class="text-xs text-purple-500 mt-0.5">Issue de pépinière</p>
          </div>
          <div class="flex items-center gap-3">
            <button class="text-xs text-farm-600 hover:underline" @click="startEdit(c)">Modifier</button>
            <button v-if="isAdmin" class="text-xs text-red-500 hover:underline" @click="confirmDelete(c)">Supprimer</button>
          </div>
        </div>
      </div>
      <p v-if="culturesList.length === 0" class="text-center py-8 text-gray-400">Aucune culture</p>
    </div>

    <ConfirmModal
      :show="!!deleting"
      title="Supprimer la culture"
      :message="`Voulez-vous vraiment supprimer ${deleting?.name} ?`"
      @confirm="deleteCulture"
      @cancel="deleting = null"
    />
  </div>
</template>

<script setup lang="ts">
const { $authFetch, isAdmin } = useAuth()

const culturesList = ref<any[]>([])
const sites = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const showForm = ref(false)
const editing = ref<number | null>(null)
const deleting = ref<any>(null)
const form = reactive({ name: '', siteId: '', area: '', areaUnit: 'ha', startDate: new Date().toISOString().split('T')[0], status: 'en_cours', note: '' })

function statusLabel(s: string) {
  return { en_cours: 'En cours', recoltee: 'Récoltée', abandonnee: 'Abandonnée' }[s] || s
}

function statusClass(s: string) {
  return {
    en_cours: 'bg-green-100 text-green-700',
    recoltee: 'bg-blue-100 text-blue-700',
    abandonnee: 'bg-gray-100 text-gray-500',
  }[s] || 'bg-gray-100 text-gray-500'
}

async function fetchData() {
  loading.value = true
  try {
    const [c, s] = await Promise.all([
      $authFetch<any[]>('/api/cultures'),
      $authFetch<any[]>('/api/sites'),
    ])
    culturesList.value = c
    sites.value = s
  } finally { loading.value = false }
}

function startEdit(c: any) {
  editing.value = c.id
  form.name = c.name
  form.siteId = String(c.siteId)
  form.area = c.area || ''
  form.areaUnit = c.areaUnit || 'ha'
  form.startDate = c.startDate
  form.status = c.status
  form.note = c.note || ''
  showForm.value = true
}

function cancelEdit() {
  editing.value = null
  Object.assign(form, { name: '', siteId: '', area: '', areaUnit: 'ha', startDate: new Date().toISOString().split('T')[0], status: 'en_cours', note: '' })
}

async function handleSubmit() {
  error.value = ''
  try {
    const body = { ...form, siteId: Number(form.siteId), area: form.area ? Number(form.area) : null }
    if (editing.value) {
      await $authFetch(`/api/cultures/${editing.value}`, { method: 'PUT', body })
      editing.value = null
    } else {
      await $authFetch('/api/cultures', { method: 'POST', body })
    }
    cancelEdit()
    showForm.value = false
    await fetchData()
  } catch (e: any) { error.value = e.data?.message || e.statusMessage || 'Erreur' }
}

function confirmDelete(c: any) {
  deleting.value = c
}

async function deleteCulture() {
  if (!deleting.value) return
  await $authFetch(`/api/cultures/${deleting.value.id}`, { method: 'DELETE' })
  deleting.value = null
  await fetchData()
}

onMounted(fetchData)
</script>
