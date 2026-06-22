<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Sites</h1>

    <!-- Add / Edit form -->
    <form class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="handleSubmit">
      <h2 class="text-sm font-semibold text-gray-700">
        {{ editing ? 'Modifier le site' : 'Ajouter un site' }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      <div class="grid grid-cols-2 gap-3">
        <input
          v-model="form.area"
          type="number"
          min="0"
          step="0.01"
          placeholder="Superficie"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
        />
        <select
          v-model="form.areaUnit"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500"
        >
          <option v-for="u in areaUnits" :key="u.value" :value="u.value">{{ u.label }}</option>
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
        v-for="site in sites"
        :key="site.id"
        class="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900">{{ site.name }}</p>
            <p v-if="site.location" class="text-xs text-gray-500">{{ site.location }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span v-if="site.area" class="text-sm font-medium text-farm-700 bg-farm-50 px-2 py-0.5 rounded">
              {{ site.area }} {{ unitLabel(site.areaUnit) }}
            </span>
            <button class="text-xs text-farm-600 hover:underline" @click="startEdit(site)">Modifier</button>
            <button class="text-xs text-red-500 hover:underline" @click="confirmDelete(site)">Supprimer</button>
          </div>
        </div>
      </div>
      <p v-if="sites.length === 0" class="text-center py-8 text-gray-400">Aucun site</p>
    </div>

    <ConfirmModal
      :show="!!deleting"
      title="Supprimer le site"
      :message="`Voulez-vous vraiment supprimer ${deleting?.name} ?`"
      @confirm="deleteSite"
      @cancel="deleting = null"
    />
  </div>
</template>

<script setup lang="ts">
const { $authFetch, isAdmin } = useAuth()

if (!isAdmin.value) {
  navigateTo('/')
}

const areaUnits = [
  { value: 'ha', label: 'Hectares (ha)' },
  { value: 'm2', label: 'Mètres carrés (m²)' },
  { value: 'acre', label: 'Acres' },
  { value: 'arpent', label: 'Arpents' },
]

function unitLabel(unit: string) {
  if (unit === 'm2') return 'm²'
  return unit || 'ha'
}

const sites = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const editing = ref<number | null>(null)
const deleting = ref<any>(null)
const form = reactive({ name: '', location: '', area: '', areaUnit: 'ha' })

async function fetchSites() {
  loading.value = true
  try {
    sites.value = await $authFetch('/api/sites')
  } finally {
    loading.value = false
  }
}

function startEdit(site: any) {
  editing.value = site.id
  form.name = site.name
  form.location = site.location || ''
  form.area = site.area || ''
  form.areaUnit = site.areaUnit || 'ha'
}

function cancelEdit() {
  editing.value = null
  form.name = ''
  form.location = ''
  form.area = ''
  form.areaUnit = 'ha'
}

async function handleSubmit() {
  error.value = ''
  try {
    const body = { ...form, area: form.area ? Number(form.area) : null }
    if (editing.value) {
      await $authFetch(`/api/sites/${editing.value}`, { method: 'PUT', body })
      editing.value = null
    } else {
      await $authFetch('/api/sites', { method: 'POST', body })
    }
    form.name = ''
    form.location = ''
    form.area = ''
    form.areaUnit = 'ha'
    await fetchSites()
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'Erreur'
  }
}

function confirmDelete(site: any) {
  deleting.value = site
}

async function deleteSite() {
  if (!deleting.value) return
  try {
    await $authFetch(`/api/sites/${deleting.value.id}`, { method: 'DELETE' })
    deleting.value = null
    await fetchSites()
  } catch (e: any) {
    deleting.value = null
    error.value = e.data?.statusMessage || e.data?.message || e.statusMessage || 'Erreur lors de la suppression'
  }
}

onMounted(fetchSites)
</script>
