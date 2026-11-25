// Barre de navigation commune : liens vers les écrans et choix du jeu de données.
import { NavLink } from 'react-router-dom'
import { useDonnees, JEUX_DISPONIBLES } from '../context/DonneesContext.jsx'

function Navigation() {
  const { jeu, changerJeu } = useDonnees()

  return (
    <header className="navigation">
      <span className="logo">Superstake Market</span>
      <nav>
        <NavLink to="/packages">Packages</NavLink>
        <NavLink to="/historique">Historique</NavLink>
      </nav>
      <label className="choix-jeu">
        Jeu de données :{' '}
        <select value={jeu} onChange={(e) => changerJeu(e.target.value)}>
          {JEUX_DISPONIBLES.map((nom) => (
            <option key={nom} value={nom}>
              {nom}
            </option>
          ))}
        </select>
      </label>
    </header>
  )
}

export default Navigation
