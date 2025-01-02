import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrwoserRouter } from 'react-router-dom'


import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrwoserRouter>
    <App />
  </BrwoserRouter>
)
