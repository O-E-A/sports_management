import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DefaultLayout from '../layouts/DefaultLayout'
import Dashboard from '../views/Dashboard'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Dashboard />} />
        {/* İleride eklenecek sayfalar: */}
        {/* <Route path="players" element={<Players />} /> */}
        {/* <Route path="inventory" element={<Inventory />} /> */}
      </Route>
    </Routes>
  )
}

export default AppRoutes
