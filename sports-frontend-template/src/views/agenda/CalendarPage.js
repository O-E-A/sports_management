import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import axios from 'axios'

// moment.js için yerelleştirme ayarını Türkçe yapabilirsin (isteğe bağlı)
import 'moment/locale/tr'
moment.locale('tr')

const localizer = momentLocalizer(moment)

const CalendarPage = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      console.log('Veri çekme fonksiyonu (fetchData) çalıştı.')
      try {
        const [matchesRes, trainingsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/matches'),
          axios.get('http://localhost:5000/api/training-plans'),
        ])

        // Maçları işle
        const matchEvents = matchesRes.data.map((match) => {
          const startDate = new Date(match.date)
          // Maçlar 2 saat sürer varsayalım
          const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)

          return {
            title: `Maç: ${match.opponent}`,
            start: startDate,
            end: endDate,
            allDay: false, // Saatleri göstermek için false yap
          }
        })

        // İdmanları işle
        const trainingEvents = trainingsRes.data.map((plan) => {
          const startDate = new Date(plan.date)
          // İdmanlar 90 dakika sürer varsayalım
          const endDate = new Date(startDate.getTime() + 90 * 60 * 1000)

          return {
            title: `İdman: ${plan.coachNote}`,
            start: startDate,
            end: endDate,
            allDay: false, // Saatleri göstermek için false yap
          }
        })

        const combined = [...matchEvents, ...trainingEvents]
        console.log('Oluşturulan Takvim Etkinlikleri:', combined)

        setEvents(combined)
      } catch (err) {
        console.error('Takvim verisi alınırken bir hata oluştu:', err)
      }
    }

    fetchData()
  }, []) // Boş dependency array, sadece ilk render'da çalışmasını sağlar

  return (
    <div className="m-4">
      <h2 className="mb-4">Ajanda</h2>
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
    </div>
  )
}

export default CalendarPage
