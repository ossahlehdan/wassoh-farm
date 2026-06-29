<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Récoltes</h1>
      <button class="flex items-center gap-2 px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700"
        @click="showForm = !showForm">
        <Icon name="lucide:plus" size="16" />
        {{ showForm ? 'Fermer' : 'Nouvelle récolte' }}
      </button>
    </div>

    <!-- Form -->
    <form v-if="showForm" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="handleSubmit">
      <h2 class="text-sm font-semibold text-gray-700">{{ editing ? 'Modifier' : 'Nouvelle récolte' }}</h2>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Culture</label>
        <select v-model="form.cultureId" required
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
          <option value="" disabled>Choisir une culture...</option>
          <option v-for="c in culturesEnCours" :key="c.id" :value="c.id">{{ c.name }} ({{ c.siteName }})</option>
        </select>
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
            <option value="seau_petit">Seau (petit)</option>
            <option value="seau_grand">Seau (grand)</option>
            <option value="botte">botte</option>
            <option value="caisse">caisse</option>
            <option value="panier">panier</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Date</label>
          <input v-model="form.date" type="date" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Qualité</label>
        <select v-model="form.quality"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
          <option value="">Non spécifiée</option>
          <option value="bonne">Bonne</option>
          <option value="moyenne">Moyenne</option>
          <option value="mauvaise">Mauvaise</option>
        </select>
      </div>
      <textarea v-model="form.note" rows="2" placeholder="Note (optionnel)"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-farm-500" />
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <div class="flex gap-2">
        <button type="submit" :disabled="submitting" class="px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700 disabled:opacity-50">
          {{ submitting ? 'Envoi...' : editing ? 'Enregistrer' : 'Ajouter' }}
        </button>
        <button v-if="editing" type="button" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm" @click="cancelEdit">Annuler</button>
      </div>
    </form>

    <!-- List -->
    <div v-if="loading" class="text-center py-8 text-gray-400">Chargement...</div>
    <div v-else class="space-y-3">
      <div v-for="r in recoltesList" :key="r.id" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-start justify-between">
          <div>
            <p class="font-medium text-gray-900">{{ r.cultureName }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ r.siteName }} &middot; {{ formatDate(r.date) }}</p>
            <p v-if="r.quality" class="text-xs mt-0.5"
              :class="{ 'text-green-600': r.quality === 'bonne', 'text-yellow-600': r.quality === 'moyenne', 'text-red-500': r.quality === 'mauvaise' }">
              Qualité : {{ r.quality }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-farm-700">{{ r.quantity }} {{ formatUnit(r.unit) }}</p>
            <div class="flex gap-2 mt-2">
              <button class="text-xs text-farm-600 hover:underline" @click="startEdit(r)">Modifier</button>
              <button v-if="isAdmin" class="text-xs text-red-500 hover:underline" @click="confirmDelete(r)">Supprimer</button>
            </div>
          </div>
        </div>
      </div>
      <p v-if="recoltesList.length === 0" class="text-center py-8 text-gray-400">Aucune récolte</p>
    </div>

    <ConfirmModal
      :show="!!deleting"
      title="Supprimer la récolte"
      :message="`Voulez-vous vraiment supprimer cette récolte de ${deleting?.cultureName} ?`"
      @confirm="deleteRecolte"
      @cancel="deleting = null"
    />
  </div>
</template>

<script setup lang="ts">
import { formatUnit } from '~/utils/units'

const { $authFetch, isAdmin } = useAuth()
const { showSuccess } = useToast()

const recoltesList = ref<any[]>([])
const culturesList = ref<any[]>([])
const culturesEnCours = computed(() => culturesList.value.filter((c: any) => c.status === 'en_cours'))
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const showForm = ref(false)
const editing = ref<number | null>(null)
const deleting = ref<any>(null)
const form = reactive({ cultureId: '', quantity: '', unit: 'kg', quality: '', date: new Date().toISOString().split('T')[0], note: '' })

async function fetchData() {
  loading.value = true
  try {
    const [r, c] = await Promise.all([
      $authFetch<any[]>('/api/recoltes'),
      $authFetch<any[]>('/api/cultures'),
    ])
    recoltesList.value = r
    culturesList.value = c
  } finally { loading.value = false }
}

function startEdit(r: any) {
  editing.value = r.id
  form.cultureId = String(r.cultureId)
  form.quantity = r.quantity
  form.unit = r.unit
  form.quality = r.quality || ''
  form.date = r.date
  form.note = r.note || ''
  showForm.value = true
}

function cancelEdit() {
  editing.value = null
  Object.assign(form, { cultureId: '', quantity: '', unit: 'kg', quality: '', date: new Date().toISOString().split('T')[0], note: '' })
}

async function handleSubmit() {
  error.value = ''
  submitting.value = true
  try {
    const body = { ...form, cultureId: Number(form.cultureId) }
    if (editing.value) {
      await $authFetch(`/api/recoltes/${editing.value}`, { method: 'PUT', body })
      showSuccess('Récolte modifiée')
    } else {
      await $authFetch('/api/recoltes', { method: 'POST', body })
      showSuccess('Récolte enregistrée')
    }
    cancelEdit()
    showForm.value = false
    await fetchData()
  } catch (e: any) { error.value = e.data?.message || e.statusMessage || 'Erreur' }
  finally { submitting.value = false }
}

function confirmDelete(r: any) {
  deleting.value = r
}

async function deleteRecolte() {
  if (!deleting.value) return
  await $authFetch(`/api/recoltes/${deleting.value.id}`, { method: 'DELETE' })
  deleting.value = null
  await fetchData()
}

onMounted(fetchData)
</script>
