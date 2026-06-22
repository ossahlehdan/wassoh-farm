<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center px-4" @click.self="$emit('cancel')">
        <div class="fixed inset-0 bg-black/40" />
        <div class="relative bg-white rounded-xl shadow-lg p-5 w-full max-w-sm space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Icon name="lucide:triangle-alert" size="20" class="text-red-600" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-gray-900">{{ title }}</h3>
              <p class="text-sm text-gray-500 mt-0.5">{{ message }}</p>
            </div>
          </div>
          <div class="flex gap-2 pt-1">
            <button
              type="button"
              class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              @click="$emit('cancel')"
            >
              Annuler
            </button>
            <button
              type="button"
              class="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              @click="$emit('confirm')"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmLabel?: string
}>(), {
  title: 'Confirmer la suppression',
  message: 'Cette action est irréversible.',
  confirmLabel: 'Supprimer',
})

defineEmits<{
  confirm: []
  cancel: []
}>()
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
