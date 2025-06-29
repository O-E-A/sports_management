// sports-frontend-template\src\views\pages\login\Login.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'
import myLogo from 'src/assets/images/logo3.jpg'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Bileşen yüklendiğinde veya kullanıcı durumu değiştiğinde çalışır
  // Eğer kullanıcı zaten giriş yapmışsa (localStorage'da kullanıcı bilgisi varsa),
  // doğrudan dashboard'a veya kendi profiline yönlendir
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.id) {
      // user bilgisi ve user.id varsa giriş yapılmıştır
      // Kullanıcının rolüne göre yönlendirme yapabilirsiniz
      if (user.role === 'admin') {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/my-profile', { replace: true }) // Örn: Oyuncu ise kendi profiline
      }
    }
  }, [navigate]) // navigate değiştiğinde bu efekti tekrar çalıştır

  // Form gönderildiğinde (Giriş Yap butonuna basıldığında) çalışacak fonksiyon
  const handleLogin = async (e) => {
    e.preventDefault() // Sayfanın yeniden yüklenmesini engelle
    setError(null) // Önceki hataları temizle

    try {
      // Backend'deki giriş uç noktasına POST isteği gönder
      const res = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password,
      })

      // Eğer backend başarılı bir kullanıcı nesnesi döndürdüyse
      if (res.data && res.data.user) {
        // Kullanıcı bilgisini localStorage'a JSON string'i olarak kaydet
        localStorage.setItem('user', JSON.stringify(res.data.user))

        // Kullanıcının rolüne göre yönlendirme yap
        if (res.data.user.role === 'admin') {
          navigate('/dashboard', { replace: true }) // Dashboard'a yönlendir
        } else {
          navigate('/my-profile', { replace: true }) // Örneğin oyuncu ise kendi profiline yönlendir
        }
      } else {
        // Backend'den beklenmedik bir yanıt geldiyse
        setError('Geçersiz yanıt alındı. Lütfen tekrar deneyin.')
      }
    } catch (err) {
      // API isteği sırasında bir hata oluştuysa (örn: 401 Unauthorized, 404 Not Found)
      setError(
        err.response?.data?.message || // Backend'den gelen hata mesajı varsa onu göster
          'Giriş başarısız. Lütfen kullanıcı adı ve şifrenizi kontrol edin.', // Yoksa genel bir mesaj
      )
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Giriş</h1>
                    <p className="text-body-secondary">Hesabınıza giriş yapın</p>
                    {error && <CAlert color="danger">{error}</CAlert>} {/* Hata varsa göster */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Kullanıcı adı"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Şifre"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Giriş Yap
                        </CButton>
                      </CCol>
                      {/* Şifremi unuttum veya kayıt ol linklerini buraya ekleyebilirsiniz */}
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Şifremi unuttum?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center d-flex align-items-center justify-content-center">
                  <img src={myLogo} alt="Full Logo" style={{ maxWidth: '100%', height: 'auto' }} />
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
