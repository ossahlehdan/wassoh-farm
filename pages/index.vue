<template>
  <div>
    <h1 class="text-2xl font-bold text-farm-800 mb-6">Tableau de bord</h1>

    <div v-if="loading" class="text-center py-12 text-gray-400">
      Chargement...
    </div>

    <template v-else-if="stats">
      <!-- Summary cards -->
      <div class="grid grid-cols-1 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p class="text-sm text-gray-500 mb-1">Solde</p>
          <p
            class="text-2xl font-bold"
            :class="stats.balance >= 0 ? 'text-farm-600' : 'text-red-600'"
          >
            {{ formatCurrency(stats.balance) }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">Revenus</p>
            <p class="text-lg font-semibold text-farm-600">
              {{ formatCurrency(stats.totalIncome) }}
            </p>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">Dépenses</p>
            <p class="text-lg font-semibold text-red-600">
              {{ formatCurrency(stats.totalExpense) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Recent transactions -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-800">Dernières transactions</h2>
          <NuxtLink to="/transactions" class="text-sm text-farm-600 hover:underline">
            Voir tout
          </NuxtLink>
        </div>

        <div v-if="stats.recentTransactions.length === 0" class="text-center py-8 text-gray-400">
          Aucune transaction pour le moment
        </div>

        <div class="space-y-3">
          <TransactionCard
            v-for="t in stats.recentTransactions"
            :key="t.id"
            :transaction="t"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { stats, loading, fetchStats } = useDashboard()

onMounted(() => {
  fetchStats()
})
</script>
