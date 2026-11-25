# Superstake Market — TP3 (Build & Prove)

Première release de Superstake Market : le parcours joueur **Packages → Chances → Tirage**, plus l'**Historique**.
Application React (Vite) en JavaScript, sans backend : les données viennent de fichiers JSON.

## Installer et lancer

Prérequis : [Node.js](https://nodejs.org) version 20 ou plus récente.

```bash
npm install
npm run dev
```

Ouvrir ensuite l'adresse affichée dans le terminal (habituellement http://localhost:5173).

## Structure

```
public/data/              Jeux de données (lus avec fetch, modifiables sans recompiler)
  normal.json             Données réalistes
  limites.json            Valeurs aux frontières
  erreurs.json            Données invalides ou problématiques
src/
  main.jsx                Point d'entrée
  App.jsx                 Routes (figé : ne pas modifier sans en parler à l'équipe)
  components/Navigation.jsx
  context/DonneesContext.jsx   Charge le jeu de données actif
  services/calculs.js     Prix payé, valeur moyenne, conformité, formatage
  services/               Services de chaque US (tirage, paiement simulé, historique)
  pages/                  Une page par User Story
  styles/app.css          Style commun
```

## Routes

| URL | Page | US | Responsable |
|---|---|---|---|
| `/packages` | `PackagesPage.jsx` | US-04 | Aleck Santiago Pinilla Pulido |
| `/chances/:packageId` | `ChancesPage.jsx` | US-05 | Eloi Foley |
| `/tirage/:packageId/:niveau` | `TiragePage.jsx` | US-09 | Facundo Alejandro Saenz Figueroa |
| `/historique` | `HistoriquePage.jsx` | US-13 | Anthony Jose Gonzalez Contreras |

`:niveau` vaut `standard` ou `booste`.

## Utiliser les données dans une page

```jsx
import { useDonnees } from '../context/DonneesContext.jsx'
import { prixPaye, valeurMoyenne, formaterArgent } from '../services/calculs.js'

const { donnees, jeu } = useDonnees()
// donnees.joueur, donnees.regions, donnees.packages, donnees.historique
```

Le jeu de données actif se choisit dans la barre de navigation (normal, limites, erreurs).
Si le fichier est introuvable ou mal formé, l'application affiche un message d'erreur au lieu des pages.

## Règles d'équipe

- Chaque membre travaille **seulement dans ses fichiers** (sa page et ses services).
- `App.jsx`, `DonneesContext.jsx` et `calculs.js` sont partagés : on en parle à l'équipe avant de les modifier.
- Aucun montant codé en dur : le prix payé et la valeur moyenne viennent toujours de `calculs.js`.
- Le tirage est lancé **seulement par un clic**, jamais dans un `useEffect` (le StrictMode de React exécute les effets deux fois en développement, ce qui donnerait deux tirages).
- Une branche par US (`us-04-packages`, `us-05-chances`, `us-09-tirage`, `us-13-historique`), puis une pull request vers `main`.
- Chaque membre fait ses commits **avec son propre compte**.

## Contrat de l'historique (à respecter par US-09 et US-13)

`src/services/historiqueService.js` (US-13) exposera :

| Fonction | Rôle |
|---|---|
| `lireHistorique(jeu, historiqueJson)` | Retourne les tirages du JSON + ceux ajoutés dans le navigateur pour ce jeu, du plus récent au plus ancien. |
| `ajouterTirage(jeu, tirage)` | Ajoute un tirage (même format que `historique` dans le JSON). Appelée par US-09 après un tirage. |
| `reinitialiserHistorique(jeu)` | Efface les tirages ajoutés dans le navigateur pour ce jeu (précondition des tests). |

Format d'un tirage :

```json
{
  "id": "T-0001",
  "date": "2026-11-08T18:42:00",
  "packageId": "fromage",
  "packageNom": "Package fromage",
  "niveau": "standard",
  "prixPaye": 7.00,
  "produitObtenu": "Cheddar doux 400 g",
  "premium": false,
  "statut": "Paye"
}
```

`statut` reprend `StatutTirage` du TP2 : `Paye`, `QrEmis`, `Retire`, `Expire` ou `Rembourse`.
