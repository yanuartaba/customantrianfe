import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart({ summary }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart Total Antrian',
      },
    },
  };

  const [labels, setLabels] = useState([]);
  const [jmlAntrian, setJmlAntrian] = useState([]);
  const data = {
    labels,
    datasets: [
      {
        label: 'Jumlah antrian',
        data: jmlAntrian,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  useEffect(() => {
    const mapSummary = summary?.totalAntrian?.map((item) => {
      return item.label;
    });

    mapSummary?.push('Total');
    setLabels(mapSummary);

    let total = 0;
    const mapDataSummary = summary?.totalAntrian?.map((item) => {
      total = total + item._count.antrians;
      return item._count.antrians;
    });

    mapDataSummary?.push(total);
    setJmlAntrian(mapDataSummary);
  }, [summary]);

  return (
    <Bar
      className='bg-slate-50 p-4 my-2 rounded-md shadow-md'
      options={options}
      data={data}
    />
  );
}

export default BarChart;
