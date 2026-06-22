<template>
  <div class="min-h-screen bg-gray-50 lg:flex">
    <!-- Sidebar (desktop) -->
    <aside class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-farm-800 text-white">
      <div class="px-6 py-5 border-b border-farm-700">
        <NuxtLink to="/" class="text-xl font-bold tracking-tight">Wassoh Farm</NuxtLink>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.to) ? 'bg-farm-600 text-white' : 'text-farm-200 hover:bg-farm-700 hover:text-white'">
          <Icon :name="item.icon" size="20" />
          {{ item.label }}
        </NuxtLink>

        <p class="px-3 pt-5 pb-2 text-xs font-semibold text-farm-400 uppercase tracking-wider">Intrants</p>
        <NuxtLink v-for="item in intrantItems" :key="item.to" :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.to) ? 'bg-farm-600 text-white' : 'text-farm-200 hover:bg-farm-700 hover:text-white'">
          <Icon :name="item.icon" size="20" />
          {{ item.label }}
        </NuxtLink>

        <template v-if="isAdmin">
          <p class="px-3 pt-5 pb-2 text-xs font-semibold text-farm-400 uppercase tracking-wider">Administration</p>
          <NuxtLink v-for="item in adminItems" :key="item.to" :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="isActive(item.to) ? 'bg-farm-600 text-white' : 'text-farm-200 hover:bg-farm-700 hover:text-white'">
            <Icon :name="item.icon" size="20" />
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>

      <div class="px-4 py-4 border-t border-farm-700">
        <div class="flex items-center justify-between">
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ user?.name }}</p>
            <p class="text-xs text-farm-300 truncate">{{ user?.role === 'admin' ? 'Administrateur' : 'Employé' }}</p>
          </div>
          <button class="p-2 rounded-lg text-farm-300 hover:text-white hover:bg-farm-700 transition-colors"
            title="Déconnexion" @click="logout">
            <Icon name="lucide:log-out" size="18" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile drawer overlay -->
    <Transition name="fade">
      <div v-if="drawerOpen" class="lg:hidden fixed inset-0 bg-black/40 z-50" @click="drawerOpen = false" />
    </Transition>

    <!-- Mobile drawer -->
    <Transition name="slide">
      <aside v-if="drawerOpen" class="lg:hidden fixed inset-y-0 left-0 w-72 bg-farm-800 text-white z-50 flex flex-col">
        <div class="flex items-center justify-between px-5 py-4 border-b border-farm-700">
          <span class="text-lg font-bold">Wassoh Farm</span>
          <button class="p-1.5 rounded-lg text-farm-300 hover:text-white" @click="drawerOpen = false">
            <Icon name="lucide:x" size="20" />
          </button>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="isActive(item.to) ? 'bg-farm-600 text-white' : 'text-farm-200 hover:bg-farm-700 hover:text-white'"
            @click="drawerOpen = false">
            <Icon :name="item.icon" size="20" />
            {{ item.label }}
          </NuxtLink>

          <p class="px-3 pt-5 pb-2 text-xs font-semibold text-farm-400 uppercase tracking-wider">Intrants</p>
          <NuxtLink v-for="item in intrantItems" :key="item.to" :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="isActive(item.to) ? 'bg-farm-600 text-white' : 'text-farm-200 hover:bg-farm-700 hover:text-white'"
            @click="drawerOpen = false">
            <Icon :name="item.icon" size="20" />
            {{ item.label }}
          </NuxtLink>

          <template v-if="isAdmin">
            <p class="px-3 pt-5 pb-2 text-xs font-semibold text-farm-400 uppercase tracking-wider">Administration</p>
            <NuxtLink v-for="item in adminItems" :key="item.to" :to="item.to"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="isActive(item.to) ? 'bg-farm-600 text-white' : 'text-farm-200 hover:bg-farm-700 hover:text-white'"
              @click="drawerOpen = false">
              <Icon :name="item.icon" size="20" />
              {{ item.label }}
            </NuxtLink>
          </template>
        </nav>

        <div class="px-4 py-4 border-t border-farm-700">
          <div class="flex items-center justify-between">
            <div class="min-w-0">
              <p class="text-sm font-medium truncate">{{ user?.name }}</p>
              <p class="text-xs text-farm-300 truncate">{{ user?.role === 'admin' ? 'Administrateur' : 'Employé' }}</p>
            </div>
            <button class="p-2 rounded-lg text-farm-300 hover:text-white hover:bg-farm-700 transition-colors"
              title="Déconnexion" @click="logout">
              <Icon name="lucide:log-out" size="18" />
            </button>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Main content -->
    <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
      <!-- Top bar (mobile) -->
      <header class="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div class="flex items-center justify-between px-4 py-3">
          <button class="p-1.5 -ml-1.5 rounded-lg text-gray-600 hover:bg-gray-100" @click="drawerOpen = true">
            <Icon name="lucide:menu" size="22" />
          </button>
          <NuxtLink to="/" class="text-lg font-bold text-farm-700">Wassoh Farm</NuxtLink>
          <button class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition-colors" @click="logout">
            <Icon name="lucide:log-out" size="18" />
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
        <slot />
      </main>
    </div>

    <!-- Bottom nav (mobile) -->
    <nav class="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40 safe-bottom">
      <div class="flex items-center justify-around py-2">
        <NuxtLink v-for="item in mobileNav" :key="item.to" :to="item.to"
          class="flex flex-col items-center gap-0.5 px-2 py-1 min-w-0"
          :class="isActive(item.to) ? 'text-farm-600' : 'text-gray-400'">
          <Icon :name="item.icon" size="22" />
          <span class="text-[10px] font-medium truncate">{{ item.label }}</span>
        </NuxtLink>
        <button class="flex flex-col items-center gap-0.5 px-2 py-1 min-w-0 text-gray-400"
          @click="drawerOpen = true">
          <Icon name="lucide:menu" size="22" />
          <span class="text-[10px] font-medium">Plus</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { user, isAdmin, logout } = useAuth()
