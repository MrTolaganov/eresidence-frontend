import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './lib/store.ts'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      {/* <StrictMode> */}
      <Provider store={store}>
        <App />
      </Provider>
      {/* </StrictMode> */}
    </QueryClientProvider>
  </BrowserRouter>
)
