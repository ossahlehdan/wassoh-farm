export const unitLabels: Record<string, string> = {
  kg: 'kg',
  tonne: 'tonne',
  sac: 'sac',
  seau_petit: 'Seau (petit)',
  seau_grand: 'Seau (grand)',
  botte: 'botte',
  caisse: 'caisse',
  panier: 'panier',
  litre: 'litre',
  pièce: 'pièce',
  boîte: 'boîte',
  bidon: 'bidon',
  jour: 'jour',
  heure: 'heure',
  personne: 'personne',
  voyage: 'voyage',
  mois: 'mois',
}

export function formatUnit(u: string): string {
  return unitLabels[u] || u
}
