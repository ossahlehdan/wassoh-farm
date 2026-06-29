<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>

    <div v-if="loading" class="text-center py-12 text-gray-400">Chargement...</div>

    <template v-else-if="stats">
      <!-- Summary cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg bg-farm-50 flex items-center justify-center">
              <Icon name="lucide:wallet" size="20" class="text-farm-600" />
            </div>
            <p class="text-sm text-gray-500">Solde</p>
          </div>
          <p class="text-xl font-bold" :class="stats.balance >= 0 ? 'text-farm-600' : 'text-red-600'">
            {{ formatCurrency(stats.balance) }}
          </p>
        </div>

        <NuxtLink to="/ventes" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-farm-200 transition-colors">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Icon name="lucide:trending-up" size="20" class="text-green-600" />
            </div>
            <p class="text-sm text-gray-500">Ventes</p>
          </div>
          <p class="text-xl font-bold text-farm-600">{{ formatCurrency(stats.totalVentes) }}</p>
        </NuxtLink>

        <NuxtLink to="/depenses" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-red-200 transition-colors">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <Icon name="lucide:trending-down" size="20" class="text-red-600" />
            </div>
            <p class="text-sm text-gray-500">Dépenses</p>
          </div>
          <p class="text-xl font-bold text-red-600">{{ formatCurrency(stats.totalDepenses) }}</p>
        </NuxtLink>

        <NuxtLink to="/cultures" class="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-farm-200 transition-colors">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Icon name="lucide:sprout" size="20" class="text-yellow-600" />
            </div>
            <p class="text-sm text-gray-500">Cultures</p>
          </div>
          <p class="text-xl font-bold text-gray-900">{{ stats.culturesEnCours }} en cours</p>
        </NuxtLink>
      </div>

      <!-- Quick links -->
      <div class="grid grid-cols-3 gap-3 mb-8">
        <NuxtLink to="/recoltes" class="flex items-center gap-2 bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:border-farm-200 transition-colors">
          <Icon name="lucide:wheat" size="20" class="text-farm-600" />
          <span class="text-sm font-medium text-gray-700">Récoltes</span>
        </NuxtLink>
        <NuxtLink to="/pepinieres" class="flex items-center gap-2 bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:border-purple-200 transition-colors">
          <Icon name="lucide:flower-2" size="20" class="text-purple-600" />
          <span class="text-sm font-medium text-gray-700">Pépinières</span>
        </NuxtLink>
        <NuxtLink to="/intrants" class="flex items-center gap-2 bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:border-blue-200 transition-colors">
          <Icon name="lucide:package" size="20" class="text-blue-600" />
          <span class="text-sm font-medium text-gray-700">Intrants</span>
        </NuxtLink>
      </div>

      <!-- Site breakdown (admin) -->
      <div v-if="stats.siteStats && stats.siteStats.length > 0" class="mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">Résumé par site</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="site in stats.siteStats" :key="site.id" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p class="font-medium text-gray-900 mb-2">{{ site.name }}</p>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div>
                <p class="text-xs text-gray-500">Ventes</p>
                <p class="text-sm font-semibold text-farm-600">{{ formatCurrency(site.ventes) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Dépenses</p>
                <p class="text-sm font-semibold text-red-600">{{ formatCurrency(site.depenses) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Solde</p>
                <p class="text-sm font-semibold" :class="site.balance >= 0 ? 'text-farm-600' : 'text-red-600'">{{ formatCurrency(site.balance) }}</p>
              </div>
            </div>
            <p v-if="site.cultures > 0" class="text-xs text-gray-400 mt-2">{{ site.cultures }} culture(s) en cours</p>
          </div>
        </div>
      </div>

      <!-- Recent activity -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-800">Activité récente</h2>
        </div>

        <div v-if="stats.recentActivity.length === 0" class="text-center py-8 text-gray-400">
          Aucune activité pour le moment
        </div>

        <div v-else class="divide-y divide-gray-50">
          <NuxtLink
            v-for="a in stats.recentActivity"
            :key="`${a.type}-${a.id}`"
            :to="a.type === 'vente' ? '/ventes' : '/depenses'"
            class="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
          >
            <div class="min-w-0 flex-1">
              <p class="font-medium text-gray-900 truncate">{{ a.label }}</p>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ a.type === 'vente' ? 'Vente' : a.category || 'Dépense' }} &middot; {{ formatDate(a.date) }}
              </p>
            </div>
            <p class="text-sm font-semibold ml-4 whitespace-nowrap"
              :class="a.type === 'vente' ? 'text-farm-600' : 'text-red-600'">
              {{ a.type === 'vente' ? '+' : '-' }}{{ formatCurrency(a.amount) }}
            </p>
          </NuxtLink>
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
