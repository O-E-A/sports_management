// sports-frontend-template\src\views\trainingAttendance\AttendanceList.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CSpinner,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormCheck,
  CFormInput,
} from '@coreui/react'

const TrainingAttendanceList = () => {
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTraining, setSelectedTraining] = useState(null)
  const [participants, setParticipants] = useState([])
  const [attendanceNotes, setAttendanceNotes] = useState({})
  const [viewAttendanceData, setViewAttendanceData] = useState([])
  const [showEntryModal, setShowEntryModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))
  const canEdit = user && (user.role === 'admin' || user.role === 'coach')

  // Tüm idmanları al
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/training-plans')
      .then((res) => setTrainings(res.data))
      .catch((err) => console.error('İdmanlar alınamadı:', err))
      .finally(() => setLoading(false))
  }, [])

  // Oyuncu listesini getir
  const fetchPlayers = async () => {
    const res = await axios.get('http://localhost:5000/api/profiles')
    setParticipants(res.data)
  }

  // Katılımcı seçimi
  const toggleParticipant = (playerId) => {
    const newState = { ...attendanceNotes }
    if (newState[playerId]) {
      delete newState[playerId]
    } else {
      newState[playerId] = ''
    }
    setAttendanceNotes(newState)
  }

  // Not girişi
  const handleNoteChange = (playerId, value) => {
    setAttendanceNotes((prev) => ({ ...prev, [playerId]: value }))
  }

  // Yoklama kaydet
  const submitAttendance = async () => {
    if (!selectedTraining?._id) return

    await axios.put(`http://localhost:5000/api/training-plans/${selectedTraining._id}/attendance`, {
      attendanceNotes,
    })

    setShowEntryModal(false)
    setAttendanceNotes({})
  }

  // Yoklamayı Gör butonu
  const openAttendanceView = async (training) => {
    try {
      const [profilesRes] = await Promise.all([axios.get('http://localhost:5000/api/profiles')])
      const profiles = profilesRes.data

      const notes = training.attendanceNotes || {}
      const participantsWithNames = Object.entries(notes).map(([playerId, note]) => {
        const profile = profiles.find((p) => p._id === playerId)
        const name = profile ? `${profile.firstName} ${profile.lastName}` : playerId
        return { name, note }
      })

      setViewAttendanceData(participantsWithNames)
      setShowViewModal(true)
    } catch (err) {
      console.error('Yoklama görüntüleme hatası:', err)
    }
  }

  return (
    <div>
      <h2>İdman Yoklama Listesi</h2>
      {loading ? (
        <CSpinner color="primary" />
      ) : (
        <CTable striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Tarih</CTableHeaderCell>
              <CTableHeaderCell>Lokasyon</CTableHeaderCell>
              <CTableHeaderCell>Koç Notu</CTableHeaderCell>
              <CTableHeaderCell>Yoklama</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {trainings.map((training) => (
              <CTableRow key={training._id}>
                <CTableDataCell>{new Date(training.date).toLocaleString()}</CTableDataCell>
                <CTableDataCell>{training.location}</CTableDataCell>
                <CTableDataCell>{training.coachNote}</CTableDataCell>
                <CTableDataCell className="d-flex gap-2">
                  {canEdit && (
                    <CButton
                      size="sm"
                      color="primary"
                      onClick={() => {
                        setSelectedTraining(training)
                        fetchPlayers()
                        setShowEntryModal(true)
                      }}
                    >
                      Yoklama Gir
                    </CButton>
                  )}
                  <CButton size="sm" color="secondary" onClick={() => openAttendanceView(training)}>
                    Yoklamayı Gör
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      {/* Giriş Modalı */}
      <CModal visible={showEntryModal} onClose={() => setShowEntryModal(false)}>
        <CModalHeader>
          <CModalTitle>Yoklama Girişi</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {participants.map((player) => (
            <div key={player._id} className="mb-2">
              <CFormCheck
                type="checkbox"
                id={`check-${player._id}`}
                label={`${player.firstName} ${player.lastName}`}
                checked={attendanceNotes[player._id] !== undefined}
                onChange={() => toggleParticipant(player._id)}
              />
              {attendanceNotes[player._id] !== undefined && (
                <CFormInput
                  className="mt-1"
                  placeholder="Not gir (isteğe bağlı)"
                  value={attendanceNotes[player._id]}
                  onChange={(e) => handleNoteChange(player._id, e.target.value)}
                />
              )}
            </div>
          ))}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEntryModal(false)}>
            İptal
          </CButton>
          <CButton color="primary" onClick={submitAttendance}>
            Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Görüntüleme Modalı */}
      <CModal visible={showViewModal} onClose={() => setShowViewModal(false)}>
        <CModalHeader>
          <CModalTitle>Yoklama Detayı</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewAttendanceData && viewAttendanceData.length > 0 ? (
            <ul>
              {viewAttendanceData.map((entry, index) => (
                <li key={index}>
                  {entry.name} — Not: {entry.note || 'Yok'}
                </li>
              ))}
            </ul>
          ) : (
            <p>Bu idman için yoklama bulunmuyor.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => setShowViewModal(false)}>Kapat</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default TrainingAttendanceList
