import React from 'react'
import { CContainer, CHeader, CHeaderBrand, CSidebar, CSidebarNav, CNavItem, CNavTitle } from '@coreui/react'
import { NavLink, Outlet } from 'react-router-dom'

const DefaultLayout = () => {
  return (
    <div className="d-flex">
      <CSidebar>
        <CSidebarNav>
          <CNavTitle>Menü</CNavTitle>
          <CNavItem component={NavLink} to="/">Dashboard</CNavItem>
          <CNavItem component={NavLink} to="/players">Oyuncular</CNavItem>
          <CNavItem component={NavLink} to="/inventory">Envanter</CNavItem>
        </CSidebarNav>
      </CSidebar>
      <div className="flex-grow-1">
        <CHeader>
          <CHeaderBrand>Sports Management</CHeaderBrand>
        </CHeader>
        <CContainer className="mt-4">
          <Outlet />
        </CContainer>
      </div>
    </div>
  )
}

export default DefaultLayout
