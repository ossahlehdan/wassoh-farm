<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-farm-700 text-white shadow-md sticky top-0 z-50">
      <div class="max-w-lg mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-xl font-bold tracking-tight">
            Wassoh Farm
          </NuxtLink>
          <div class="flex items-center gap-3">
            <span class="text-xs opacity-70">{{ user?.name }}</span>
            <button
              class="text-xs opacity-70 hover:opacity-100 underline"
              @click="logout"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex gap-2 mt-3 overflow-x-auto pb-1 -mb-1">
          <NuxtLink
            to="/"
            class="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
            :class="isActive('/') ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'"
          >
            Accueil
          </NuxtLink>
          <NuxtLink
            to="/transactions"
            class="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
            :class="isActive('/transactions') ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'"
          >
            Transactions
          </NuxtLink>
          <NuxtLink
            to="/stock"
            class="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
            :class="isActive('/stock') ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'"
          >
            Stock
          </NuxtLink>
          <template v-if="isAdmin">
            <NuxtLink
              to="/stock/achats"
              class="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              :class="isActive('/stock/achats') ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'"
            >
              Achats
            </NuxtLink>
            <NuxtLink
              to="/stock/mouvements"
              class="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              :class="isActive('/stock/mouvements') ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'"
            >
              Transferts
            </NuxtLink>
            <NuxtLink
              to="/admin/sites"
              class="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              :class="isActive('/admin/sites') ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'"
            >
              Sites
            </NuxtLink>
            <NuxtLink
              to="/admin/utilisateurs"
              class="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              :class="isActive('/admin/utilisateurs') ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'"
            >
              Utilisateurs
            </NuxtLink>
            <NuxtLink
              to="/admin/produits"
              class="text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              :class="isActive('/admin/produits') ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'"
            >
              Produits
            </NuxtLink>
          </template>
        </nav>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-lg mx-auto px-4 py-6 pb-24">
      <slot />
    </main>

    <!-- Floating action button -->
    <NuxtLink
      to="/transactions/ajouter"
      class="fixed bottom-6 right-6 w-14 h-14 bg-farm-600 hover:bg-farm-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors z-50"
    >
      <Icon name="lucide:plus" size="28" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { user, isAdmin, logout } = useAuth()
const route = useRoute()

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
