import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DonneesProvider } from './context/DonneesContext.jsx'
import App from './App.jsx'
import './styles/app.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DonneesProvider>
        <App />
      </DonneesProvider>
    </BrowserRouter>
  </StrictMode>,
)
