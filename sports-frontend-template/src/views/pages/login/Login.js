import React, { useState } from 'react'
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

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Form gönderildiğinde çalışacak fonksiyon
  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password,
      })

      // Kullanıcı varsa veriyi localStorage'a kaydet
      if (res.data && res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user))

        // Rol kontrolü yapılmak istenirse burada yapılabilir
        if (res.data.user.role === 'admin') {
          navigate('/dashboard')
        } else {
          navigate('/profile') // örneğin oyuncu ise
        }
      } else {
        setError('Geçersiz yanıt alındı.')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Giriş başarısız. Lütfen kullanıcı bilgilerinizi kontrol edin.',
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

                    {error && <CAlert color="danger">{error}</CAlert>}

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
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Kayıt Ol</h2>
                    <p>Yeni kullanıcı oluşturmak için tıklayın.</p>
                    <CButton color="light" className="mt-3" href="/register">
                      Kayıt Ol
                    </CButton>
                  </div>
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
