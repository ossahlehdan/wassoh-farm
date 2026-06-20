export function useDashboard() {
  const { $authFetch } = useAuth()
  const stats = ref<{
    totalVentes: number
    totalDepenses: number
    balance: number
    culturesEnCours: number
    recentActivity: any[]
  } | null>(null)
  const loading = ref(false)

  async function fetchStats() {
    loading.value = true
    try {
      stats.value = await $authFetch('/api/dashboard/stats')
    } finally {
      loading.value = false
    }
  }

  return { stats, loading, fetchStats }
}
