import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CSpinner,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilPlus,
  cilBullhorn,
  cilTrash, // YENİ EKLENDİ: Sil butonu için ikon
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import axios from 'axios'
import moment from 'moment'

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)
  const [errorAnnouncements, setErrorAnnouncements] = useState(null)

  const [addAnnouncementModalVisible, setAddAnnouncementModalVisible] = useState(false)
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('')
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('')
  const [addingAnnouncement, setAddingAnnouncement] = useState(false)
  const [addAnnouncementError, setAddAnnouncementError] = useState(null)
  const [addAnnouncementSuccess, setAddAnnouncementSuccess] = useState(null)

  const [currentUser, setCurrentUser] = useState(null)

  // Duyuruları getirme fonksiyonu (hem başlangıçta hem de silme/ekleme sonrası kullanılabilir)
  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true)
    setErrorAnnouncements(null)
    try {
      const response = await axios.get('http://localhost:5000/api/announcements')
      setAnnouncements(response.data)
    } catch (err) {
      console.error('Duyurular alınamadı:', err)
      setErrorAnnouncements(err.response?.data?.message || 'Duyurular yüklenirken bir hata oluştu.')
    } finally {
      setLoadingAnnouncements(false)
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      setCurrentUser(user)
    }

    fetchAnnouncements() // Sayfa yüklendiğinde duyuruları çek
  }, [])

  const canAddAnnouncement =
    currentUser && (currentUser.role === 'admin' || currentUser.role === 'coach')

  // YENİ EKLENDİ: Duyuru silme yetkisi
  const canDeleteAnnouncement =
    currentUser && (currentUser.role === 'admin' || currentUser.role === 'coach')

  const handleAnnouncementInputChange = (e) => {
    const { id, value } = e.target
    if (id === 'announcementTitle') {
      setNewAnnouncementTitle(value)
    } else if (id === 'announcementContent') {
      setNewAnnouncementContent(value)
    }
  }

  const handleAddAnnouncementSubmit = async (e) => {
    e.preventDefault()
    setAddingAnnouncement(true)
    setAddAnnouncementError(null)
    setAddAnnouncementSuccess(null)

    if (!currentUser || !currentUser.id) {
      setAddAnnouncementError("Kullanıcı ID'si bulunamadı. Lütfen tekrar giriş yapın.")
      setAddingAnnouncement(false)
      return
    }
    if (!newAnnouncementTitle || !newAnnouncementContent) {
      setAddAnnouncementError('Başlık ve içerik boş bırakılamaz.')
      setAddingAnnouncement(false)
      return
    }

    try {
      const response = await axios.post('http://localhost:5000/api/announcements', {
        title: newAnnouncementTitle,
        content: newAnnouncementContent,
        author: currentUser.id,
      })

      if (response.status === 201) {
        setAddAnnouncementSuccess("Duyuru başarıyla eklendi ve Telegram'a gönderildi!")
        setNewAnnouncementTitle('')
        setNewAnnouncementContent('')
        setAddAnnouncementModalVisible(false)
        // Yeni duyuruyu listenin başına ekle (veya fetchAnnouncements çağırarak tüm listeyi yeniden çekebilirsiniz)
        setAnnouncements((prevAnnouncements) => [response.data.announcement, ...prevAnnouncements])
      }
    } catch (err) {
      setAddAnnouncementError(err.response?.data?.message || 'Duyuru eklenirken bir hata oluştu.')
      console.error('Duyuru ekleme hatası:', err.response?.data || err)
    } finally {
      setAddingAnnouncement(false)
    }
  }

  // YENİ EKLENDİ: Duyuru silme fonksiyonu
  const handleDeleteAnnouncement = async (announcementId) => {
    const confirmDelete = window.confirm(
      'Bu duyuruyu kalıcı olarak silmek istediğinize emin misiniz?',
    )

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/announcements/${announcementId}`)
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.filter((announcement) => announcement._id !== announcementId),
        )
        alert('Duyuru başarıyla silindi.')
      } catch (error) {
        console.error('Duyuru silinirken hata oluştu:', error)
        alert(error.response?.data?.message || 'Duyuru silinirken bir sorun oluştu.')
      }
    }
  }

  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]

  return (
    <>
      {/* Duyurular Kartı */}
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          Duyurular
          {/* Sadece admin veya koç ise Duyuru Ekle butonu görünür */}
          {canAddAnnouncement && (
            <CButton color="primary" size="sm" onClick={() => setAddAnnouncementModalVisible(true)}>
              <CIcon icon={cilPlus} className="me-1" /> Duyuru Ekle
            </CButton>
          )}
        </CCardHeader>
        <CCardBody>
          {loadingAnnouncements ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: '100px' }}
            >
              <CSpinner color="primary" variant="grow" />
              <span className="ms-2">Duyurular yükleniyor...</span>
            </div>
          ) : errorAnnouncements ? (
            <CAlert color="danger">{errorAnnouncements}</CAlert>
          ) : announcements.length === 0 ? (
            <CAlert color="info">Henüz duyuru bulunmamaktadır.</CAlert>
          ) : (
            <CTable hover responsive align="middle" className="mb-0 border">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Başlık</CTableHeaderCell>
                  <CTableHeaderCell>İçerik</CTableHeaderCell>
                  <CTableHeaderCell>Yayınlayan</CTableHeaderCell>
                  <CTableHeaderCell>Tarih</CTableHeaderCell>
                  {/* YENİ EKLENDİ: İşlemler sütunu sadece yetkili kullanıcılar için */}
                  {canDeleteAnnouncement && <CTableHeaderCell>İşlemler</CTableHeaderCell>}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {announcements.map((item) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell>
                      <div className="fw-semibold">{item.title}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.content}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.author?.username || 'Bilinmiyor'}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{moment(item.createdAt).format('DD.MM.YYYY HH:mm')}</div>
                    </CTableDataCell>
                    {/* YENİ EKLENDİ: Sil butonu sadece yetkili kullanıcılar için */}
                    {canDeleteAnnouncement && (
                      <CTableDataCell>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDeleteAnnouncement(item._id)}
                        >
                          <CIcon icon={cilTrash} className="me-1" /> Sil
                        </CButton>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* Yeni Duyuru Ekleme Modalı */}
      <CModal
        visible={addAnnouncementModalVisible}
        onClose={() => setAddAnnouncementModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Yeni Duyuru Ekle</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleAddAnnouncementSubmit}>
          <CModalBody>
            {addAnnouncementError && <CAlert color="danger">{addAnnouncementError}</CAlert>}
            {addAnnouncementSuccess && <CAlert color="success">{addAnnouncementSuccess}</CAlert>}

            <div className="mb-3">
              <CFormLabel htmlFor="announcementTitle">Duyuru Başlığı</CFormLabel>
              <CFormInput
                type="text"
                id="announcementTitle"
                value={newAnnouncementTitle}
                onChange={handleAnnouncementInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="announcementContent">Duyuru İçeriği</CFormLabel>
              <CFormTextarea
                id="announcementContent"
                rows={5}
                value={newAnnouncementContent}
                onChange={handleAnnouncementInputChange}
                required
              ></CFormTextarea>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setAddAnnouncementModalVisible(false)}>
              İptal
            </CButton>
            <CButton color="primary" type="submit" disabled={addingAnnouncement}>
              {addingAnnouncement ? 'Ekleniyor...' : 'Duyuruyu Ekle'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default Dashboard
