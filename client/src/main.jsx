import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'

import App from './App.jsx'

import 'react-toastify/dist/ReactToastify.css'

import './css/index.css'
import './css/utility.css'

import store from './redux/store.js'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH2_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  // </StrictMode>
)

// Disabled strict mode to avoid rendering twice, as code required to get access token for github login can be used only once