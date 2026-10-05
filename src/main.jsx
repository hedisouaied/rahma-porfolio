import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

/* The boot curtain in index.html is only a paint guard — React replaces it. */
const boot = document.getElementById('boot')
if (boot) boot.remove()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
