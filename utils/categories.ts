export const incomeCategories = [
  'Vente de récolte',
  'Subvention',
  'Prêt reçu',
  'Autre revenu',
] as const

export const expenseCategories = [
  'Semences',
  'Engrais/pesticides',
  "Main d'œuvre",
  'Matériel',
  'Transport',
  'Eau/irrigation',
  'Autre dépense',
] as const

export function getCategoriesForType(type: 'income' | 'expense') {
  return type === 'income' ? [...incomeCategories] : [...expenseCategories]
}
