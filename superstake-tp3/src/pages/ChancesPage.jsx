// US-05 — Voir les chances et la valeur moyenne avant de miser
// Responsable : Eloi Foley
// Cette page AFFICHE seulement les chances. Elle ne fait aucun tirage :
// le tirage se fait sur la page /tirage/:packageId/:niveau (US-09).
import { Link, useParams } from 'react-router-dom'
import { useDonnees } from '../context/DonneesContext.jsx'
import {
  NIVEAUX,
  NOMS_NIVEAUX,
  prixPaye,
  valeurMoyenne,
  estOffert,
  estPackageValide,
  formaterArgent,
  formaterPourcentage,
} from '../services/calculs.js'
import '../styles/chances.css'

// Lien de retour, affiché en haut de la page dans tous les cas.
function LienRetour() {
  return (
    <p>
      <Link to="/packages">← Retour aux packages</Link>
    </p>
  )
}

// Message d'erreur clair + lien de retour (jamais de page blanche).
function MessageProbleme({ message }) {
  return (
    <section>
      <LienRetour />
      <h1>Chances et valeur moyenne</h1>
      <div className="message-erreur" role="alert">
        <p>{message}</p>
        <p>
          <Link to="/packages">Voir les packages offerts</Link>
        </p>
      </div>
    </section>
  )
}

// Carte d'un niveau de mise (standard ou boosté).
// Toutes les valeurs viennent du JSON (pkg) et de calculs.js : rien n'est codé en dur.
function CarteNiveau({ pkg, niveau }) {
  // Probabilité lue directement dans le JSON : c'est la même valeur que le tirage utilisera.
  const probabilitePremium = pkg.niveaux[niveau].probabilitePremium
  const probabiliteBase = 1 - probabilitePremium
  const prix = prixPaye(pkg, niveau)
  const valeur = valeurMoyenne(pkg, niveau)

  return (
    <article className="carte niveau">
      <h2>{NOMS_NIVEAUX[niveau]}</h2>
      <dl>
        <dt>Prix payé</dt>
        <dd>{formaterArgent(prix)}</dd>

        <dt>Chance d'obtenir le produit premium</dt>
        <dd className="premium">{formaterPourcentage(probabilitePremium)}</dd>

        <dt>Chance d'obtenir le produit de base</dt>
        <dd>{formaterPourcentage(probabiliteBase)}</dd>

        <dt>Valeur moyenne</dt>
        <dd>{formaterArgent(valeur)}</dd>
      </dl>
      <p className="mention-conforme">
        ✔ La valeur moyenne ({formaterArgent(valeur)}) est supérieure ou égale au prix payé (
        {formaterArgent(prix)}).
      </p>
      <Link className="bouton" to={`/tirage/${pkg.id}/${niveau}`}>
        Choisir ce niveau
      </Link>
    </article>
  )
}

function ChancesPage() {
  // 1. Lire l'identifiant du package dans l'URL (ex. /chances/fromage → "fromage").
  const { packageId } = useParams()
  const { donnees } = useDonnees()

  // 2. Trouver le package. Si la liste est absente, on utilise une liste vide pour éviter un plantage.
  const packages = Array.isArray(donnees?.packages) ? donnees.packages : []
  const pkg = packages.find((p) => p?.id === packageId)

  // 3. Cas problématiques. L'ordre est important : on vérifie que les données sont valides
  //    AVANT d'appeler estOffert, sinon un prix manquant ferait planter le calcul.
  if (!pkg) {
    return <MessageProbleme message="Ce package est introuvable." />
  }
  if (!estPackageValide(pkg)) {
    return <MessageProbleme message="Les données de ce package sont invalides." />
  }
  if (!estOffert(pkg)) {
    // Non publié ou non conforme : aucun bouton « Choisir ce niveau ».
    return <MessageProbleme message="Ce package n'est pas offert actuellement." />
  }

  // 4. Cas normal : le package est valide et offert.
  return (
    <section>
      <LienRetour />
      <h1>{pkg.nom}</h1>

      <div className="carte produits">
        <p>
          <strong>Produit de base :</strong> {pkg.produitBase.nom} — prix régulier{' '}
          {formaterArgent(pkg.produitBase.prixRegulier)}
        </p>
        <p>
          <strong className="premium">Produit premium :</strong> {pkg.produitPremium.nom} — prix
          régulier {formaterArgent(pkg.produitPremium.prixRegulier)}
        </p>
      </div>

      <p>Consultez vos chances et la valeur moyenne de chaque niveau avant de miser.</p>

      <div className="niveaux">
        {NIVEAUX.map((niveau) => (
          <CarteNiveau key={niveau} pkg={pkg} niveau={niveau} />
        ))}
      </div>
    </section>
  )
}

export default ChancesPage
