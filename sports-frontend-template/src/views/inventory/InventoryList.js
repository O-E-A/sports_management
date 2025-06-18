////////////sports-frontend-template\src\views\inventory\InventoryList.js///
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

  // Modal'ın görünürlüğü için state
  const [modalVisible, setModalVisible] = useState(false)
  // Form verileri için state
  const [newItem, setNewItem] = useState({
    itemName: '',
    quantity: '',
    status: '',
  })

  // Kullanıcı rolünü kontrol etmek için
  const user = JSON.parse(localStorage.getItem('user'))
  const canAddItem = user && (user.role === 'admin' || user.role === 'coach')

  // Mevcut envanteri getiren fonksiyon
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

  // Formdaki input değişikliklerini handle eden fonksiyon
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewItem({ ...newItem, [name]: value })
  }

  // Formu submit eden ve yeni öğe ekleyen fonksiyon
  const handleAddItem = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/inventory', newItem)
      // Yeni öğe eklendikten sonra listeyi güncelle
      setItems([...items, response.data])
      // Modal'ı kapat
      setModalVisible(false)
      // Formu temizle
      setNewItem({ itemName: '', quantity: '', status: '' })
    } catch (error) {
      console.error('Öğe eklenirken hata oluştu:', error)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Envanter Listesi</h2>
        {/* Butonu sadece rolü uygunsa göster */}
        {canAddItem && (
          <CButton color="primary" onClick={() => setModalVisible(true)}>
            Yeni Öğe Ekle
          </CButton>
        )}
      </div>

      {loading ? (
        <CSpinner color="primary" />
      ) : (
        <CTable striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>İsim</CTableHeaderCell>
              <CTableHeaderCell>Adet</CTableHeaderCell>
              <CTableHeaderCell>Durum</CTableHeaderCell>
              <CTableHeaderCell>Güncelleme Tarihi</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items.map((item) => (
              <CTableRow key={item._id}>
                <CTableDataCell>{item.itemName}</CTableDataCell>
                <CTableDataCell>{item.quantity}</CTableDataCell>
                <CTableDataCell>{item.status}</CTableDataCell>
                <CTableDataCell>{new Date(item.lastUpdated).toLocaleString()}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      {/* Yeni Öğe Ekleme Modalı */}
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
              <CFormLabel htmlFor="quantity">Adet</CFormLabel>{' '}
              {/* <-- Label burada sadece metin içerir */}
              <CFormInput
                type="number" // Adet sayısal olacağı için "number" kullanmak daha iyi
                id="quantity"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange} // <-- Değişikliği handle eden fonksiyon burada olmalı
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
