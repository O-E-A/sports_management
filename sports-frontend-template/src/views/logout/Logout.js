// src/views/pages/logout/Logout.js
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

const Logout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // localStorage'dan kullanıcı bilgisini sil
    localStorage.removeItem('user')
    // Çıkış işleminden sonra giriş sayfasına yönlendir
    navigate('/login', { replace: true })
  }, [navigate]) // navigate değiştiğinde bu efekti tekrar çalıştır

  return (
    <div className="pt-3 text-center">
      <CSpinner color="primary" variant="grow" />
      <p>Çıkış yapılıyor...</p>
    </div>
  )
}

export default Logout
