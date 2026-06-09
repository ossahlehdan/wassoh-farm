import type { Transaction } from '~/server/db/schema'

export function useTransactions() {
  const { $authFetch } = useAuth()
  const transactions = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTransactions() {
    loading.value = true
    error.value = null
    try {
      transactions.value = await $authFetch<any[]>('/api/transactions')
    } catch (e: any) {
      error.value = e.message || 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }

  async function createTransaction(data: Record<string, any>) {
    return await $authFetch<Transaction>('/api/transactions', {
      method: 'POST',
      body: data,
    })
  }

  async function updateTransaction(id: number, data: Record<string, any>) {
    return await $authFetch<Transaction>(`/api/transactions/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  async function deleteTransaction(id: number) {
    return await $authFetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
