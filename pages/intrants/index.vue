<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Intrants</h1>
      <button v-if="isAdmin" class="flex items-center gap-2 px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700"
        @click="showForm = !showForm">
        <Icon name="lucide:plus" size="16" />
        {{ showForm ? 'Fermer' : 'Nouvel intrant' }}
      </button>
    </div>

    <!-- Form -->
    <form v-if="showForm" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="handleSubmit">
      <h2 class="text-sm font-semibold text-gray-700">{{ editing ? 'Modifier' : 'Nouvel intrant' }}</h2>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Nom</label>
        <input v-model="form.name" type="text" required placeholder="Ex: NPK 15-15-15, Semence de riz..."
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Catégorie</label>
          <select v-model="form.category" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
            <option value="" disabled>Choisir...</option>
            <option v-for="c in intrantCategories" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Unité</label>
          <select v-model="form.unit" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
            <option value="kg">kg</option>
            <option value="tonne">tonne</option>
            <option value="sac">sac</option>
            <option value="litre">litre</option>
            <option value="pièce">pièce</option>
          </select>
        </div>
      </div>
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <div class="flex gap-2">
        <button type="submit" class="px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700">
          {{ editing ? 'Enregistrer' : 'Ajouter' }}
        </button>
        <button v-if="editing" type="button" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm" @click="cancelEdit">Annuler</button>
      </div>
    </form>

    <!-- Stock -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-3">Stock</h2>
      <div v-if="stockItems.length === 0" class="text-center py-4 text-gray-400 text-sm">Aucun stock</div>
      <div v-else class="space-y-2">
        <div v-for="s in stockItems" :key="s.id" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900">{{ s.intrantName }}</p>
            <p class="text-xs text-gray-500">{{ s.intrantCategory }} &middot; {{ s.siteName || 'Entrepôt central' }}</p>
          </div>
          <p class="text-sm font-semibold text-farm-700">{{ s.quantity }} {{ s.intrantUnit }}</p>
        </div>
      </div>
    </div>

    <!-- Catalogue -->
    <div>
      <h2 class="text-lg font-semibold text-gray-800 mb-3">Catalogue</h2>
      <div v-if="intrantsList.length === 0" class="text-center py-4 text-gray-400 text-sm">Aucun intrant</div>
      <div v-else class="space-y-2">
        <div v-for="i in intrantsList" :key="i.id" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <p class="font-medium text-gray-900">{{ i.name }}</p>
            <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{{ i.category }}</span>
            <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{{ i.unit }}</span>
          </div>
          <div v-if="isAdmin" class="flex items-center gap-3">
            <button class="text-xs text-farm-600 hover:underline" @click="startEdit(i)">Modifier</button>
            <button class="text-xs text-red-500 hover:underline" @click="deleteIntrant(i.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { intrantCategories } from '~/utils/categories'

const { $authFetch, isAdmin } = useAuth()

const intrantsList = ref<any[]>([])
const stockItems = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const showForm = ref(false)
const editing = ref<number | null>(null)
const form = reactive({ name: '', category: '', unit: 'kg' })

async function fetchData() {
  loading.value = true
  try {
    const [i, s] = await Promise.all([
      $authFetch<any[]>('/api/intrants'),
      $authFetch<any[]>('/api/intrants/stock'),
    ])
    intrantsList.value = i
    stockItems.value = s
  } finally { loading.value = false }
}

function startEdit(i: any) {
  editing.value = i.id
  form.name = i.name
  form.category = i.category
  form.unit = i.unit
  showForm.value = true
}

function cancelEdit() {
  editing.value = null
  Object.assign(form, { name: '', category: '', unit: 'kg' })
}

async function handleSubmit() {
  error.value = ''
  try {
    if (editing.value) {
      await $authFetch(`/api/intrants/${editing.value}`, { method: 'PUT', body: form })
    } else {
      await $authFetch('/api/intrants', { method: 'POST', body: form })
    }
    cancelEdit()
    showForm.value = false
    await fetchData()
  } catch (e: any) { error.value = e.data?.message || e.statusMessage || 'Erreur' }
}

async function deleteIntrant(id: number) {
  if (!confirm('Supprimer cet intrant ?')) return
  await $authFetch(`/api/intrants/${id}`, { method: 'DELETE' })
  await fetchData()
}

onMounted(fetchData)
</script>