const route = useRoute()
const drawerOpen = ref(false)

const navItems = [
  { to: '/', label: 'Tableau de bord', icon: 'lucide:layout-dashboard' },
  { to: '/pepinieres', label: 'Pépinières', icon: 'lucide:flower-2' },
  { to: '/cultures', label: 'Cultures', icon: 'lucide:sprout' },
  { to: '/recoltes', label: 'Récoltes', icon: 'lucide:wheat' },
  { to: '/ventes', label: 'Ventes', icon: 'lucide:trending-up' },
  { to: '/depenses', label: 'Dépenses', icon: 'lucide:trending-down' },
]

const intrantItems = [
  { to: '/intrants', label: 'Inventaire', icon: 'lucide:package' },
  { to: '/intrants/achats', label: 'Achats', icon: 'lucide:shopping-cart' },
  { to: '/intrants/mouvements', label: 'Transferts', icon: 'lucide:arrow-left-right' },
]

const adminItems = [
  { to: '/admin/sites', label: 'Sites', icon: 'lucide:map-pin' },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: 'lucide:users' },
  { to: '/admin/parametres', label: 'Paramètres', icon: 'lucide:settings' },
]

const mobileNav = [
  { to: '/', label: 'Accueil', icon: 'lucide:layout-dashboard' },
  { to: '/cultures', label: 'Cultures', icon: 'lucide:sprout' },
  { to: '/ventes', label: 'Ventes', icon: 'lucide:trending-up' },
  { to: '/depenses', label: 'Dépenses', icon: 'lucide:trending-down' },
]

const exactMatchPaths = ['/', '/intrants']

function isActive(path: string) {
  if (exactMatchPaths.includes(path)) return route.path === path
  return route.path.startsWith(path)
}
</script>

<style scoped>
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
