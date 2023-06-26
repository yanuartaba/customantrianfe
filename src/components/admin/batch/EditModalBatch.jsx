import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { VscError } from 'react-icons/vsc';

function EditModalBatch(props) {
  const { showEditModal, toggleEdit, batch } = props;

  // console.log(batch?.jumlah);

  const [jumlah, setJumlah] = useState(0);
  const [waktuMulai, setWaktuMulai] = useState(null);
  const [waktuSelesai, setWaktuSelesai] = useState(null);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const navigate = useNavigate();

  const updateBatch = async () => {
    const dataToken = localStorage.getItem('token-counter');

    const token = JSON.parse(dataToken);

    // setTime(waktuMulai);

    const payload = {
      jumlah: parseInt(jumlah),
      waktuMulai: setTime(waktuMulai),
      waktuSelesai: setTime(waktuSelesai),
    };

    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/batch/${batch.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }
      );

      toggleEdit(false);
      navigate(0);
    } catch (error) {
      setIsError(true);
      if (error.response.data.message)
        setErrorMessage(error.response.data.message);
      // console.log(error);
    }
  };

  function setTime(time) {
    const today = new Date();
    const res = new Date(today.toDateString() + ' ' + time);
    // console.log(res.toISOString());
    // console.log(time);
    // console.log(new Date(today.toDateString() + ' ' + time));
    return res.toISOString();
  }

  // const setTime = (val) => {
  //   const now = new Date();
  //   const year = now.getFullYear();
  //   const month = now.getMonth() + 1;
  //   const date = now.getDate();
  //   const fullDate = `${year}-${month < 10 ? '0' + month : month}-${date}T`;
  //   console.log(month);
  //   console.log(fullDate);
  //   console.log(now.toISOString());
  //   console.log(val.toLocaleDateString());
  // };

  useEffect(() => {
    setJumlah(batch?.jumlah);
    setWaktuMulai(batch?.waktuMulai);
    setWaktuSelesai(batch?.waktuSelesai);
    // console.log(batch.jumlah);
  }, [batch]);

  return (
    <>
      {showEditModal && (
        <div
          tabIndex='-1'
          className='backdrop-blur-sm bg-slate-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex justify-center items-center'
        >
          <div className='relative w-full h-full max-w-md md:h-auto'>
            <div className='relative bg-white rounded-lg shadow '>
              <button
                type='button'
                onClick={toggleEdit}
                className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center'
                data-modal-hide='popup-modal'
              >
                <svg
                  aria-hidden='true'
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  ></path>
                </svg>
                <span className='sr-only'>Close modal</span>
              </button>
              <h3 className='px-6 pt-6 mt-12'>Edit Batch {batch.id}</h3>

              <div className='flex flex-col gap-4 p-6'>
                {isError && (
                  <div className='flex flex-col bg-red-200 p-3 gap-2'>
                    <div className='flex flex-row gap-3 items-center'>
                      <VscError className='text-xl font-semibold text-red-600' />
                      <h1 className='text-xl font-semibold text-red-600'>
                        Error
                      </h1>
                    </div>
                    <ol className='list-decimal ml-3 text-red-600'>
                      {errorMessage &&
                        errorMessage.map((msg) => <li>{msg}</li>)}
                    </ol>
                  </div>
                )}

                <div className='flex flex-col'>
                  <label>Jumlah</label>
                  <input
                    type='number'
                    placeholder='Input Jumlah Batch'
                    onChange={(e) => setJumlah(e.target.value)}
                    value={jumlah}
                    min={5}
                    max={100}
                    className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white'
                  />
                </div>

                <div className='flex flex-col'>
                  <label>Jam Mulai</label>
                  <input
                    type='time'
                    onChange={(e) => setWaktuMulai(e.target.value)}
                    value={waktuMulai}
                    step={36000}
                    className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white'
                  />
                </div>

                <div className='flex flex-col'>
                  <label>Jam Selesai</label>
                  <input
                    type='time'
                    onChange={(e) => setWaktuSelesai(e.target.value)}
                    value={waktuSelesai}
                    className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white'
                  />
                </div>

                <div className='flex flex-row justify-end gap-4'>
                  <button
                    onClick={() => {
                      toggleEdit();
                      setIsError(false);
                      setErrorMessage([]);
                    }}
                    className='bg-slate-200 px-5 py-2 text-gray-600 rounded-md hover:bg-slate-500 hover:text-gray-50'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateBatch}
                    className='hover:bg-blue-400 hover:text-gray-600
                    bg-blue-500 px-5 py-2 text-gray-50 rounded-md'
                  >
                    Perbaharui
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditModalBatch;
