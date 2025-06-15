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
} from '@coreui/react'

const InventoryList = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchInventory()
  }, [])

  return (
    <div>
      <h2>Envanter Listesi</h2>
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
    </div>
  )
}

export default InventoryList
