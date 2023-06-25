import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { GoPencil } from 'react-icons/go';
import DataTable from 'react-data-table-component';
import { Blocks } from 'react-loader-spinner';
import CreateUserModal from './user/CreateUserModal';
import EditUserModal from './user/EditUserModal';
import Header from '../Header';

function setDate(date) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', options);
}

function Staff() {
  const columns = [
    {
      name: 'No',
      selector: (row, idx) => number + idx,
      width: '60px',
    },
    {
      name: 'name',
      selector: (row) => row.name,
    },
    {
      name: 'email',
      selector: (row) => row.email,
    },
    {
      name: 'isAdmin',
      selector: (row) => (
        <>
          <p
            className={`${
              row.isAdmin
                ? 'bg-green-500 px-6 py-1 text-gray-50 rounded-2xl'
                : 'bg-gray-500 px-6 py-1 text-gray-50 rounded-2xl'
            }`}
          >
            {row.isAdmin ? 'Super Admin' : 'Admin Room'}
          </p>
        </>
      ),
    },
    {
      name: 'Created At',
      selector: (row) => setDate(row.createdAt),
    },
    {
      name: 'Action',
      cell: (row) => (
        <>
          <div className='flex flex-row gap-2'>
            <p
              onClick={() => toggleEdit(row)}
              className='text-md cursor-pointer'
            >
              <GoPencil />
            </p>
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

  const [number, setNumber] = useState(1);
  const [totalDataPage, setTotalDataPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [user, setUser] = useState([]);

  const toggleEdit = (data) => {
    setShowEditModal((val) => !val);
    setUser(data);
    console.log(data);
  };

  const toggleShow = () => setShow((val) => !val);

  const getUsers = async () => {
    const dataToken = localStorage.getItem('token-counter');

    const token = JSON.parse(dataToken);
    const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });

    setUsers(data.data);
  };

  const setPage = (x, y) => {
    const firstNumber = totalDataPage * (x - 1) + 1;
    setNumber(firstNumber);
  };

  const setTotalPage = (x, y) => {
    setTotalDataPage(x);
  };
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Header isAdmin={true} />

      <div className='container-fluid'>
        <div className='row md:p-10 xl:p-20 flex flex-col gap-4 m-auto'>
          <div className='flex flex-row justify-between'>
            <h1 className='text-3xl font-bold'>Staff</h1>
            <button
              onClick={toggleShow}
              className='px-7 py-1 bg-blue-600 text-gray-50 rounded-lg font-semibold hover:bg-blue-500 hover:text-gray-200'
            >
              Tambah
            </button>
          </div>

          <DataTable
            columns={columns}
            data={users}
            customStyles={customStyles}
            pagination
            onChangePage={setPage}
            onChangeRowsPerPage={setTotalPage}
          />
        </div>
      </div>

      {/* Modal */}
      <CreateUserModal
        show={show}
        toggleShow={toggleShow}
        // getCounter={getUsers()}
      />

      <EditUserModal
        showEditModal={showEditModal}
        toggleEdit={toggleEdit}
        user={user}
      />

      {/* End of modal */}
    </>
  );
}

export default Staff;
