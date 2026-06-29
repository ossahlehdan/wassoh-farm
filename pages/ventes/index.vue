<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Ventes</h1>
      <button class="flex items-center gap-2 px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700"
        @click="showForm = !showForm">
        <Icon name="lucide:plus" size="16" />
        {{ showForm ? 'Fermer' : 'Nouvelle vente' }}
      </button>
    </div>

    <!-- Form -->
    <form v-if="showForm" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="handleSubmit">
      <h2 class="text-sm font-semibold text-gray-700">{{ editing ? 'Modifier' : 'Nouvelle vente' }}</h2>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Récolte</label>
        <select v-model="form.recolteId" required
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500"
          @change="onRecolteChange">
          <option value="" disabled>Choisir une récolte...</option>
          <option v-for="r in recoltesList" :key="r.id" :value="r.id">
            {{ r.cultureName }} — {{ r.quantity }} {{ formatUnit(r.unit) }} ({{ formatDate(r.date) }})
          </option>
        </select>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Quantité</label>
          <input v-model="form.quantity" type="number" min="0" step="any" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Unité</label>
          <select v-model="form.unit" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
            <option value="kg">kg</option>
            <option value="tonne">tonne</option>
            <option value="sac">sac</option>
            <option value="seau_petit">Seau (petit)</option>
            <option value="seau_grand">Seau (grand)</option>
            <option value="botte">botte</option>
            <option value="caisse">caisse</option>
            <option value="panier">panier</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Prix unitaire (GNF)</label>
          <input v-model="form.unitPrice" type="number" min="0" step="any" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
      </div>
      <p v-if="form.quantity && form.unitPrice" class="text-sm text-gray-600">
        Total : <span class="font-semibold text-farm-700">{{ formatCurrency(Number(form.quantity) * Number(form.unitPrice)) }}</span>
      </p>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Acheteur (optionnel)</label>
          <input v-model="form.buyer" type="text" placeholder="Nom de l'acheteur"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
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
        <button type="submit" class="px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700">
          {{ editing ? 'Enregistrer' : 'Ajouter' }}
        </button>
        <button v-if="editing" type="button" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm" @click="cancelEdit">Annuler</button>
      </div>
    </form>

    <!-- List -->
    <div v-if="loading" class="text-center py-8 text-gray-400">Chargement...</div>
    <div v-else class="space-y-3">
      <div v-for="v in ventesList" :key="v.id" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 truncate">{{ v.label }}</p>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ v.quantity }} {{ formatUnit(v.unit) }} &times; {{ formatCurrency(v.unitPrice) }}
              <span v-if="v.buyer"> &middot; {{ v.buyer }}</span>
            </p>
            <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(v.date) }}<span v-if="v.siteName"> &middot; {{ v.siteName }}</span></p>
          </div>
          <p class="text-sm font-semibold text-farm-600 ml-3">+{{ formatCurrency(v.totalAmount) }}</p>
        </div>
        <div class="flex gap-2 mt-3 pt-3 border-t border-gray-50">
          <button class="text-xs text-farm-600 hover:underline" @click="startEdit(v)">Modifier</button>
          <button v-if="isAdmin" class="text-xs text-red-500 hover:underline" @click="confirmDelete(v)">Supprimer</button>
        </div>
      </div>
      <p v-if="ventesList.length === 0" class="text-center py-8 text-gray-400">Aucune vente</p>
    </div>

    <ConfirmModal
      :show="!!deleting"
      title="Supprimer la vente"
      :message="`Voulez-vous vraiment supprimer ${deleting?.label} ?`"
      @confirm="deleteVente"
      @cancel="deleting = null"
    />
  </div>
</template>

<script setup lang="ts">
const { $authFetch, isAdmin } = useAuth()

const ventesList = ref<any[]>([])
const recoltesList = ref<any[]>([])
const sites = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const showForm = ref(false)
const editing = ref<number | null>(null)
const deleting = ref<any>(null)
const form = reactive({ recolteId: '', quantity: '', unit: 'kg', unitPrice: '', buyer: '', date: new Date().toISOString().split('T')[0], siteId: '', note: '' })

function onRecolteChange() {
  const recolte = recoltesList.value.find((r: any) => r.id === Number(form.recolteId))
  if (recolte) {
    form.unit = recolte.unit
  }
}

function getLabelFromRecolte(recolteId: number | string): string {
  const recolte = recoltesList.value.find((r: any) => r.id === Number(recolteId))
  return recolte ? `Vente de ${recolte.cultureName}` : ''
}

async function fetchData() {
  loading.value = true
  try {
    const [v, s, r] = await Promise.all([
      $authFetch<any[]>('/api/ventes'),
      isAdmin.value ? $authFetch<any[]>('/api/sites') : Promise.resolve([]),
      $authFetch<any[]>('/api/recoltes'),
    ])
    ventesList.value = v
    sites.value = s
    recoltesList.value = r
  } finally { loading.value = false }
}

function startEdit(v: any) {
  editing.value = v.id
  form.recolteId = v.recolteId ? String(v.recolteId) : ''
  form.quantity = v.quantity
  form.unit = v.unit
  form.unitPrice = v.unitPrice
  form.buyer = v.buyer || ''
  form.date = v.date
  form.siteId = v.siteId ? String(v.siteId) : ''
  form.note = v.note || ''
  showForm.value = true
}

function cancelEdit() {
  editing.value = null
  Object.assign(form, { recolteId: '', quantity: '', unit: 'kg', unitPrice: '', buyer: '', date: new Date().toISOString().split('T')[0], siteId: '', note: '' })
}

async function handleSubmit() {
  error.value = ''
  try {
    const label = getLabelFromRecolte(form.recolteId)
    const body = {
      ...form,
      label,
      recolteId: Number(form.recolteId),
      siteId: form.siteId ? Number(form.siteId) : null,
    }
    if (editing.value) {
      await $authFetch(`/api/ventes/${editing.value}`, { method: 'PUT', body })
    } else {
      await $authFetch('/api/ventes', { method: 'POST', body })
    }
    cancelEdit()
    showForm.value = false
    await fetchData()
  } catch (e: any) { error.value = e.data?.message || e.statusMessage || 'Erreur' }
}

function confirmDelete(v: any) {
  deleting.value = v
}

async function deleteVente() {
  if (!deleting.value) return
  await $authFetch(`/api/ventes/${deleting.value.id}`, { method: 'DELETE' })
  deleting.value = null
  await fetchData()
}

const unitLabels: Record<string, string> = {
  kg: 'kg', tonne: 'tonne', sac: 'sac',
  seau_petit: 'Seau (petit)', seau_grand: 'Seau (grand)',
  botte: 'botte', caisse: 'caisse', panier: 'panier',
}
function formatUnit(u: string) { return unitLabels[u] || u }

onMounted(fetchData)
</script>
