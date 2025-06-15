// src/components/ProtectedRoute.js
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  // Kullanıcının localStorage'da olup olmadığını kontrol et
  // Bu, basit bir kimlik doğrulama kontrolüdür.
  // Daha karmaşık senaryolarda (örneğin token doğrulaması) burası değişebilir.
  const user = localStorage.getItem('user')

  // Eğer kullanıcı bilgisi localStorage'da yoksa, giriş sayfasına yönlendir
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Kullanıcı bilgisi varsa, korunan alt rotaları (child routes) render et
  // Outlet, React Router v6'da iç içe geçmiş rotaların içeriğini gösterir.
  return <Outlet />
}

export default ProtectedRoute
