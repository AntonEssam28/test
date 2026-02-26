import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { TokenContextProvider } from './Context/tokenContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TokenContextProvider>
        <App /> 
        <ReactQueryDevtools initialIsOpen={false} />
      </TokenContextProvider>
    </QueryClientProvider>
    <ToastContainer />
  </StrictMode>,
)
