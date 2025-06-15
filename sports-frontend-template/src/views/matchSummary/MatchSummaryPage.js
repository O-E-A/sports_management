import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
} from '@coreui/react'

const MatchSummary = () => {
  const [summaryData, setSummaryData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, matchesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/match-summary'),
          axios.get('http://localhost:5000/api/matches'),
        ])

        const matchMap = {}
        matchesRes.data.forEach((match) => {
          matchMap[match._id] = match
        })

        const mergedData = summaryRes.data.map((summary) => {
          const matchInfo = matchMap[summary.matchId] || {}

          return {
            date: matchInfo.date || 'Tarih yok',
            opponent: matchInfo.opponent || 'Rakip yok',
            score: `${summary.scoreUs} - ${summary.scoreOpponent}`,
            totalYards: (summary.totalRushingYards || 0) + (summary.totalPassingYards || 0),
            tackles: summary.totalTackles || 0,
          }
        })

        setSummaryData(mergedData)
      } catch (err) {
        console.error('Veri alınamadı', err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="m-4">
      <h2>Maç Özetleri</h2>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Tarih</CTableHeaderCell>
            <CTableHeaderCell>Rakip</CTableHeaderCell>
            <CTableHeaderCell>Skor</CTableHeaderCell>
            <CTableHeaderCell>Toplam Yard</CTableHeaderCell>
            <CTableHeaderCell>Toplam Tackles</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {summaryData.map((item, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{new Date(item.date).toLocaleDateString()}</CTableDataCell>
              <CTableDataCell>{item.opponent}</CTableDataCell>
              <CTableDataCell>{item.score}</CTableDataCell>
              <CTableDataCell>{item.totalYards}</CTableDataCell>
              <CTableDataCell>{item.tackles}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default MatchSummary
