import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import axios from 'axios'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CFormLabel,
} from '@coreui/react'

import 'moment/locale/tr'
moment.locale('tr')

const localizer = momentLocalizer(moment)

const CalendarPage = () => {
  const [events, setEvents] = useState([])
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [showTrainingModal, setShowTrainingModal] = useState(false)

  const [matchData, setMatchData] = useState({ date: '', location: '', opponent: '', note: '' })
  const [trainingData, setTrainingData] = useState({ date: '', location: '', coachNote: '' })

  const user = JSON.parse(localStorage.getItem('user'))
  const canEdit = user && (user.role === 'admin' || user.role === 'coach')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesRes, trainingsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/matches'),
          axios.get('http://localhost:5000/api/training-plans'),
        ])

        const matchEvents = matchesRes.data.map((match) => {
          const startDate = new Date(match.date)
          const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)
          return {
            title: `Maç: ${match.opponent}${match.note ? ` (${match.note})` : ''}`,
            start: startDate,
            end: endDate,
            allDay: false,
          }
        })

        const trainingEvents = trainingsRes.data.map((plan) => {
          const startDate = new Date(plan.date)
          const endDate = new Date(startDate.getTime() + 90 * 60 * 1000)
          return {
            title: `İdman: ${plan.coachNote}`,
            start: startDate,
            end: endDate,
            allDay: false,
          }
        })

        setEvents([...matchEvents, ...trainingEvents])
      } catch (err) {
        console.error('Takvim verisi alınırken hata:', err)
      }
    }

    fetchData()
  }, [])

  const handleMatchSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/matches', matchData)
      setShowMatchModal(false)
      window.location.reload()
    } catch (err) {
      console.error('Maç ekleme hatası:', err)
    }
  }

  const handleTrainingSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/training-plans', trainingData)
      setShowTrainingModal(false)
      window.location.reload()
    } catch (err) {
      console.error('İdman ekleme hatası:', err)
    }
  }

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Ajanda</h2>
        {canEdit && (
          <div className="d-flex gap-2">
            <CButton color="primary" onClick={() => setShowMatchModal(true)}>
              Maç Ekle
            </CButton>
            <CButton color="success" onClick={() => setShowTrainingModal(true)}>
              İdman Ekle
            </CButton>
          </div>
        )}
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        messages={{
          next: 'İleri',
          previous: 'Geri',
          today: 'Bugün',
          month: 'Ay',
          week: 'Hafta',
          day: 'Gün',
          agenda: 'Ajanda',
          date: 'Tarih',
          time: 'Saat',
          event: 'Etkinlik',
        }}
      />

      {/* Maç Ekle Modalı */}
      <CModal visible={showMatchModal} onClose={() => setShowMatchModal(false)}>
        <CModalHeader>
          <CModalTitle>Maç Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Tarih</CFormLabel>
          <CFormInput
            type="datetime-local"
            onChange={(e) => setMatchData({ ...matchData, date: e.target.value })}
          />
          <CFormLabel className="mt-2">Lokasyon</CFormLabel>
          <CFormInput onChange={(e) => setMatchData({ ...matchData, location: e.target.value })} />
          <CFormLabel className="mt-2">Rakip</CFormLabel>
          <CFormInput onChange={(e) => setMatchData({ ...matchData, opponent: e.target.value })} />
          <CFormLabel className="mt-2">Not</CFormLabel>
          <CFormInput onChange={(e) => setMatchData({ ...matchData, note: e.target.value })} />
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => setShowMatchModal(false)}>İptal</CButton>
          <CButton color="primary" onClick={handleMatchSubmit}>
            Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      {/* İdman Ekle Modalı */}
      <CModal visible={showTrainingModal} onClose={() => setShowTrainingModal(false)}>
        <CModalHeader>
          <CModalTitle>İdman Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Tarih</CFormLabel>
          <CFormInput
            type="datetime-local"
            onChange={(e) => setTrainingData({ ...trainingData, date: e.target.value })}
          />
          <CFormLabel className="mt-2">Lokasyon</CFormLabel>
          <CFormInput
            onChange={(e) => setTrainingData({ ...trainingData, location: e.target.value })}
          />
          <CFormLabel className="mt-2">Koç Notu</CFormLabel>
          <CFormInput
            onChange={(e) => setTrainingData({ ...trainingData, coachNote: e.target.value })}
          />
        </CModalBody>
        <CModalFooter>
          <CButton onClick={() => setShowTrainingModal(false)}>İptal</CButton>
          <CButton color="success" onClick={handleTrainingSubmit}>
            Kaydet
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default CalendarPage
