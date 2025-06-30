import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

const MatchStatChart = ({ data }) => {
  const labels = data.map((item) => item.opponent)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Touchdowns',
        data: data.map((item) => item.totalTouchdowns),
        borderColor: '#20a8d8',
        backgroundColor: 'rgba(32, 168, 216, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Interceptions',
        data: data.map((item) => item.totalInterceptions),
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Tackles',
        data: data.map((item) => item.totalTackles),
        borderColor: '#f86c6b',
        backgroundColor: 'rgba(248, 108, 107, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  return <Line data={chartData} height={100} />
}

export default MatchStatChart
