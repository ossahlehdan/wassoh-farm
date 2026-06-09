<template>
  <div>
    <h1 class="text-2xl font-bold text-farm-800 mb-6">Stock</h1>

    <div v-if="loading" class="text-center py-8 text-gray-400">Chargement...</div>

    <div v-else>
      <!-- Central stock -->
      <div v-if="centralStock.length > 0" class="mb-6">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Entrepôt central
        </h2>
        <div class="space-y-2">
          <div
            v-for="s in centralStock"
            :key="s.id"
            class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p class="font-medium text-gray-900">{{ s.productName }}</p>
            </div>
            <p class="text-sm font-semibold text-farm-700">
              {{ s.quantity }} {{ s.productUnit }}
            </p>
          </div>
        </div>
      </div>

      <!-- Stock by site -->
      <div v-for="siteName in siteNames" :key="siteName" class="mb-6">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          {{ siteName }}
        </h2>
        <div class="space-y-2">
          <div
            v-for="s in stockBySite(siteName)"
            :key="s.id"
            class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between"
          >
            <p class="font-medium text-gray-900">{{ s.productName }}</p>
            <p class="text-sm font-semibold text-farm-700">
              {{ s.quantity }} {{ s.productUnit }}
            </p>
          </div>
        </div>
      </div>

      <p v-if="stockItems.length === 0" class="text-center py-8 text-gray-400">
        Aucun stock enregistré
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $authFetch } = useAuth()
const stockItems = ref<any[]>([])
const loading = ref(false)

const centralStock = computed(() => stockItems.value.filter((s) => !s.siteId))
const siteStock = computed(() => stockItems.value.filter((s) => s.siteId))
const siteNames = computed(() => [...new Set(siteStock.value.map((s) => s.siteName))])

function stockBySite(siteName: string) {
  return siteStock.value.filter((s) => s.siteName === siteName)
}

onMounted(async () => {
  loading.value = true
  try {
    stockItems.value = await $authFetch('/api/stock')
  } finally {
    loading.value = false
  }
})
</script>
