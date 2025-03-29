import React from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import MainLayout from './components/layout/MainLayout'

import NotFoundPage from './pages/NotFoundPage'

import { publicRoutes, privateRoutes } from './routes/Routes'

import usePrevious from './hooks/usePrevious'

const App = () => {

  const { active } = useSelector((state) => state.menu)
  const previousActive = usePrevious(active)

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
                  <Route path={route.path} key={index} element={route.element} />
              ))
            }
          </Route>
          {/* Private Routes */}

          {/* Not Found Page */}
          <Route path="*" element={<NotFoundPage previousActive={previousActive} />} />
          {/* Not Found Page */}

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App