import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VscError } from 'react-icons/vsc';
import { AiFillCheckCircle } from 'react-icons/ai';
// import { FaCircleCheck } from 'react-icons/fa';

function ModalInfo(props) {
  const [rooms, setRooms] = useState([]);
  const [selectRoom, SetSelectRoom] = useState(null);
  const [canSave, setCanSave] = useState(false);
  const [errors, setErrors] = useState('');

  const navigate = useNavigate();

  // console.log();
  const attachTiket = async () => {
    if (selectRoom < 6) {
      await toTheRoom();
    } else if (selectRoom <= 6) {
      await cancelRoom();
    } else {
      await finishTiket();
    }
  };

  const toTheRoom = async () => {
    const dataToken = localStorage.getItem('token-counter');

    const token = JSON.parse(dataToken);

    const payload = {
      roomId: parseInt(selectRoom),
      tiketId: props.selectTiket.id,
      isProses: 1,
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/riwayat`,
        payload,
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }
      );

      const jumlahTiket = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/room/${parseInt(selectRoom)}`
      );

      const payloadTiket = {
        roomId: parseInt(selectRoom),
        isIdle: false,
        noUrutan:
          jumlahTiket.data.tikets.length > 0
            ? jumlahTiket.data.tikets[jumlahTiket.data.tikets.length - 1]
                .noUrutan + 1
            : 1,
      };
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/tiket/${props.selectTiket.id}`,
        payloadTiket,
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }
      );

      toggleShow(false);
      props.getRooms();
      props.getAllTiket();
      // navigate(0);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
    }
  };

  const cancelRoom = async () => {
    const dataToken = localStorage.getItem('token-counter');

    const token = JSON.parse(dataToken);

    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/riwayat/${props.selectTiket.roomId}/${props.selectTiket.id}`,
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }
      );

      const payloadTiket = {
        roomId: null,
        isIdle: true,
        status: 1,
      };
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/tiket/${props.selectTiket.id}`,
        payloadTiket,
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }
      );

      toggleShow(false);
      props.getRooms();
      props.getAllTiket();
      // navigate(0);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
    }
  };

  const finishTiket = async () => {
    const dataToken = localStorage.getItem('token-counter');

    const token = JSON.parse(dataToken);

    try {
      const payloadTiket = {
        roomId: null,
        isIdle: false,
        status: 3,
      };
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/tiket/${props.selectTiket.id}`,
        payloadTiket,
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }
      );

      toggleShow(false);
      props.getRooms();
      props.getAllTiket();
      // navigate(0);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
    }
  };

  useEffect(() => {
    const getRooms = async () => {
      const dataToken = localStorage.getItem('token-counter');

      const token = JSON.parse(dataToken);
      const datas = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/room`,
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }
      );

      setRooms(datas.data);
    };
    getRooms();
  }, []);

  useEffect(() => {
    // const getRiwayatTiket = async () => {
    //   const dataToken = localStorage.getItem('token-counter');
    //   const token = JSON.parse(dataToken);
    //   const datas = await axios.get(
    //     `${process.env.REACT_APP_BACKEND_URL}/tiket/${props.selectTiket.id}`,
    //     {
    //       headers: { Authorization: `Bearer ${token.access_token}` },
    //     }
    //   );
    //   setRiwayats(datas.data);
    // };
    // getRiwayatTiket();
  });

  const { show, toggleShow } = props;

  return (
    <>
      {show && (
        <div
          tabIndex='-1'
          className='backdrop-blur-sm bg-slate-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex justify-center items-center'
        >
          <div className='relative w-full h-full max-w-[60rem] md:h-auto'>
            <div className='relative bg-white rounded-lg shadow '>
              <div className='flex flex-row justify-between items-center bg-[#E9E9E9] p-3'>
                <button
                  type='button'
                  onClick={toggleShow}
                  className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center '
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

                <h3 className='text-black font-semibold text-2xl'>
                  Detail Tiket
                </h3>
              </div>

              <div className='grid grid-cols-2 gap-3 divide-x divide-slate-600 p-2'>
                <div className='p-3'>
                  <h1 className='text-xl'>Pindah Tiket</h1>
                  <p className='my-3'>Apakah anda yakin memindahkan tiket ?</p>

                  <select
                    onChange={(e) => SetSelectRoom(e.target.value)}
                    className='w-full p-3 rounded border-2 border-gray-800 shadow-md'
                    name=''
                    id=''
                  >
                    <option value='' selected disabled>
                      Pilih Salah Satu
                    </option>
                    {rooms &&
                      rooms.map((room) => (
                        <option
                          key={room.id}
                          value={room.id}
                          disabled={props.canCancel}
                        >
                          {room.roomName}
                        </option>
                      ))}

                    <option value='6' disabled={!props.canCancel}>
                      Ruang Tunggu
                    </option>
                    <option value='7' disabled={props.canCancel}>
                      Tiket Selesai
                    </option>
                  </select>

                  <div className='flex flex-row justify-end gap-4 mt-10'>
                    <button
                      onClick={toggleShow}
                      className='bg-slate-100 py-2 font-semibold px-6 rounded shadow-md'
                    >
                      Batal
                    </button>
                    <button
                      onClick={attachTiket}
                      className='bg-[#3980F6] text-slate-50 font-semibold py-2 px-6 rounded shadow-md'
                      disabled={props.selectTiket.status === 3}
                    >
                      Kirim
                    </button>
                  </div>
                </div>
                <div className='py-3 px-8'>
                  <h1 className='text-xl'>Riwayat Tiket</h1>
                  <p className='pt-3 pb-[1.75rem]'>
                    Perpindahan Riwayat Tiket Nomer{' '}
                    {props.selectTiket.nomor < 10
                      ? '0' + props.selectTiket.nomor
                      : props.selectTiket.nomor}
                  </p>
                  <div className='grid grid-rows-8'>
                    {props.riwayat &&
                      props.riwayat.map((item) => (
                        <div
                          key={item.riwayatId}
                          className='flex flex-row relative border-l-2 border-[#2457C5] pb-4'
                        >
                          <img
                            src={'/tick2.jpg'}
                            className='w-5 h-5 absolute top-0 -left-[12px] z-50'
                            alt=''
                          />
                          <div className='w-full bg-[#1E90FF] text-slate-50 flex flex-row justify-between items-center ml-6 p-3 rounded'>
                            <h1 className='font-semibold text-xl'>
                              {item.room.roomName}
                            </h1>
                            <h1>{item.durasi}</h1>
                          </div>
                        </div>
                      ))}
                    {props.selectTiket.status === 3 && (
                      <div className='flex flex-row relative border-l-2 border-[#2457C5]'>
                        <img
                          src={'/tick2-green.jpg'}
                          className='w-5 h-5 absolute bottom-0 -left-[12px] z-50'
                          alt=''
                        />
                        <div className='w-full bg-[#15c95a] text-slate-50 flex flex-row justify-between items-center ml-6 p-3 rounded'>
                          <div className='flex flex-col'>
                            <h1 className='font-semibold text-xl'>
                              Tiket Selesai
                            </h1>
                            <p className='text-sm'>
                              {props?.riwayat[0]?.durasiAll}
                            </p>
                          </div>
                          <h1>
                            Jam:{' '}
                            {new Date(
                              props.selectTiket.updatedAt
                            ).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </h1>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalInfo;
