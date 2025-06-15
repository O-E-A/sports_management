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
        if (!user) {
          setError('Giriş yapmamış kullanıcı')
          return
        }

        const res = await axios.get(`http://localhost:5000/api/profiles/${user.id}`)
        setProfile(res.data)
      } catch (err) {
        setError('Profil alınamadı.')
      }
    }

    fetchProfile()
  }, [])

  if (error) {
    return <p>{error}</p>
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
                <strong>Mevkii:</strong> {profile.position}
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default MyProfile
