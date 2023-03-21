import axios from "axios";
import React, { useState, useEffect } from "react";
import { GoPencil } from "react-icons/go";
import DataTable from "react-data-table-component";
import { Blocks } from "react-loader-spinner";
import CreateUserModal from "./user/CreateUserModal";
import EditUserModal from "./user/EditUserModal";

function setDate(date) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", options);
}

function Staff({ theme }) {
  const columns = [
    {
      name: "No",
      selector: (row, idx) => number + idx,
      width: "60px",
    },
    {
      name: "name",
      selector: (row) => row.name,
    },
    {
      name: "email",
      selector: (row) => row.email,
    },
    {
      name: "isAdmin",
      selector: (row) => (
        <>
          <p
            className={`${
              row.isAdmin
                ? "bg-green-400 px-6 py-1 text-gray-50 rounded-2xl"
                : "bg-gray-500 px-6 py-1 text-gray-50 rounded-2xl"
            }`}
          >
            {row.isAdmin ? "Admin" : "Petugas"}
          </p>
        </>
      ),
    },
    {
      name: "avatar",
      selector: (row) => (
        <>
          <img
            className="py-3 h-[150px] w-auto"
            src={`${process.env.REACT_APP_BACKEND_URL}/files/${row.avatar}`}
            alt=""
          />
        </>
      ),
    },
    {
      name: "Created At",
      selector: (row) => setDate(row.createdAt),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div className="flex flex-row gap-2">
            <p
              onClick={() => toggleEdit(row)}
              className="text-md cursor-pointer"
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
        paddingLeft: "24px",
        paddingRight: "12px",
        background: "#e8f1ff",
        fontSize: "16px",
        fontWeight: "bolder",
      },
    },
    cells: {
      style: {
        paddingLeft: "24px",
        paddingRight: "12px",
      },
    },
    pagination: {
      style: {
        borderRadius: "0 0 10px 10px",
      },
    },
  };

  const [number, setNumber] = useState(1);
  const [totalDataPage, setTotalDataPage] = useState(10);
  const [counters, setCounters] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [user, setUser] = useState([]);

  const toggleEdit = (data) => {
    setShowEditModal((val) => !val);
    setUser(data);
    console.log(data);
  };

  const toggleShow = () => setShow((val) => !val);

  const getUsers = async () => {
    const dataToken = localStorage.getItem("token-counter");

    const token = JSON.parse(dataToken);
    const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });

    // console.log(data.data);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    setCounters(data.data);
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
      {isLoading ? (
        <>
          <div
            tabindex="-1"
            class="backdrop-blur-sm bg-slate-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex flex-col justify-center items-center"
          >
            <Blocks
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
            />
            <h3>Loading</h3>
          </div>
        </>
      ) : (
        <>
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

          <div
            className={`${theme.primary} text-gray-50 flex flex-row justify-between items-center  py-4 rounded-t-lg`}
          >
            <div className="flex-auto flex flex-row justify-center items-center relative">
              <h1 className="text-xl font-bold">Staff</h1>
              <button
                onClick={toggleShow}
                className="absolute right-3 px-7 py-1 bg-gray-200 text-blue-500 rounded-lg font-semibold hover:bg-gray-600 hover:text-gray-200"
              >
                Tambah
              </button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={counters}
            customStyles={customStyles}
            pagination
            onChangePage={setPage}
            onChangeRowsPerPage={setTotalPage}
          />
        </>
      )}
    </>
  );
}

export default Staff;
