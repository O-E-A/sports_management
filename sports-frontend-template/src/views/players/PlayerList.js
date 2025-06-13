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

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profiles')
        setPlayers(response.data)
      } catch (error) {
        console.error('Oyuncular çekilemedi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  if (loading) return <CSpinner color="primary" />

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
