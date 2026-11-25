// Calculs partagés (équivalent de CalculateurValeurMoyenne au TP2).
// Le prix payé et la valeur moyenne ne sont jamais stockés dans le JSON : ils sont toujours calculés ici.

export const NIVEAUX = ['standard', 'booste']
export const NOMS_NIVEAUX = { standard: 'Standard', booste: 'Boosté' }

// Arrondit au cent pour éviter les erreurs de virgule flottante (ex. 0.1 + 0.2).
export function arrondirAuCent(montant) {
  return Math.round(montant * 100) / 100
}

// Prix payé = prix régulier du produit de base + supplément du niveau de mise.
export function prixPaye(pkg, niveau) {
  return arrondirAuCent(pkg.produitBase.prixRegulier + pkg.niveaux[niveau].supplement)
}

// Valeur moyenne = (1 - p) × prix de base + p × prix premium.
export function valeurMoyenne(pkg, niveau) {
  const p = pkg.niveaux[niveau].probabilitePremium
  return arrondirAuCent(
    (1 - p) * pkg.produitBase.prixRegulier + p * pkg.produitPremium.prixRegulier,
  )
}

// Règle clé du TP1 : la valeur moyenne doit être supérieure ou égale au prix payé.
export function estConforme(pkg, niveau) {
  return valeurMoyenne(pkg, niveau) >= prixPaye(pkg, niveau)
}

// Un package est offert aux joueurs seulement s'il est publié et conforme à chaque niveau.
export function estOffert(pkg) {
  return pkg.publie === true && NIVEAUX.every((niveau) => estConforme(pkg, niveau))
}

// Vérifie que les données d'un package sont utilisables (utile avec erreurs.json).
export function estPackageValide(pkg) {
  const prixValide = (produit) =>
    produit && typeof produit.prixRegulier === 'number' && produit.prixRegulier > 0
  const niveauValide = (n) =>
    n &&
    typeof n.supplement === 'number' &&
    n.supplement >= 0 &&
    typeof n.probabilitePremium === 'number' &&
    n.probabilitePremium >= 0 &&
    n.probabilitePremium <= 1

  return Boolean(
    pkg &&
      pkg.id &&
      pkg.nom &&
      prixValide(pkg.produitBase) &&
      prixValide(pkg.produitPremium) &&
      pkg.niveaux &&
      NIVEAUX.every((niveau) => niveauValide(pkg.niveaux[niveau])),
  )
}

// Affiche un montant au format québécois : 7,20 $
export function formaterArgent(montant) {
  return montant.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })
}

// Affiche une probabilité en pourcentage : 0.2 → 20 %
export function formaterPourcentage(probabilite) {
  return probabilite.toLocaleString('fr-CA', { style: 'percent', maximumFractionDigits: 1 })
}
