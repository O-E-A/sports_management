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
  const [modalVisible, setModalVisible] = useState(false)

  const [newPlayer, setNewPlayer] = useState({
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

  const user = JSON.parse(localStorage.getItem('user'))
  const canManagePlayers = user && (user.role === 'admin' || user.role === 'coach')

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profiles')
      setPlayers(response.data)
    } catch (error) {
      console.error('Oyuncular çekilemedi:', error)
      setError('Oyuncular listesi alınamadı.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlayers()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewPlayer((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddPlayer = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/profiles', newPlayer)
      setModalVisible(false)
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
      fetchPlayers()
    } catch (error) {
      console.error('Oyuncu eklenirken hata:', error)
      alert(`Hata: ${error.response?.data?.message || 'Bir sorun oluştu.'}`)
    }
  }

  const handleDeletePlayer = async (profileId) => {
    const confirmDelete = window.confirm('Bu kullanıcıyı kalıcı olarak silmek istiyor musunuz?')
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/profiles/${profileId}`)
        setPlayers((prev) => prev.filter((p) => p._id !== profileId))
      } catch (error) {
        console.error('Kullanıcı silinirken hata:', error)
        alert('Kullanıcı silinirken bir hata oluştu.')
      }
    }
  }

  if (loading) return <CSpinner color="primary" className="my-3" />
  if (error) return <p className="text-danger">{error}</p>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Oyuncular Listesi</h2>
        {canManagePlayers && (
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
              {canManagePlayers && <CTableHeaderCell>İşlemler</CTableHeaderCell>}
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
                {canManagePlayers && (
                  <CTableDataCell>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDeletePlayer(player._id)}
                    >
                      Sil
                    </CButton>
                  </CTableDataCell>
                )}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      {/* Oyuncu Ekleme Modalı */}
      <CModal size="lg" visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Yeni Oyuncu Ekle</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleAddPlayer}>
          <CModalBody>
            <h5>Kullanıcı Bilgileri</h5>
            <hr />
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Kullanıcı Adı</CFormLabel>
                <CFormInput
                  name="username"
                  value={newPlayer.username}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Şifre</CFormLabel>
                <CFormInput
                  type="password"
                  name="password"
                  value={newPlayer.password}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Kullanıcı Rolü</CFormLabel>
                <CFormSelect
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
                <CFormLabel>E-posta</CFormLabel>
                <CFormInput
                  type="email"
                  name="email"
                  value={newPlayer.email}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Telefon</CFormLabel>
                <CFormInput name="phone" value={newPlayer.phone} onChange={handleInputChange} />
              </CCol>
            </CRow>

            <h5>Profil Bilgileri</h5>
            <hr />
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Ad</CFormLabel>
                <CFormInput
                  name="firstName"
                  value={newPlayer.firstName}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Soyad</CFormLabel>
                <CFormInput
                  name="lastName"
                  value={newPlayer.lastName}
                  onChange={handleInputChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel>Yaş</CFormLabel>
                <CFormInput
                  type="number"
                  name="age"
                  value={newPlayer.age}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Boy (cm)</CFormLabel>
                <CFormInput
                  type="number"
                  name="height"
                  value={newPlayer.height}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel>Kilo (kg)</CFormLabel>
                <CFormInput
                  type="number"
                  name="weight"
                  value={newPlayer.weight}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
            <div className="mb-3">
              <CFormLabel>Mevki</CFormLabel>
              <CFormInput name="position" value={newPlayer.position} onChange={handleInputChange} />
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
