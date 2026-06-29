<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Dépenses</h1>
      <button class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
        @click="showForm = !showForm">
        <Icon name="lucide:plus" size="16" />
        {{ showForm ? 'Fermer' : 'Nouvelle dépense' }}
      </button>
    </div>

    <!-- Form -->
    <form v-if="showForm" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="handleSubmit">
      <h2 class="text-sm font-semibold text-gray-700">{{ editing ? 'Modifier' : 'Nouvelle dépense' }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Libellé</label>
          <input v-model="form.label" type="text" required placeholder="Ex: Achat d'engrais"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Montant (GNF)</label>
          <input v-model="form.amount" type="number" min="0" step="any" required placeholder="Montant"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Catégorie</label>
          <select v-model="form.category" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
            <option value="" disabled>Choisir...</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Date</label>
          <input v-model="form.date" type="date" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
      </div>
      <div v-if="isAdmin">
        <label class="block text-xs text-gray-500 mb-1">Site</label>
        <select v-model="form.siteId"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
          <option value="">Aucun site</option>
          <option v-for="s in sites" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <textarea v-model="form.note" rows="2" placeholder="Note (optionnel)"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-farm-500" />
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <div class="flex gap-2">
        <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
          {{ editing ? 'Enregistrer' : 'Ajouter' }}
        </button>
        <button v-if="editing" type="button" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm" @click="cancelEdit">Annuler</button>
      </div>
    </form>

    <!-- List -->
    <div v-if="loading" class="text-center py-8 text-gray-400">Chargement...</div>
    <div v-else class="space-y-3">
      <div v-for="d in depensesList" :key="d.id" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 truncate">{{ d.label }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ d.category }} &middot; {{ formatDate(d.date) }}</p>
            <p v-if="d.siteName" class="text-xs text-blue-500 mt-0.5">{{ d.siteName }}</p>
          </div>
          <p class="text-sm font-semibold text-red-600 ml-3">-{{ formatCurrency(d.amount) }}</p>
        </div>
        <div class="flex gap-2 mt-3 pt-3 border-t border-gray-50">
          <button class="text-xs text-farm-600 hover:underline" @click="startEdit(d)">Modifier</button>
          <button v-if="isAdmin" class="text-xs text-red-500 hover:underline" @click="confirmDelete(d)">Supprimer</button>
        </div>
      </div>
      <p v-if="depensesList.length === 0" class="text-center py-8 text-gray-400">Aucune dépense</p>
    </div>

    <ConfirmModal
      :show="!!deleting"
      title="Supprimer la dépense"
      :message="`Voulez-vous vraiment supprimer ${deleting?.label} ?`"
      @confirm="deleteDepense"
      @cancel="deleting = null"
    />
  </div>
</template>

<script setup lang="ts">
import { depenseCategories } from '~/utils/categories'

const { $authFetch, isAdmin } = useAuth()

const categories = depenseCategories
const depensesList = ref<any[]>([])
const sites = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const showForm = ref(false)
const editing = ref<number | null>(null)
const deleting = ref<any>(null)
const form = reactive({ label: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], siteId: '', note: '' })

async function fetchData() {
  loading.value = true
  try {
    const [d, s] = await Promise.all([
      $authFetch<any[]>('/api/depenses'),
      isAdmin.value ? $authFetch<any[]>('/api/sites') : Promise.resolve([]),
    ])
    depensesList.value = d
    sites.value = s
  } finally { loading.value = false }
}

function startEdit(d: any) {
  editing.value = d.id
  form.label = d.label
  form.amount = d.amount
  form.category = d.category
  form.date = d.date
  form.siteId = d.siteId ? String(d.siteId) : ''
  form.note = d.note || ''
  showForm.value = true
}

function cancelEdit() {
  editing.value = null
  Object.assign(form, { label: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], siteId: '', note: '' })
}

async function handleSubmit() {
  error.value = ''
  try {
    const body = { ...form, siteId: form.siteId ? Number(form.siteId) : null }
    if (editing.value) {
      await $authFetch(`/api/depenses/${editing.value}`, { method: 'PUT', body })
    } else {
      await $authFetch('/api/depenses', { method: 'POST', body })
    }
    cancelEdit()
    showForm.value = false
    await fetchData()
  } catch (e: any) { error.value = e.data?.message || e.statusMessage || 'Erreur' }
}

function confirmDelete(d: any) {
  deleting.value = d
}

async function deleteDepense() {
  if (!deleting.value) return
  await $authFetch(`/api/depenses/${deleting.value.id}`, { method: 'DELETE' })
  deleting.value = null
  await fetchData()
}

onMounted(fetchData)
</script>
