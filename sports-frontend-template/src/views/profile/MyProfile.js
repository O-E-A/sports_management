// sports-frontend-template\src\views\profile\MyProfile.js

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'

const MyProfile = () => {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        console.log('MyProfile - User from localStorage:', user) // localStorage'daki kullanıcıyı logla

        if (!user || !user.id) {
          // user ve user.id'nin varlığını kontrol et
          setError('Giriş yapmamış kullanıcı veya kullanıcı ID bulunamadı.')
          return
        }

        // Backend'deki '/api/profiles/:userId' rotasına istek atıyoruz
        const res = await axios.get(`http://localhost:5000/api/profiles/${user.id}`)
        setProfile(res.data)
        console.log('MyProfile - Profile fetched successfully:', res.data)
      } catch (err) {
        console.error('MyProfile - Error fetching profile:', err)
        setError(
          'Profil alınamadı. Lütfen backend sunucunuzun çalıştığından ve veritabanı bağlantısının doğru olduğundan emin olun. Konsoldaki detaylı hatayı kontrol edin.',
        )
      }
    }

    fetchProfile()
  }, []) // Bağımlılık dizisi boş olduğu için sadece bir kere çalışır

  if (error) {
    return <p className="text-danger">{error}</p> // Hata mesajını daha belirgin yap
  }

  if (!profile) {
    return <p>Yükleniyor...</p>
  }

  return (
    <CRow>
      <CCol md={6}>
        <CCard>
          <CCardHeader>Profil Bilgilerim</CCardHeader>
          <CCardBody>
            <CListGroup>
              <CListGroupItem>
                <strong>Ad:</strong> {profile.firstName}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Soyad:</strong> {profile.lastName}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Yaş:</strong> {profile.age}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Boy:</strong> {profile.height} cm
              </CListGroupItem>
              <CListGroupItem>
                <strong>Kilo:</strong> {profile.weight} kg
              </CListGroupItem>
              <CListGroupItem>
                <strong>Mevki:</strong> {profile.position}
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default MyProfile
