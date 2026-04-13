import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TransactionProvider } from './contexts/TransactionContext.jsx'
import { AuthProvider } from './contexts/AuthContext.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TransactionProvider>
        <App />
      </TransactionProvider>
    </AuthProvider>
  </StrictMode>,
)
