export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? Number(amount) : amount
  if (isNaN(num)) return '0 GNF'

  const formatted = Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  return `${formatted} GNF`
}
