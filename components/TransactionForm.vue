<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <!-- Site (admin only) -->
    <div v-if="isAdmin">
      <label for="siteId" class="block text-sm font-medium text-gray-700 mb-1">Site</label>
      <select
        id="siteId"
        v-model="form.siteId"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white"
      >
        <option value="">Aucun site</option>
        <option v-for="s in sites" :key="s.id" :value="s.id">{{ s.name }}</option>
      </select>
    </div>

    <!-- Type -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
      <div class="flex gap-2">
        <button
          type="button"
          class="flex-1 py-2 rounded-lg text-sm font-medium border transition-colors"
          :class="
            form.type === 'income'
              ? 'bg-farm-600 text-white border-farm-600'
              : 'bg-white text-gray-600 border-gray-200'
          "
          @click="setType('income')"
        >
          Revenu
        </button>
        <button
          type="button"
          class="flex-1 py-2 rounded-lg text-sm font-medium border transition-colors"
          :class="
            form.type === 'expense'
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white text-gray-600 border-gray-200'
          "
          @click="setType('expense')"
        >
          Dépense
        </button>
      </div>
    </div>

    <!-- Amount -->
    <div>
      <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
        Montant (GNF)
      </label>
      <input
        id="amount"
        v-model="form.amount"
        type="number"
        min="0"
        step="any"
        required
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500 focus:border-transparent"
        placeholder="Ex: 500000"
      />
      <p v-if="errors.amount" class="text-xs text-red-500 mt-1">{{ errors.amount }}</p>
    </div>

    <!-- Label -->
    <div>
      <label for="label" class="block text-sm font-medium text-gray-700 mb-1">
        Libellé
      </label>
      <input
        id="label"
        v-model="form.label"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500 focus:border-transparent"
        placeholder="Ex: Vente de riz"
      />
      <p v-if="errors.label" class="text-xs text-red-500 mt-1">{{ errors.label }}</p>
    </div>

    <!-- Category -->
    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
        Catégorie
      </label>
      <select
        id="category"
        v-model="form.category"
        required
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500 focus:border-transparent bg-white"
      >
        <option value="" disabled>Choisir une catégorie</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <p v-if="errors.category" class="text-xs text-red-500 mt-1">{{ errors.category }}</p>
    </div>

    <!-- Date -->
    <div>
      <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
      <input
        id="date"
        v-model="form.date"
        type="date"
        required
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500 focus:border-transparent"
      />
      <p v-if="errors.date" class="text-xs text-red-500 mt-1">{{ errors.date }}</p>
    </div>

    <!-- Note -->
    <div>
      <label for="note" class="block text-sm font-medium text-gray-700 mb-1">
        Note (optionnel)
      </label>
      <textarea
        id="note"
        v-model="form.note"
        rows="2"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500 focus:border-transparent resize-none"
        placeholder="Détails supplémentaires..."
      />
    </div>

    <p v-if="errors._form" class="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{{ errors._form }}</p>

    <!-- Submit -->
    <button
      type="submit"
      :disabled="submitting"
      class="w-full py-3 bg-farm-600 hover:bg-farm-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
    >
      {{ submitting ? 'Enregistrement...' : (initialData ? 'Modifier' : 'Enregistrer') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import type { TransactionFormData } from '~/utils/schemas'
import { transactionSchema } from '~/utils/schemas'
import { getCategoriesForType } from '~/utils/categories'

const props = defineProps<{
  initialData?: any
  onSubmit: (data: TransactionFormData & { siteId?: number }) => Promise<void>
}>()

const { isAdmin, $authFetch } = useAuth()

const submitting = ref(false)
const errors = ref<Record<string, string>>({})
const sites = ref<any[]>([])

const form = reactive({
  type: props.initialData?.type ?? 'expense' as 'income' | 'expense',
  amount: props.initialData?.amount ?? '',
  label: props.initialData?.label ?? '',
  category: props.initialData?.category ?? '',
  note: props.initialData?.note ?? '',
  date: props.initialData?.date ?? new Date().toISOString().split('T')[0],
  siteId: props.initialData?.siteId ?? '',
})

const categories = computed(() => getCategoriesForType(form.type))

function setType(type: 'income' | 'expense') {
  form.type = type
  form.category = ''
}

async function handleSubmit() {
  errors.value = {}
  const result = transactionSchema.safeParse(form)

  if (!result.success) {
    const flat = result.error.flatten()
    for (const [key, msgs] of Object.entries(flat.fieldErrors)) {
      if (msgs?.length) errors.value[key] = msgs[0]
    }
    return
  }

  submitting.value = true
  try {
    await props.onSubmit({ ...result.data, siteId: form.siteId ? Number(form.siteId) : undefined })
  } catch (e: any) {
    errors.value._form = e.data?.message || e.statusMessage || 'Erreur lors de l\'enregistrement'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (isAdmin.value) {
    sites.value = await $authFetch<any[]>('/api/sites')
  }
})
</script>
