import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './../Header';
import { GoPencil, GoTrashcan } from 'react-icons/go';
import DataTable from 'react-data-table-component';
import EditModalBatch from './batch/EditModalBatch';

function Kuota() {
  const columns = [
    {
      name: 'Kelompok',
      selector: (row, idx) => 'Batch ' + row.id,
      //   width: '60px',
    },
    {
      name: 'Jam Antrian Mulai',
      selector: (row) => row.waktuMulai,
    },
    {
      name: 'Jam Antrian Selesai',
      selector: (row) => row.waktuSelesai,
    },
    {
      name: 'Jumlah Kuota',
      selector: (row) => row.jumlah,
    },
    {
      name: 'Action',
      cell: (row) => (
        <>
          <div className='flex flex-row gap-2'>
            <p
              onClick={() => toggleEdit(row)}
              className='text-md cursor-pointer flex flex-row gap-2 items-center'
            >
              <GoPencil /> Edit
            </p>
            {/* <p
              //   onClick={() => deleteCounter(row)}
              className='text-md cursor-pointer'
            >
              <GoTrashcan />
            </p> */}
          </div>
        </>
      ),
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

  const [batchs, setBatchs] = useState([]);
  const [batch, setBatch] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const toggleEdit = async (data) => {
    setShowEditModal((val) => !val);
    await setBatch(data);
  };

  useEffect(() => {
    const getBatchs = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/batch`
      );

      console.log(response.data);

      setBatchs(response.data);
    };

    getBatchs();
  }, []);

  return (
    <>
      <Header isAdmin={true} />

      <EditModalBatch
        showEditModal={showEditModal}
        toggleEdit={toggleEdit}
        batch={batch}
      />

      <div className='container-fluid'>
        <div className='row md:p-10 xl:p-20 flex flex-col gap-4 m-auto'>
          <h1 className='text-3xl font-bold'>Kuota</h1>

          <DataTable
            className='w-full'
            columns={columns}
            data={batchs || []}
            customStyles={customStyles}
            pagination
            // onChangePage={setPage}
            // onChangeRowsPerPage={setTotalPage}
          />
        </div>
      </div>
    </>
  );
}

export default Kuota;
