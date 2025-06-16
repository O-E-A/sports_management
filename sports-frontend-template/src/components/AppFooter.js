import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="#" target="_blank" rel="noopener noreferrer">
          OEA
        </a>
        <span className="ms-1">&copy; 2025 created by OEA</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://bsm.sakarya.edu.tr/" target="_blank" rel="noopener noreferrer">
          SAKARAYA ÜNİVERSİTESİ &amp; Bilişim Sistemleri Mühendisliği
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
