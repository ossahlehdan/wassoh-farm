<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toastVisible"
        class="fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 bg-farm-600 text-white rounded-lg shadow-lg text-sm font-medium flex items-center gap-2">
        <Icon name="lucide:check-circle" size="16" />
        {{ toastMessage }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { toastMessage, toastVisible } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>
