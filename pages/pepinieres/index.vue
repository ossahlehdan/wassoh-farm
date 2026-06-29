<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Pépinières</h1>
      <button class="flex items-center gap-2 px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700"
        @click="showForm = !showForm">
        <Icon name="lucide:plus" size="16" />
        {{ showForm ? 'Fermer' : 'Nouvelle pépinière' }}
      </button>
    </div>

    <!-- Form ajout/édition -->
    <form v-if="showForm" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="handleSubmit">
      <h2 class="text-sm font-semibold text-gray-700">{{ editing ? 'Modifier' : 'Nouvelle pépinière' }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Variété</label>
          <input v-model="form.name" type="text" required placeholder="Ex: Riz NERICA, Tomate Roma..."
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Site</label>
          <select v-model="form.siteId" required :disabled="isEmployee"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500 disabled:bg-gray-100 disabled:text-gray-500">
            <option value="" disabled>Choisir un site...</option>
            <option v-for="s in sites" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Boîtes semées</label>
          <input v-model="form.boxesSown" type="number" min="1" required placeholder="Nombre"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Boîtes viables</label>
          <input v-model="form.boxesViable" type="number" min="0" placeholder="Après germination"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Date de semis</label>
          <input v-model="form.sowDate" type="date" required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Statut</label>
        <select v-model="form.status"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
          <option value="en_cours">En cours</option>
          <option value="prete">Prête</option>
          <option value="transplantee">Transplantée</option>
          <option value="perdue">Perdue</option>
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

    <!-- Modal transplantation -->
    <div v-if="transplanting" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <form class="bg-white rounded-xl shadow-lg p-5 w-full max-w-sm space-y-3" @submit.prevent="confirmTransplant">
        <h2 class="text-lg font-semibold text-gray-800">Transplanter</h2>
        <p class="text-sm text-gray-500">{{ transplanting.name }}</p>
        <div class="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
          <span class="font-semibold">{{ remainingBoxes(transplanting) }}</span> boîtes disponibles
          sur {{ totalBoxes(transplanting) }}
          <span v-if="transplanting.boxesTransplanted > 0"> ({{ transplanting.boxesTransplanted }} déjà transplantées)</span>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Boîtes à transplanter</label>
          <input v-model="transplantForm.boxes" type="number" min="1" :max="remainingBoxes(transplanting)" required placeholder="Nombre de boîtes"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Parcelle de destination</label>
          <select v-model="transplantForm.siteId" required :disabled="isEmployee"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500 disabled:bg-gray-100 disabled:text-gray-500">
            <option value="" disabled>Choisir un site...</option>
            <option v-for="s in sites" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Superficie</label>
            <input v-model="transplantForm.area" type="number" min="0" step="0.01" placeholder="Superficie"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Unité</label>
            <select v-model="transplantForm.areaUnit"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-500">
              <option value="ha">ha</option>
              <option value="m2">m²</option>
              <option value="acre">acre</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Date</label>
            <input v-model="transplantForm.startDate" type="date" required
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500" />
          </div>
        </div>
        <textarea v-model="transplantForm.note" rows="2" placeholder="Note (optionnel)"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-farm-500" />
        <p v-if="transplantError" class="text-sm text-red-500">{{ transplantError }}</p>
        <div class="flex gap-2">
          <button type="submit" class="flex-1 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700">Transplanter</button>
          <button type="button" class="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm" @click="transplanting = null">Annuler</button>
        </div>
      </form>
    </div>

    <!-- List -->
    <div v-if="loading" class="text-center py-8 text-gray-400">Chargement...</div>
    <div v-else class="space-y-3">
      <div v-for="p in pepinieresList" :key="p.id" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <p class="font-medium text-gray-900">{{ p.name }}</p>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="statusClass(p.status)">
                {{ statusLabel(p.status) }}
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ p.siteName }} &middot; Semis {{ formatDate(p.sowDate) }}</p>
            <div class="flex items-center gap-3 mt-1">
              <p class="text-xs text-gray-600">
                <span class="font-medium">{{ p.boxesSown }}</span> boîtes semées
              </p>
              <p v-if="p.boxesViable != null" class="text-xs text-farm-600">
                <span class="font-medium">{{ p.boxesViable }}</span> viables
                <span class="text-gray-400">({{ viabilityRate(p) }}%)</span>
              </p>
            </div>
            <p v-if="p.boxesTransplanted > 0" class="text-xs text-blue-600 mt-0.5">
              <span class="font-medium">{{ p.boxesTransplanted }}</span> transplantées
              <span v-if="remainingBoxes(p) > 0" class="text-gray-400">({{ remainingBoxes(p) }} restantes)</span>
            </p>
            <p v-if="p.note" class="text-xs text-gray-400 mt-1 truncate">{{ p.note }}</p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <div class="flex items-center gap-3">
              <button class="text-xs text-farm-600 hover:underline" @click="startEdit(p)">Modifier</button>
              <button v-if="isAdmin" class="text-xs text-red-500 hover:underline" @click="confirmDelete(p)">Supprimer</button>
            </div>
            <button
              v-if="p.status !== 'perdue' && remainingBoxes(p) > 0"
              class="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              @click="startTransplant(p)"
            >
              Transplanter
            </button>
          </div>
        </div>
      </div>
      <p v-if="pepinieresList.length === 0" class="text-center py-8 text-gray-400">Aucune pépinière</p>
    </div>

    <ConfirmModal
      :show="!!deleting"
      title="Supprimer la pépinière"
      :message="`Voulez-vous vraiment supprimer ${deleting?.name} ?`"
      @confirm="deletePepiniere"
      @cancel="deleting = null"
    />
  </div>
