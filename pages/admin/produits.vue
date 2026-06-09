<template>
  <div>
    <h1 class="text-2xl font-bold text-farm-800 mb-6">Produits</h1>

    <!-- Add form -->
    <form class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6 space-y-3" @submit.prevent="addProduct">
      <h2 class="text-sm font-semibold text-gray-700">Ajouter un produit</h2>
      <div class="grid grid-cols-2 gap-3">
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="Nom du produit"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
        />
        <input
          v-model="form.unit"
          type="text"
          required
          placeholder="Unité (kg, sac, litre...)"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-farm-500"
        />
      </div>
      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
      <button type="submit" class="px-4 py-2 bg-farm-600 text-white rounded-lg text-sm hover:bg-farm-700">
        Ajouter
      </button>
    </form>

    <!-- List -->
    <div v-if="loading" class="text-center py-8 text-gray-400">Chargement...</div>
    <div v-else class="space-y-3">
      <div
        v-for="p in products"
        :key="p.id"
        class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between"
      >
        <p class="font-medium text-gray-900">{{ p.name }}</p>
        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{{ p.unit }}</span>
      </div>
      <p v-if="products.length === 0" class="text-center py-8 text-gray-400">Aucun produit</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $authFetch, isAdmin } = useAuth()

if (!isAdmin.value) {
  navigateTo('/')
}
const products = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const form = reactive({ name: '', unit: '' })

async function fetchProducts() {
  loading.value = true
  try {
    products.value = await $authFetch('/api/products')
  } finally {
    loading.value = false
  }
}

async function addProduct() {
  error.value = ''
  try {
    await $authFetch('/api/products', { method: 'POST', body: form })
    form.name = ''
    form.unit = ''
    await fetchProducts()
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'Erreur'
  }
}

onMounted(fetchProducts)
</script>
