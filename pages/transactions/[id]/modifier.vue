<template>
  <div>
    <h1 class="text-2xl font-bold text-farm-800 mb-6">Modifier la transaction</h1>

    <div v-if="loading" class="text-center py-12 text-gray-400">
      Chargement...
    </div>

    <TransactionForm
      v-else-if="transaction"
      :initial-data="transaction"
      :on-submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import type { TransactionFormData } from '~/utils/schemas'
import type { Transaction } from '~/server/db/schema'

const route = useRoute()
const router = useRouter()
const { updateTransaction } = useTransactions()
const { $authFetch } = useAuth()

const id = Number(route.params.id)
const transaction = ref<Transaction | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    transaction.value = await $authFetch<Transaction>(`/api/transactions/${id}`)
  } finally {
    loading.value = false
  }
})

async function handleSubmit(data: TransactionFormData) {
  await updateTransaction(id, data)
  router.push('/transactions')
}
</script>
