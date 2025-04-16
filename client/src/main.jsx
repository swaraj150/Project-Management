import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'

import 'react-toastify/dist/ReactToastify.css'

import './styles/index.css'
import './styles/utility.css'
import './styles/animations.css'

import { SocketProvider } from './contexts/SocketContext.jsx'

import store from './redux/store.js'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH2_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <SocketProvider>
        <App />
        </SocketProvider>
      </Provider>
    </GoogleOAuthProvider>
  // </StrictMode>
)

// Disabled strict mode to avoid rendering twice, as code required to get access token for github login can be used only once