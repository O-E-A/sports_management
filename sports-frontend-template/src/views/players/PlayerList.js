import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CSpinner,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CCol,
  CRow,
  CFormSelect,
} from '@coreui/react'

const PlayerList = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modal'ın görünürlüğü için state
  const [modalVisible, setModalVisible] = useState(false)
  // Yeni oyuncu formu verileri için state
  const [newPlayer, setNewPlayer] = useState({
    // User ve Profile modellerindeki tüm alanları buraya ekliyoruz
    username: '',
    password: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    weight: '',
    position: '',
    role: 'player',
  })

  // Kullanıcı rolünü localStorage'dan alarak butonu kontrol et
  const user = JSON.parse(localStorage.getItem('user'))
  const canAddPlayer = user && (user.role === 'admin' || user.role === 'coach')

  // Oyuncuları getiren fonksiyon
  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profiles')
      setPlayers(response.data)
    } catch (error) {
      console.error('Oyuncular çekilemedi:', error)
      setError('Oyuncular listesi alınamadı. Lütfen backend sunucunuzun çalıştığından emin olun.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlayers()
  }, [])

  // Formdaki input değişikliklerini handle eden fonksiyon
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewPlayer({ ...newPlayer, [name]: value })
  }

  // Formu submit eden ve yeni oyuncu ekleyen fonksiyon
  const handleAddPlayer = async (e) => {
    e.preventDefault()
    try {
      // Backend'e yeni oyuncu verilerini gönderiyoruz
      await axios.post('http://localhost:5000/api/profiles', newPlayer)

      // İşlem başarılı olunca modal'ı kapat
      setModalVisible(false)
      // Formu temizle
      setNewPlayer({
        username: '',
        password: '',
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        age: '',
        height: '',
        weight: '',
        position: '',
        role: 'player',
      })
      // Oyuncu listesini en güncel haliyle yeniden çek
      fetchPlayers()
    } catch (error) {
      console.error(
        'Oyuncu eklenirken hata oluştu:',
        error.response?.data?.message || error.message,
      )
      // Kullanıcıya hata mesajı gösterebilirsiniz. Örneğin:
      alert(`Hata: ${error.response?.data?.message || 'Bir sorun oluştu.'}`)
    }
  }

  if (loading) return <CSpinner color="primary" className="my-3" />
  if (error) return <p className="text-danger">{error}</p>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Oyuncular Listesi</h2>
        {/* Butonu sadece rolü admin veya coach olanlar görebilir */}
        {canAddPlayer && (
          <CButton color="primary" onClick={() => setModalVisible(true)}>
            Yeni Oyuncu Ekle
          </CButton>
        )}
      </div>

      {players.length === 0 ? (
        <p>Henüz hiç oyuncu bulunmamaktadır.</p>
      ) : (
        <CTable striped hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Ad</CTableHeaderCell>
              <CTableHeaderCell>Soyad</CTableHeaderCell>
              <CTableHeaderCell>Yaş</CTableHeaderCell>
              <CTableHeaderCell>Boy (cm)</CTableHeaderCell>
              <CTableHeaderCell>Kilo (kg)</CTableHeaderCell>
              <CTableHeaderCell>Mevki</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {players.map((player) => (
              <CTableRow key={player._id}>
                <CTableDataCell>{player.firstName}</CTableDataCell>
                <CTableDataCell>{player.lastName}</CTableDataCell>
                <CTableDataCell>{player.age}</CTableDataCell>
                <CTableDataCell>{player.height}</CTableDataCell>
                <CTableDataCell>{player.weight}</CTableDataCell>
                <CTableDataCell>{player.position}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      {/* Yeni Oyuncu Ekleme Modalı */}
      <CModal size="lg" visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Yeni Oyuncu Ekle</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleAddPlayer}>
          <CModalBody>
            <h5>Kullanıcı Bilgileri (Giriş için)</h5>
            <hr />
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="username">Kullanıcı Adı</CFormLabel>
                <CFormInput
                  id="username"
                  name="username"
                  value={newPlayer.username}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="password">Şifre</CFormLabel>
                <CFormInput
                  type="password"
                  id="password"
                  name="password"
                  value={newPlayer.password}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="role">Kullanıcı Rolü</CFormLabel>
                <CFormSelect
                  id="role"
                  name="role"
                  value={newPlayer.role}
                  onChange={handleInputChange}
                  options={[
                    { label: 'Oyuncu', value: 'player' },
                    { label: 'Koç', value: 'coach' },
                  ]}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="email">E-posta</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  name="email"
                  value={newPlayer.email}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="phone">Telefon</CFormLabel>
                <CFormInput
                  id="phone"
                  name="phone"
                  value={newPlayer.phone}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>

            <h5 className="mt-4">Profil Bilgileri</h5>
            <hr />
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="firstName">Ad</CFormLabel>
                <CFormInput
                  id="firstName"
                  name="firstName"
                  value={newPlayer.firstName}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="lastName">Soyad</CFormLabel>
                <CFormInput
                  id="lastName"
                  name="lastName"
                  value={newPlayer.lastName}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="age">Yaş</CFormLabel>
                <CFormInput
                  type="number"
                  id="age"
                  name="age"
                  value={newPlayer.age}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="height">Boy (cm)</CFormLabel>
                <CFormInput
                  type="number"
                  id="height"
                  name="height"
                  value={newPlayer.height}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="weight">Kilo (kg)</CFormLabel>
                <CFormInput
                  type="number"
                  id="weight"
                  name="weight"
                  value={newPlayer.weight}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <div className="mb-3">
              <CFormLabel htmlFor="position">Mevki</CFormLabel>
              <CFormInput
                id="position"
                name="position"
                value={newPlayer.position}
                onChange={handleInputChange}
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              İptal
            </CButton>
            <CButton color="primary" type="submit">
              Oyuncuyu Kaydet
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  )
}

export default PlayerList
