import axios from "axios";
import React, { useState, useEffect } from "react";
import { GoPencil, GoTrashcan } from "react-icons/go";
import DataTable from "react-data-table-component";
import CreateModalGroup from "./group/CreateModalGroup";
import { Blocks } from "react-loader-spinner";
import EditModalGroup from "./group/EditModalGroup";
import ConfirmationDelete from "./utils/ConfirmationDelete";
import ConfirmationChangeStatus from "./utils/ConfirmationChangeStatus";

function setDate(date) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", options);
}

function Group({ theme }) {
  const columns = [
    {
      name: "No",
      selector: (row, idx) => number + idx,
      width: "60px",
    },
    {
      name: "Kode Group",
      selector: (row) => row.codeGroup,
    },
    {
      name: "Image",
      selector: (row) => (
        <>
          <img
            className="py-3 h-[150px] w-auto"
            src={`${process.env.REACT_APP_BACKEND_URL}/files/${row.image}`}
            alt=""
          />
        </>
      ),
    },
    {
      name: "Nama Group",
      selector: (row) => row.label,
    },
    {
      name: "Deskripsi",
      wrap: true,
      selector: (row) => (
        <>
          <p className="break-all">{row.description}</p>
        </>
      ),
    },
    {
      name: "Created At",
      selector: (row) => setDate(row.createdAt),
    },
    {
      name: "Aktif",
      selector: (row) => (
        <div className="flex flex-row justify-center items-center gap-3">
          {row.isActive ? (
            <button
              onClick={() => updateIsActive(row)}
              className="py-2 px-4 rounded-md bg-green-600 text-gray-50"
            >
              Ya
            </button>
          ) : (
            <button
              onClick={() => updateIsActive(row)}
              className="py-2 px-4 rounded-md bg-red-600 text-gray-50"
            >
              tidak
            </button>
          )}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {row._count.antrians < 1 && (
            <div className="flex flex-row gap-2">
              <p
                onClick={() => toggleEdit(row)}
                className="text-md cursor-pointer"
              >
                <GoPencil />
              </p>
              <p
                onClick={() => deleteCounter(row)}
                className="text-md cursor-pointer"
              >
                <GoTrashcan />
              </p>
            </div>
          )}
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
  const [group, setGroup] = useState([]);

  const [showConfirmationStatus, setShowConfirmationStatus] = useState(false);
  const isChangeStatus = false;

  const [groupActive, setGroupActive] = useState(true);
  const toggleConfirmation = () => setShowConfirmationStatus((val) => !val);

  const updateIsActive = (data) => {
    // setShowConfirmationStatus(true);
    toggleConfirmation();
    setGroupId(data.id);
    setGroupActive(!data.isActive);
  };

  const handleConfirmation = async (data) => {
    // console.log(groupActive);
    if (data === true) {
      setShowConfirmationStatus(false);
      const dataToken = localStorage.getItem("token-counter");

      const token = JSON.parse(dataToken);

      const payload = {
        isActive: groupActive,
      };

      try {
        await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/menus/${groupId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token.access_token}` },
          }
        );
        setIsLoading(true);
        setTimeout(() => {
          getCounters();
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.log(error);
        setShowConfirmationStatus(false);
      }
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isDelete = false;
  const [groupId, setGroupId] = useState("");

  const toggleEdit = (data) => {
    setShowEditModal((val) => !val);
    setGroup(data);
    console.log(data);
  };

  const toggleShow = () => setShow((val) => !val);

  const toggleDelete = () => setShowDeleteModal((val) => !val);
  const handleDelete = async (data) => {
    if (data === true) {
      setShowDeleteModal(false);
      const dataToken = localStorage.getItem("token-counter");

      const token = JSON.parse(dataToken);
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/menus/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token.access_token}` },
          }
        );
        setIsLoading(true);
        setTimeout(() => {
          getCounters();
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.log(error);
        setShowDeleteModal(false);
      }
    }
  };
  const deleteCounter = async (data) => {
    setShowDeleteModal(true);
    setGroupId(data.id);
  };

  const getCounters = async () => {
    const data = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/menus`);
    console.log(data.data);
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
    getCounters();
  }, [isDelete]);

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
          <CreateModalGroup
            show={show}
            toggleShow={toggleShow}
            // getCounter={getCounters()}
          />

          <EditModalGroup
            showEditModal={showEditModal}
            toggleEdit={toggleEdit}
            group={group}
          />

          <ConfirmationDelete
            showDeleteModal={showDeleteModal}
            toggleDelete={toggleDelete}
            model="Group"
            id={groupId}
            isDelete={isDelete}
            handleDelete={handleDelete}
          />

          <ConfirmationChangeStatus
            showConfirmationStatus={showConfirmationStatus}
            toggleConfirmation={toggleConfirmation}
            model="Group"
            id={groupId}
            isChangeStatus={isChangeStatus}
            handleConfirmation={handleConfirmation}
          />
          {/* End of modal */}

          <div
            className={`${theme.primary} text-gray-50 flex flex-row justify-between items-center  py-4 rounded-t-lg`}
          >
            <div className="flex-auto flex flex-row justify-center items-center relative">
              <h1 className="text-xl font-bold">Group Menu</h1>
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

export default Group;
