<template>
  <div>
    <h1 class="text-2xl font-bold text-farm-800 mb-6">Nouvelle transaction</h1>
    <TransactionForm :on-submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import type { TransactionFormData } from '~/utils/schemas'

const router = useRouter()
const { createTransaction } = useTransactions()

async function handleSubmit(data: TransactionFormData) {
  await createTransaction(data)
  router.push('/transactions')
}
</script>
