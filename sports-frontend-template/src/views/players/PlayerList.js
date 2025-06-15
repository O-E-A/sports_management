// sports-frontend-template\src\views\players\PlayerList.js

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

const PlayerList = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) // Hata durumu ekleyelim

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Backend'deki yeni '/api/profiles' rotasına istek atıyoruz
        const response = await axios.get('http://localhost:5000/api/profiles')
        setPlayers(response.data)
        console.log('PlayerList - Players fetched successfully:', response.data)
      } catch (error) {
        console.error('PlayerList - Oyuncular çekilemedi:', error)
        setError('Oyuncular listesi alınamadı. Lütfen backend sunucunuzun çalıştığından emin olun.')
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  if (loading) return <CSpinner color="primary" className="my-3" /> // Yüklenirken spinner göster

  if (error) return <p className="text-danger">{error}</p> // Hata durumunda mesaj göster

  if (players.length === 0) {
    return <p>Henüz hiç oyuncu bulunmamaktadır.</p> // Oyuncu yoksa bilgi mesajı
  }

  return (
    <div>
      <h2>Oyuncular Listesi</h2>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Ad</CTableHeaderCell>
            <CTableHeaderCell>Soyad</CTableHeaderCell>
            <CTableHeaderCell>Yaş</CTableHeaderCell>
            <CTableHeaderCell>Boy</CTableHeaderCell>
            <CTableHeaderCell>Kilo</CTableHeaderCell>
            <CTableHeaderCell>Mevki</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {players.map((player) => (
            <CTableRow key={player._id}>
              {' '}
              {/* _id'nin olduğundan emin olun */}
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
    </div>
  )
}

export default PlayerList
