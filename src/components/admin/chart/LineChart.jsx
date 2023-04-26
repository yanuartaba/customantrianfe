import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Jumlah Antrian Berdasarkan Jenis Counter',
    },
  },
};

function LineChart({ summary }) {
  const [labels, setLabels] = useState([]);
  const [dataLabel, setDataLabel] = useState([]);
  const data = {
    labels,
    datasets: dataLabel,
  };

  useEffect(() => {
    const labelSummary = summary?.dataDetail[0].result?.map((data) => {
      return data.key;
    });
    setLabels(labelSummary);

    const dataLabelSummary = summary?.dataDetail?.map((data) => {
      const color = (opacity) =>
        `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, ${opacity})`;

      data = {
        label: data.menu.label,
        data: data.result?.map((n) => {
          return n._count.antrians;
        }),
        borderColor: color(0.7),
        backgroundColor: color(0.5),
      };
      return data;
    });

    setDataLabel(dataLabelSummary);
  }, [summary]);

  return (
    <Line
      className='bg-slate-50 p-4 my-2 rounded-md shadow-md'
      options={options}
      data={data}
    />
  );
}

export default LineChart;
