<template>
  <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <p class="font-medium text-gray-900 truncate">{{ transaction.label }}</p>
        <p class="text-xs text-gray-500 mt-0.5">
          {{ transaction.category }} &middot; {{ formatDate(transaction.date) }}
        </p>
        <p v-if="transaction.siteName" class="text-xs text-blue-500 mt-0.5">
          {{ transaction.siteName }}
        </p>
        <p v-if="transaction.note" class="text-xs text-gray-400 mt-1 truncate">
          {{ transaction.note }}
        </p>
      </div>
      <p
        class="text-sm font-semibold ml-3 whitespace-nowrap"
        :class="transaction.type === 'income' ? 'text-farm-600' : 'text-red-600'"
      >
        {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
      </p>
    </div>

    <div v-if="showActions" class="flex gap-2 mt-3 pt-3 border-t border-gray-50">
      <NuxtLink
        :to="`/transactions/${transaction.id}/modifier`"
        class="text-xs text-farm-600 hover:underline"
      >
        Modifier
      </NuxtLink>
      <button
        class="text-xs text-red-500 hover:underline"
        @click="$emit('delete', transaction.id)"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  transaction: any
  showActions?: boolean
}>()

defineEmits<{
  delete: [id: number]
}>()
</script>
