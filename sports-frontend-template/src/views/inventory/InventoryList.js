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
} from '@coreui/react'

const InventoryList = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [newItem, setNewItem] = useState({
    itemName: '',
    quantity: '',
    status: '',
  })

  const user = JSON.parse(localStorage.getItem('user'))
  const canAddItem = user && (user.role === 'admin' || user.role === 'coach')

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/inventory')
      setItems(response.data)
    } catch (error) {
      console.error('Envanter verisi alınamadı:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewItem({ ...newItem, [name]: value })
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/inventory', newItem)
      setItems([...items, response.data])
      setModalVisible(false)
      setNewItem({ itemName: '', quantity: '', status: '' })
    } catch (error) {
      console.error('Öğe eklenirken hata oluştu:', error)
    }
  }

  const handleDeleteItem = async (itemId) => {
    const confirmDelete = window.confirm(
      'Bu envanter öğesini kalıcı olarak silmek istiyor musunuz?',
    )
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/inventory/${itemId}`)
        setItems((prevItems) => prevItems.filter((item) => item._id !== itemId))
      } catch (error) {
        console.error('Öğe silinirken hata oluştu:', error)
        alert('Öğe silinirken bir sorun oluştu.')
      }
    }
  }

  const handleExportPDF = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || !user.id) {
      alert('PDF indirmek için kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.')
      return
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/inventory/export-pdf/${user.id}`,
        {
          responseType: 'blob',
        },
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `envanter-raporu-${new Date().toISOString().split('T')[0]}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF indirilirken hata oluştu:', error)
      alert('PDF indirilirken bir sorun oluştu.')
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Envanter Listesi</h2>
        {canAddItem && (
          <div className="d-flex gap-2">
            <CButton color="primary" onClick={() => setModalVisible(true)}>
              Yeni Öğe Ekle
            </CButton>
            <CButton color="primary" onClick={handleExportPDF}>
              PDF Olarak İndir
            </CButton>
          </div>
        )}
      </div>

      {loading ? (
        <CSpinner color="primary" />
      ) : (
        <CTable striped hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>İsim</CTableHeaderCell>
              <CTableHeaderCell>Adet</CTableHeaderCell>
              <CTableHeaderCell>Durum</CTableHeaderCell>
              <CTableHeaderCell>Güncelleme Tarihi</CTableHeaderCell>
              {canAddItem && <CTableHeaderCell>İşlemler</CTableHeaderCell>}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item) => (
              <CTableRow key={item._id}>
                <CTableDataCell>{item.itemName}</CTableDataCell>
                <CTableDataCell>{item.quantity}</CTableDataCell>
                <CTableDataCell>{item.status}</CTableDataCell>
                <CTableDataCell>
                  {new Date(item.lastUpdated).toLocaleString('tr-TR')}
                </CTableDataCell>
                {canAddItem && (
                  <CTableDataCell>
                    <CButton color="danger" size="sm" onClick={() => handleDeleteItem(item._id)}>
                      Sil
                    </CButton>
                  </CTableDataCell>
                )}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      {/* Modal - Yeni Öğe Ekleme */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Yeni Envanter Öğesi Ekle</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleAddItem}>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel htmlFor="itemName">Öğe Adı</CFormLabel>
              <CFormInput
                type="text"
                id="itemName"
                name="itemName"
                value={newItem.itemName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="quantity">Adet</CFormLabel>
              <CFormInput
                type="number"
                id="quantity"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="status">Durum</CFormLabel>
              <CFormInput
                type="text"
                id="status"
                name="status"
                value={newItem.status}
                onChange={handleInputChange}
                required
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              İptal
            </CButton>
            <CButton color="primary" type="submit">
              Kaydet
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  )
}

export default InventoryList
