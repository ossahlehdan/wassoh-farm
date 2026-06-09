export function useDashboard() {
  const { $authFetch } = useAuth()
  const stats = ref<{
    totalIncome: number
    totalExpense: number
    balance: number
    recentTransactions: any[]
  } | null>(null)
  const loading = ref(false)

  async function fetchStats() {
    loading.value = true
    try {
      stats.value = await $authFetch('/api/transactions/stats')
    } finally {
      loading.value = false
    }
  }

  return { stats, loading, fetchStats }
}
