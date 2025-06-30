import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'

import MatchYardsChart from '../../components/MatchYardsChart'
import MatchStatChart from '../../components/MatchStatChart'

const MatchSummaryPage = () => {
  const [summaryData, setSummaryData] = useState([])
  const [matches, setMatches] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

  const [formData, setFormData] = useState({
    matchId: '',
    totalRushingYards: '',
    totalPassingYards: '',
    totalTackles: '',
    totalInterceptions: '',
    totalTouchdowns: '',
    scoreUs: '',
    scoreOpponent: '',
  })

  const user = JSON.parse(localStorage.getItem('user'))
  const canAdd = user && (user.role === 'admin' || user.role === 'coach')

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
            _id: summary._id,
            date: matchInfo.date || 'Tarih yok',
            opponent: matchInfo.opponent || 'Rakip yok',
            scoreUs: summary.scoreUs,
            scoreOpponent: summary.scoreOpponent,
            totalRushingYards: summary.totalRushingYards || 0,
            totalPassingYards: summary.totalPassingYards || 0,
            totalTackles: summary.totalTackles || 0,
            totalInterceptions: summary.totalInterceptions || 0,
            totalTouchdowns: summary.totalTouchdowns || 0,
          }
        })

        setSummaryData(mergedData)
        setMatches(matchesRes.data)
      } catch (err) {
        console.error('Veri alınamadı', err)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/match-summary', formData)
      setModalVisible(false)
      window.location.reload()
    } catch (err) {
      console.error('Maç özeti eklenemedi:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Silmek istediğine emin misin?')) return
    try {
      await axios.delete(`http://localhost:5000/api/match-summary/${id}`)
      setSummaryData((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      console.error('Silme hatası:', err)
    }
  }

  return (
    <div className="m-4">
      <h2>Maç Özetleri</h2>

      {canAdd && (
        <CButton className="mb-3" color="primary" onClick={() => setModalVisible(true)}>
          Yeni Maç Özeti Ekle
        </CButton>
      )}

      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Tarih</CTableHeaderCell>
            <CTableHeaderCell>Rakip</CTableHeaderCell>
            <CTableHeaderCell>Skor</CTableHeaderCell>
            <CTableHeaderCell>Rushing</CTableHeaderCell>
            <CTableHeaderCell>Passing</CTableHeaderCell>
            <CTableHeaderCell>Tackles</CTableHeaderCell>
            <CTableHeaderCell>Interceptions</CTableHeaderCell>
            <CTableHeaderCell>Touchdowns</CTableHeaderCell>
            {canAdd && <CTableHeaderCell>İşlem</CTableHeaderCell>}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {summaryData.map((item) => (
            <CTableRow key={item._id}>
              <CTableDataCell>{new Date(item.date).toLocaleDateString('tr-TR')}</CTableDataCell>
              <CTableDataCell>{item.opponent}</CTableDataCell>
              <CTableDataCell>
                {item.scoreUs} - {item.scoreOpponent}
              </CTableDataCell>
              <CTableDataCell>{item.totalRushingYards}</CTableDataCell>
              <CTableDataCell>{item.totalPassingYards}</CTableDataCell>
              <CTableDataCell>{item.totalTackles}</CTableDataCell>
              <CTableDataCell>{item.totalInterceptions}</CTableDataCell>
              <CTableDataCell>{item.totalTouchdowns}</CTableDataCell>
              {canAdd && (
                <CTableDataCell>
                  <CButton color="danger" size="sm" onClick={() => handleDelete(item._id)}>
                    Sil
                  </CButton>
                </CTableDataCell>
              )}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* GRAFİK 1: Toplam Yard */}
      <CCard className="mt-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 className="card-title mb-0">Toplam Alınan Mesafe</h4>
              <div className="small text-body-secondary">Rushing + Passing Yard</div>
            </CCol>
          </CRow>
          <div className="mt-4">
            <MatchYardsChart data={summaryData} />
          </div>
        </CCardBody>
      </CCard>

      {/* GRAFİK 2: Skor ve Savunma */}
      <CCard className="mt-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 className="card-title mb-0">Skor ve Savunma</h4>
              <div className="small text-body-secondary">Touchdown, Interception, Tackle</div>
            </CCol>
          </CRow>
          <div className="mt-4">
            <MatchStatChart data={summaryData} />
          </div>
        </CCardBody>
      </CCard>

      {/* MODAL */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Yeni Maç Özeti</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <div className="mb-3">
              <label className="form-label">Maç Seç</label>
              <select
                className="form-control"
                name="matchId"
                value={formData.matchId}
                onChange={handleChange}
                required
              >
                <option value="">-- Seçiniz --</option>
                {matches.map((match) => (
                  <option key={match._id} value={match._id}>
                    {new Date(match.date).toLocaleDateString('tr-TR')} - {match.opponent}
                  </option>
                ))}
              </select>
            </div>

            {[
              'totalRushingYards',
              'totalPassingYards',
              'totalTackles',
              'totalInterceptions',
              'totalTouchdowns',
              'scoreUs',
              'scoreOpponent',
            ].map((field) => (
              <div className="mb-2" key={field}>
                <label className="form-label">{field}</label>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            ))}
          </CModalBody>
          <CModalFooter>
            <CButton type="submit" color="primary">
              Kaydet
            </CButton>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              İptal
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  )
}

export default MatchSummaryPage
