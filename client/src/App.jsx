import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import MainLayout from './components/layout/MainLayout'

import { publicRoutes, privateRoutes } from './routes/Routes'

const App = () => {
  return (
    <>
      <ToastContainer
        position='bottom-left'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        transition:Bounce
      />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          {
            publicRoutes.map((route, index) => (
              <Route path={route.path} key={index} element={route.element} />
            ))
          }
          {/* Public Routes */}

          {/* Private Routes */}
          <Route path='/' element={<MainLayout />} >
            {
              privateRoutes.map((route, index) => (
                route.index ? (
                  <Route index key={index} element={route.element} />
                ) : (
                  <Route path={route.path} key={index} element={route.element} />
                )
              ))
            }
          </Route>
          {/* Private Routes */}

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App