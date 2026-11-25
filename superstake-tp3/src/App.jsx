// Routes de l'application. Ce fichier est figé : chaque membre travaille dans sa propre page.
import { Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import { useDonnees } from './context/DonneesContext.jsx'
import PackagesPage from './pages/PackagesPage.jsx'
import ChancesPage from './pages/ChancesPage.jsx'
import TiragePage from './pages/TiragePage.jsx'
import HistoriquePage from './pages/HistoriquePage.jsx'

function App() {
  const { chargement, erreur, jeu } = useDonnees()

  let contenu
  if (chargement) {
    contenu = <p>Chargement des données…</p>
  } else if (erreur) {
    contenu = (
      <div className="message-erreur" role="alert">
        <h2>Impossible de charger le jeu de données « {jeu} »</h2>
        <p>{erreur}</p>
      </div>
    )
  } else {
    contenu = (
      <Routes>
        <Route path="/" element={<Navigate to="/packages" replace />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/chances/:packageId" element={<ChancesPage />} />
        <Route path="/tirage/:packageId/:niveau" element={<TiragePage />} />
        <Route path="/historique" element={<HistoriquePage />} />
        <Route path="*" element={<p>Page introuvable.</p>} />
      </Routes>
    )
  }

  return (
    <>
      <Navigation />
      <main className="contenu">{contenu}</main>
    </>
  )
}

export default App
