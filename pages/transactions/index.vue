<template>
  <div>
    <h1 class="text-2xl font-bold text-farm-800 mb-6">Transactions</h1>

    <!-- Filter -->
    <div class="flex gap-2 mb-4">
      <button
        v-for="f in filters"
        :key="f.value"
        class="px-3 py-1.5 text-sm rounded-full border transition-colors"
        :class="
          filter === f.value
            ? 'bg-farm-600 text-white border-farm-600'
            : 'bg-white text-gray-600 border-gray-200 hover:border-farm-300'
        "
        @click="filter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-400">
      Chargement...
    </div>

    <div v-else-if="filteredTransactions.length === 0" class="text-center py-12 text-gray-400">
      Aucune transaction
    </div>

    <div v-else class="space-y-3">
      <TransactionCard
        v-for="t in filteredTransactions"
        :key="t.id"
        :transaction="t"
        show-actions
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { transactions, loading, fetchTransactions, deleteTransaction } = useTransactions()

const filter = ref<'all' | 'income' | 'expense'>('all')
const filters = [
  { label: 'Tout', value: 'all' as const },
  { label: 'Revenus', value: 'income' as const },
  { label: 'Dépenses', value: 'expense' as const },
]

const filteredTransactions = computed(() => {
  if (filter.value === 'all') return transactions.value
  return transactions.value.filter((t) => t.type === filter.value)
})

async function handleDelete(id: number) {
  if (!confirm('Supprimer cette transaction ?')) return
  await deleteTransaction(id)
  await fetchTransactions()
}

onMounted(() => {
  fetchTransactions()
})
</script>
