// Charge le jeu de données actif (public/data/<jeu>.json) et le partage à toute l'application.
// Usage dans une page : const { donnees, jeu } = useDonnees()
//   donnees.joueur, donnees.regions, donnees.packages, donnees.historique
import { createContext, useContext, useEffect, useState } from 'react'

export const JEUX_DISPONIBLES = ['normal', 'limites', 'erreurs']
const CLE_JEU_ACTIF = 'superstake-jeu-actif'

const DonneesContext = createContext(null)

function lireJeuSauvegarde() {
  try {
    const jeu = localStorage.getItem(CLE_JEU_ACTIF)
    return JEUX_DISPONIBLES.includes(jeu) ? jeu : 'normal'
  } catch {
    return 'normal'
  }
}

export function DonneesProvider({ children }) {
  const [jeu, setJeu] = useState(lireJeuSauvegarde)
  const [donnees, setDonnees] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    let annule = false
    setChargement(true)
    setErreur(null)

    fetch(`${import.meta.env.BASE_URL}data/${jeu}.json`)
      .then((reponse) => {
        if (!reponse.ok) {
          throw new Error(`Le fichier ${jeu}.json est introuvable (code ${reponse.status}).`)
        }
        return reponse.json().catch(() => {
          throw new Error(`Le fichier ${jeu}.json n'est pas un JSON valide.`)
        })
      })
      .then((json) => {
        if (!annule) setDonnees(json)
      })
      .catch((e) => {
        if (!annule) {
          setDonnees(null)
          setErreur(e.message)
        }
      })
      .finally(() => {
        if (!annule) setChargement(false)
      })

    return () => {
      annule = true
    }
  }, [jeu])

  function changerJeu(nouveauJeu) {
    if (!JEUX_DISPONIBLES.includes(nouveauJeu)) return
    try {
      localStorage.setItem(CLE_JEU_ACTIF, nouveauJeu)
    } catch {
      // Stockage indisponible : le choix reste valide pour la session.
    }
    setJeu(nouveauJeu)
  }

  return (
    <DonneesContext.Provider value={{ jeu, changerJeu, donnees, chargement, erreur }}>
      {children}
    </DonneesContext.Provider>
  )
}

export function useDonnees() {
  const contexte = useContext(DonneesContext)
  if (!contexte) {
    throw new Error('useDonnees doit être utilisé à l\'intérieur de <DonneesProvider>.')
  }
  return contexte
}
