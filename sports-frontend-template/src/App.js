// sports-frontend-template\src\App.js
import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// PrivateRoute bileşenini içeri aktar
import ProtectedRoute from './components/ProtectedRoute'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Logout = React.lazy(() => import('./views/logout/Logout')) // Logout bileşenini içeri aktar

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* Halka açık rotalar (login olmadan erişilebilir) */}
          {/* Kullanıcı giriş yapmamışken bu sayfalara gidebilir */}
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route exact path="/logout" name="Logout Page" element={<Logout />} />{' '}
          {/* Logout rotasını ekle */}
          {/* Korumalı rotalar (sadece giriş yapıldıktan sonra erişilebilir) */}
          {/* DefaultLayout içindeki tüm rotalar (dashboard, players, profile vb.) buraya düşer */}
          {/* Bu rotalara erişmeden önce ProtectedRoute kontrolünden geçilecek */}
          <Route path="/" element={<ProtectedRoute />}>
            {/* path="*" DefaultLayout'un altındaki tüm rotaları yakalar. */}
            {/* Login işlemi başarılı olduktan sonra kullanıcı /'e veya yönlendirildiği ilk korumalı sayfaya gelecektir. */}
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
