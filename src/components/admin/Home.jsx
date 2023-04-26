import React, { useEffect, useState } from 'react';
import LineChart from './chart/LineChart';
import BarChart from './chart/BarChart';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const columns = [
  {
    name: 'Group',
    selector: (row) => row.group,
  },
  {
    name: 'Loket',
    selector: (row) => row.loket,
  },
  {
    name: 'Jumlah Antrian',
    selector: (row) => row.jumlahAntrian,
  },
  {
    name: 'Antrian Selesai',
    selector: (row) => row.jumlahSelesai,
  },
  {
    name: 'Antrian Tertunda',
    selector: (row) => row.jumlahTertunda,
  },
  {
    name: 'Waktu Penanganan (Menit)',
    selector: (row) => row.waktuPenanganan,
  },
];

const data = [
  {
    id: 1,
    group: 'Teller',
    loket: '01',
    jumlahAntrian: '210',
    jumlahSelesai: '198',
    jumlahTertunda: '12',
    waktuPenanganan: '4.5',
  },
  {
    id: 2,
    group: 'Teller',
    loket: '02',
    jumlahAntrian: '178',
    jumlahSelesai: '172',
    jumlahTertunda: '6',
    waktuPenanganan: '7.2',
  },
  {
    id: 3,
    group: 'Customer Service',
    loket: '01',
    jumlahAntrian: '88',
    jumlahSelesai: '88',
    jumlahTertunda: '0',
    waktuPenanganan: '9.1',
  },
];

const customStyles = {
  headCells: {
    style: {
      paddingLeft: '24px',
      paddingRight: '12px',
      background: '#e8f1ff',
      fontSize: '16px',
      fontWeight: 'bolder',
    },
  },
  cells: {
    style: {
      paddingLeft: '24px',
      paddingRight: '12px',
    },
  },
  pagination: {
    style: {
      borderRadius: '0 0 10px 10px',
    },
  },
};

function Home() {
  const [labelBarChart, setLabelBarChart] = useState([]);
  const [periode, setPeriode] = useState('harian');
  const [periodeTask, setPeriodeTask] = useState('harian');
  const [summary, setSummary] = useState(null);
  const [summaryTask, setSummaryTask] = useState(null);
  console.log('task', summaryTask);
  console.log('data', data);
  useEffect(() => {
    const getSummary = async () => {
      const token = JSON.parse(localStorage.getItem('token-counter'));
      await axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/antrian/summary?periode=${periode}`,
          {
            headers: { Authorization: `Bearer ${token.access_token}` },
          }
        )
        .then((res) => setSummary(res.data));
    };
    getSummary();
  }, [periode]);

  useEffect(() => {
    const getSummaryTask = async () => {
      const token = JSON.parse(localStorage.getItem('token-counter'));
      await axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/tasks/summary?periode=${periodeTask}`,
          {
            headers: { Authorization: `Bearer ${token.access_token}` },
          }
        )
        .then((res) => setSummaryTask(res.data));
    };
    getSummaryTask();
  }, [periodeTask]);
  return (
    <div className='flex flex-col justify-start gap-12'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-row gap-2'>
          <button
            onClick={() => setPeriode('harian')}
            className={`
            ${
              periode === 'harian'
                ? 'bg-slate-600 text-slate-50'
                : 'bg-slate-200'
            }
            rounded-2xl px-8 py-2 bg-slate-200 hover:bg-slate-600 hover:text-gray-50`}
          >
            Harian
          </button>
          <button
            onClick={() => setPeriode('mingguan')}
            className={`
            ${
              periode === 'mingguan'
                ? 'bg-slate-600 text-slate-50'
                : 'bg-slate-200'
            }
            rounded-2xl px-8 py-2 bg-slate-200 hover:bg-slate-600 hover:text-gray-50`}
          >
            Mingguan
          </button>
          <button
            onClick={() => setPeriode('bulanan')}
            className={`
            ${
              periode === 'bulanan'
                ? 'bg-slate-600 text-slate-50'
                : 'bg-slate-200'
            }
            rounded-2xl px-8 py-2 bg-slate-200 hover:bg-slate-600 hover:text-gray-50`}
          >
            Bulanan
          </button>
        </div>

        <div className='flex flex-row gap-4'>
          <div className='w-[50%]'>
            <LineChart summary={summary} />
          </div>
          <div className='w-[50%]'>
            <BarChart summary={summary} />
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-row gap-2'>
          <button
            onClick={() => setPeriodeTask('harian')}
            className={`
            ${
              periodeTask === 'harian'
                ? 'bg-slate-600 text-slate-50'
                : 'bg-slate-200'
            }
            rounded-2xl px-8 py-2 bg-slate-200 hover:bg-slate-600 hover:text-gray-50`}
          >
            Harian
          </button>
          <button
            onClick={() => setPeriodeTask('mingguan')}
            className={`
            ${
              periodeTask === 'mingguan'
                ? 'bg-slate-600 text-slate-50'
                : 'bg-slate-200'
            }
            rounded-2xl px-8 py-2 bg-slate-200 hover:bg-slate-600 hover:text-gray-50`}
          >
            Mingguan
          </button>
        </div>

        <div className='flex flex-col'>
          <DataTable
            columns={columns}
            data={summaryTask ? summaryTask : data}
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
