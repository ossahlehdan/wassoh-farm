<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Paramètres</h1>

    <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-800 mb-1">Réinitialiser le projet</h2>
      <p class="text-sm text-gray-500 mb-4">
        Supprime toutes les données (sites, utilisateurs, cultures, ventes, dépenses, intrants, etc.)
        et redirige vers la page de configuration initiale.
      </p>
      <button
        class="px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        @click="showConfirm = true"
      >
        Réinitialiser tout le projet
      </button>
      <p v-if="error" class="text-sm text-red-500 mt-3">{{ error }}</p>
    </div>

    <!-- Modal de confirmation renforcée -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div class="fixed inset-0 bg-black/40" @click="showConfirm = false" />
          <div class="relative bg-white rounded-xl shadow-lg p-5 w-full max-w-sm space-y-4">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Icon name="lucide:triangle-alert" size="20" class="text-red-600" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900">Réinitialisation complète</h3>
                <p class="text-sm text-red-600 mt-0.5">Toutes les données seront définitivement supprimées.</p>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">
                Tapez <span class="font-mono font-bold text-red-600">REINITIALISER</span> pour confirmer
              </label>
              <input
                v-model="confirmText"
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="REINITIALISER"
              />
            </div>
            <div class="flex gap-2 pt-1">
              <button
                type="button"
                class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                @click="showConfirm = false; confirmText = ''"
              >
                Annuler
              </button>
              <button
                type="button"
                :disabled="confirmText !== 'REINITIALISER' || resetting"
                class="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                @click="resetProject"
              >
                {{ resetting ? 'Suppression...' : 'Confirmer' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { $authFetch, isAdmin, logout } = useAuth()

if (!isAdmin.value) {
  navigateTo('/')
}

const showConfirm = ref(false)
const confirmText = ref('')
const resetting = ref(false)
const error = ref('')

async function resetProject() {
  resetting.value = true
  error.value = ''
  try {
    await $authFetch('/api/admin/reset', { method: 'POST' })
    logout()
    navigateTo('/setup')
  } catch (e: any) {
    error.value = e.data?.statusMessage || e.data?.message || e.statusMessage || 'Erreur lors de la réinitialisation'
  } finally {
    resetting.value = false
    showConfirm.value = false
    confirmText.value = ''
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
