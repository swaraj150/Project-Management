import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from './components/layout/MainLayout'

import { publicRoutes, privateRoutes } from "./routes/Routes"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {
          publicRoutes.map((route) => (
            <Route path={route.path} element={route.element} />
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
  )
}

export default App