<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Achats d'intrants</h1>
      <button v-if="isAdmin" class="flex items-center gap-2 px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700"
        @click="showForm = !showForm">
        <Icon name="lucide:plus" size="16" />
        {{ showForm ? 'Fermer' : 'Nouvel achat' }}
      </button>
    </div>

    <form v-if="showForm" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="addPurchase">
      <h2 class="text-sm font-semibold text-gray-700">Nouvel achat</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Nom de l'intrant</label>
          <input v-model="form.name" type="text" required placeholder="Ex: Engrais NPK, Semence riz..."
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Type</label>
          <select v-model="form.category" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
            <option value="" disabled>Choisir le type...</option>
            <option v-for="c in intrantCategories" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Quantité</label>
          <input v-model="form.quantity" type="number" min="0" step="any" required placeholder="Quantité"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
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
            <option value="boîte">boîte</option>
            <option value="bidon">bidon</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Prix unitaire (GNF)</label>
          <input v-model="form.unitPrice" type="number" min="0" step="any" required placeholder="Prix"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
      </div>
      <p v-if="form.quantity && form.unitPrice" class="text-sm text-gray-600">
        Total : <span class="font-semibold text-farm-700">{{ formatCurrency(Number(form.quantity) * Number(form.unitPrice)) }}</span>
      </p>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Fournisseur (optionnel)</label>
          <input v-model="form.supplier" type="text" placeholder="Nom du fournisseur"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Date</label>
          <input v-model="form.date" type="date" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
      </div>
      <textarea v-model="form.note" rows="2" placeholder="Note (optionnel)"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-farm-500" />
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <button type="submit" class="px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700">Enregistrer</button>
    </form>

    <div v-if="loading" class="text-center py-8 text-gray-400">Chargement...</div>
    <div v-else class="space-y-3">
      <div v-for="p in purchases" :key="p.id" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-start justify-between">
          <div>
            <p class="font-medium text-gray-900">{{ p.intrantName }}</p>
            <p class="text-xs text-gray-500">{{ p.quantity }} {{ p.intrantUnit }} &times; {{ formatCurrency(p.unitPrice) }}</p>
            <p v-if="p.supplier" class="text-xs text-gray-400 mt-0.5">{{ p.supplier }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-red-600">{{ formatCurrency(p.totalAmount) }}</p>
            <p class="text-xs text-gray-400">{{ formatDate(p.date) }}</p>
          </div>
        </div>
      </div>
      <p v-if="purchases.length === 0" class="text-center py-8 text-gray-400">Aucun achat</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { intrantCategories } from '~/utils/categories'

const { $authFetch, isAdmin } = useAuth()
const purchases = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const showForm = ref(false)
const form = reactive({ name: '', category: '', quantity: '', unit: 'kg', unitPrice: '', supplier: '', date: new Date().toISOString().split('T')[0], note: '' })

async function fetchData() {
  loading.value = true
  try {
    purchases.value = await $authFetch<any[]>('/api/intrants/achats')
  } finally { loading.value = false }
}

async function addPurchase() {
  error.value = ''
  try {
    await $authFetch('/api/intrants/achats', { method: 'POST', body: { ...form } })
    Object.assign(form, { name: '', category: '', quantity: '', unit: 'kg', unitPrice: '', supplier: '', date: new Date().toISOString().split('T')[0], note: '' })
    showForm.value = false
    await fetchData()
  } catch (e: any) { error.value = e.data?.message || e.statusMessage || 'Erreur' }
}

onMounted(fetchData)
</script>
