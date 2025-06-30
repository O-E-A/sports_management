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

const MatchYardsChart = ({ data }) => {
  const labels = data.map((item) => item.opponent)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Toplam Yard (Rushing + Passing)',
        data: data.map((item) => item.totalRushingYards + item.totalPassingYards),
        borderColor: '#4dbd74',
        backgroundColor: 'rgba(77, 189, 116, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  return <Line data={chartData} height={100} />
}

export default MatchYardsChart