</template>

<script setup lang="ts">
const { $authFetch, isAdmin, isEmployee, user } = useAuth()
const router = useRouter()

const pepinieresList = ref<any[]>([])
const sites = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const showForm = ref(false)
const editing = ref<number | null>(null)
const deleting = ref<any>(null)
const form = reactive({
  name: '', siteId: '', boxesSown: '', boxesViable: '',
  sowDate: new Date().toISOString().split('T')[0], status: 'en_cours', note: '',
})

const transplanting = ref<any>(null)
const transplantError = ref('')
const transplantForm = reactive({
  boxes: '', siteId: '', area: '', areaUnit: 'ha',
  startDate: new Date().toISOString().split('T')[0], note: '',
})

function totalBoxes(p: any) {
  return p.boxesViable ?? p.boxesSown
}

function remainingBoxes(p: any) {
  return totalBoxes(p) - (p.boxesTransplanted || 0)
}

function statusLabel(s: string) {
  return { en_cours: 'En cours', prete: 'Prête', transplantee: 'Transplantée', perdue: 'Perdue' }[s] || s
}

function statusClass(s: string) {
  return {
    en_cours: 'bg-yellow-100 text-yellow-700',
    prete: 'bg-green-100 text-green-700',
    transplantee: 'bg-blue-100 text-blue-700',
    perdue: 'bg-red-100 text-red-600',
  }[s] || 'bg-gray-100 text-gray-500'
}

function viabilityRate(p: any) {
  if (!p.boxesViable || !p.boxesSown) return 0
  return Math.round((p.boxesViable / p.boxesSown) * 100)
}

function defaultSiteId() {
  return isEmployee.value && user.value?.siteId ? String(user.value.siteId) : ''
}

async function fetchData() {
  loading.value = true
  try {
    const [p, s] = await Promise.all([
      $authFetch<any[]>('/api/pepinieres'),
      $authFetch<any[]>('/api/sites'),
    ])
    pepinieresList.value = p
    sites.value = s
    if (!form.siteId) form.siteId = defaultSiteId()
  } finally { loading.value = false }
}

function startEdit(p: any) {
  editing.value = p.id
  form.name = p.name
  form.siteId = String(p.siteId)
  form.boxesSown = String(p.boxesSown)
  form.boxesViable = p.boxesViable != null ? String(p.boxesViable) : ''
  form.sowDate = p.sowDate
  form.status = p.status
  form.note = p.note || ''
  showForm.value = true
}

function cancelEdit() {
  editing.value = null
  Object.assign(form, {
    name: '', siteId: defaultSiteId(), boxesSown: '', boxesViable: '',
    sowDate: new Date().toISOString().split('T')[0], status: 'en_cours', note: '',
  })
}

async function handleSubmit() {
  error.value = ''
  try {
    const body = {
      ...form,
      siteId: Number(form.siteId),
      boxesSown: Number(form.boxesSown),
      boxesViable: form.boxesViable ? Number(form.boxesViable) : null,
    }
    if (editing.value) {
      await $authFetch(`/api/pepinieres/${editing.value}`, { method: 'PUT', body })
    } else {
      await $authFetch('/api/pepinieres', { method: 'POST', body })
    }
    cancelEdit()
    showForm.value = false
    await fetchData()
  } catch (e: any) { error.value = e.data?.message || e.statusMessage || 'Erreur' }
}

function confirmDelete(p: any) {
  deleting.value = p
}

async function deletePepiniere() {
  if (!deleting.value) return
  await $authFetch(`/api/pepinieres/${deleting.value.id}`, { method: 'DELETE' })
  deleting.value = null
  await fetchData()
}

function startTransplant(p: any) {
  transplanting.value = p
  transplantForm.boxes = String(remainingBoxes(p))
  transplantForm.siteId = defaultSiteId() || String(p.siteId)
  transplantForm.area = ''
  transplantForm.areaUnit = 'ha'
  transplantForm.startDate = new Date().toISOString().split('T')[0]
  transplantForm.note = ''
  transplantError.value = ''
}

async function confirmTransplant() {
  transplantError.value = ''
  const siteId = transplantForm.siteId ? Number(transplantForm.siteId) : null
  if (!siteId) {
    transplantError.value = 'Veuillez choisir un site de destination'
    return
  }
  const boxes = Number(transplantForm.boxes)
  if (!boxes || boxes <= 0) {
    transplantError.value = 'Veuillez indiquer le nombre de boîtes'
    return
  }
  if (!transplantForm.startDate) {
    transplantError.value = 'Veuillez indiquer une date'
    return
  }
  try {
    await $authFetch(`/api/pepinieres/${transplanting.value.id}/transplant`, {
      method: 'POST',
      body: {
        siteId,
        boxes,
        area: transplantForm.area ? Number(transplantForm.area) : null,
        areaUnit: transplantForm.areaUnit,
        startDate: transplantForm.startDate,
        note: transplantForm.note,
      },
    })
    transplanting.value = null
    await fetchData()
  } catch (e: any) {
    transplantError.value = e.data?.message || e.statusMessage || 'Erreur lors de la transplantation'
  }
}

onMounted(fetchData)
</script>
