import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { VscError } from 'react-icons/vsc';
import { motion } from 'framer-motion';
import ModalInfo from './riwayat/ModalInfo';

function Home() {
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rooms, setRooms] = useState([]);
  const [date, setDate] = useState('');
  const [tikets, setTikets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectTiket, SetSelectTiket] = useState(null);
  const [canCancel, setCanCancel] = useState(false);
  const [riwayat, setRiwayats] = useState([]);
  const [selectRoom, SetSelectRoom] = useState(null);
  const [time, setTime] = useState(null);

  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const HandleNewAntrian = async (e) => {
    e.preventDefault();

    const dataToken = localStorage.getItem('token-counter');

    const token = JSON.parse(dataToken);

    const x = await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/tiket`, [], {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })
      .catch((error) => {
        setIsError(true);
        setErrorMsg(error.response.data.message);
        setTimeout(() => {
          setIsError(false);
        }, 5000);
      });

    console.log(await x.data);

    let tikeNumber = await x.data.nomor;
    setTikets((tikets) => [...tikets, x.data]);
    // console.log(this.no);

    let jam =
      'Jam :' +
      new Date(await x.data.createdAt).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    var win = window.open('', '_blank');
    var docDefinition = {
      content: [
        {
          text: 'Loket Antrian',
          fontSize: 48,
          alignment: 'center',
          margin: [10, 0, 10, 0],
        },
        {
          text: '--------------------------------------------------------',
          fontSize: 32,
          alignment: 'center',
          margin: [10, 0, 10, 0],
        },
        {
          text: tikeNumber < 10 ? '0' + tikeNumber : tikeNumber,
          fontSize: 148,
          alignment: 'center',
          margin: [40, 0, 40, 0],
        },
        {
          text: '--------------------------------------------------------',
          fontSize: 32,
          alignment: 'center',
          margin: [10, 0, 10, 0],
        },
        {
          text: date,
          fontSize: 32,
          alignment: 'center',
        },
        {
          text: jam,
          fontSize: 32,
          alignment: 'center',
        },
        {
          text: 'silahkan menunggu antrian',
          fontSize: 32,
          alignment: 'center',
        },
      ],
      superMargin: {
        margin: [10, 0, 10, 0],
        fontSize: 15,
      },
    };

    // await getAllTiket();

    pdfMake.createPdf(docDefinition).print({}, win);
    setTimeout(() => {
      win.close();
    }, 5000);
  };

  const getAllTiket = async () => {
    const token = JSON.parse(localStorage.getItem('token-counter'));
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/tiket/batch`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })
      .then((res) => setTikets(res.data));
  };

  const getRooms = async () => {
    const token = JSON.parse(localStorage.getItem('token-counter'));
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/room`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })
      .then((res) => setRooms(res.data));
  };

  const toggleShow = () => setShowModal((val) => !val);
  const selectedTiket = (tiket) => {
    // console.log(tiket.id);
    getRiwayatTiket(tiket.id);
    setShowModal(true);
    SetSelectTiket(tiket);
    setCanCancel(false);
  };

  const getRiwayatTiket = async (id) => {
    const dataToken = localStorage.getItem('token-counter');

    const token = JSON.parse(dataToken);
    const datas = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/tiket/${id}`,
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }
    );

    setRiwayats(datas.data);
  };

  const cancelRiwayat = (tiket) => {
    getRiwayatTiket(tiket.id);
    setShowModal(true);
    SetSelectTiket(tiket);
    setCanCancel(true);
  };

  useEffect(() => {
    const getRooms = async () => {
      const token = JSON.parse(localStorage.getItem('token-counter'));
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/room`, {
          headers: { Authorization: `Bearer ${token.access_token}` },
        })
        .then((res) => setRooms(res.data));
    };
    getRooms();
  }, []);

  const refreshClock = () => {
    setTime(new Date().toLocaleTimeString('id-ID'));
  };

  const getTime = () => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  };

  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    const date = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setDate(date.toLocaleDateString('id-ID', options));

    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    const getAllTiket = async () => {
      const token = JSON.parse(localStorage.getItem('token-counter'));
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/tiket/batch`, {
          headers: { Authorization: `Bearer ${token.access_token}` },
        })
        .then((res) => setTikets(res.data));
    };
    getAllTiket();
  }, []);

  useEffect(() => {
    setInterval(async () => {
      await getAllTiket();
      await getRooms();
    }, 1000);
  }, []);

  return (
    <>
      <div className='container-fluid  overflow-hidden m-0 relative'>
        <Header isAdmin={true} />
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className='fixed top-[45%] left-[150px] flex flex-col gap-2 w-[50%] my-4 bg-red-200 rounded-md border-red-600 border-2 px-6 py-4 z-500'
          >
            <div className='flex gap-3 items-center'>
              <VscError className='text-2xl font-semibold text-red-600' />
              <h1 className='text-xl font-semibold text-red-600'>Error</h1>
            </div>
            <h1>{errorMsg}</h1>
          </motion.div>
        )}
        <div className='flex flex-row h-[84vh]'>
          <div className='basis-2/3  p-5'>
            <div className='flex flex-col h-full gap-4'>
              <div className='flex flex-col'>
                <h1 className='text-xl font-semibold'>Tiket Antrian</h1>
                <div className='flex flex-col'>
                  <div className='h-[38vh] w-full bg-[#95bbfa] grid grid-cols-8 gap-4 p-10 overflow-y-auto rounded-t-lg'>
                    {/* looping tiket */}
                    {tikets &&
                      tikets.map((tiket) => (
                        <motion.div
                          key={tiket.id}
                          whileTap={{ scale: 0.9 }}
                          className={`w-full h-full row-span-1 ${
                            tiket.status === 1 ? 'flex' : 'hidden'
                          }  justify-center items-center`}
                        >
                          <button
                            onClick={() => selectedTiket(tiket)}
                            className={`p-4 rounded-md ${
                              tiket.isIdle ? 'bg-gray-200' : 'bg-[#FFCDAC]'
                            }`}
                            disabled={!tiket.isIdle}
                          >
                            <h1 className='text-3xl font-bold'>
                              {tiket.nomor < 10
                                ? '0' + tiket.nomor
                                : tiket.nomor}
                            </h1>
                          </button>
                        </motion.div>
                      ))}
                    {/* End of looping tiket */}
                  </div>
                  <button
                    onClick={HandleNewAntrian}
                    className='w-full py-3 bg-[#E7EFFC] text-xl font-bold rounded-b-lg border border-[#95BBFA] '
                  >
                    Cetak Tiket
                  </button>
                </div>
              </div>

              <div className='flex flex-col'>
                <h1 className='text-xl font-semibold'>Tiket Selesai</h1>
                <div className='h-[24vh] w-full bg-[#95bbfa] grid grid-cols-8 gap-4 p-10 overflow-y-auto rounded-lg'>
                  {/* looping tiket */}
                  {tikets &&
                    tikets.map((tiket) => (
                      <motion.div
                        key={tiket.id}
                        whileTap={{ scale: 0.9 }}
                        className={`w-full h-full row-span-1 ${
                          tiket.status === 3 ? 'flex' : 'hidden'
                        }  justify-center items-center`}
                      >
                        <button
                          onClick={() => selectedTiket(tiket)}
                          className={`p-4 rounded-md bg-green-300`}
                          // disabled={true}
                        >
                          <h1 className='text-3xl font-bold'>
                            {tiket.nomor < 10 ? '0' + tiket.nomor : tiket.nomor}
                          </h1>
                        </button>
                      </motion.div>
                    ))}
                  {/* End of looping tiket */}
                </div>
              </div>
            </div>
          </div>
          <div className='basis-1/3  p-5'>
            <div className='flex flex-col'>
              <div className='flex flex-row justify-between'>
                <h1 className='text-xl font-semibold'>Tiket Proses</h1>
                <div className='flex flex-row gap-2 font-bold'>
                  {date} : {time}
                </div>
              </div>

              <div className='h-[78vh] w-full bg-[#95bbfa] p-3 overflow-y-auto rounded-t-lg'>
                <div className='grid grid-cols-2 gap-4 w-full'>
                  {rooms &&
                    rooms.map((room) => (
                      <div
                        key={room.id}
                        className='flex flex-col col-span-1 h-[23vh] bg-[#FFFFFF] rounded-md'
                      >
                        <div
                          className={`${room.color} text-gray-50 w-full py-1 flex flex-col justify-center items-center rounded-t-md`}
                        >
                          <h1 className='text-md font-semibold'>
                            {room.roomName}
                          </h1>
                        </div>
                        <div className='grid grid-cols-4 gap-2 p-2 overflow-y-auto'>
                          {room.tikets.length > 0 &&
                            room.tikets.map((tiket) => (
                              <motion.button
                                key={tiket.id}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => cancelRiwayat(tiket)}
                                className={`${
                                  tiket.status === 2
                                    ? 'bg-[#FFCDAC]'
                                    : 'bg-[#E7F0FF]'
                                } p-1 col-span-1 flex flex-col justify-center items-center  rounded-md`}
                                disabled={tiket.status === 2}
                              >
                                <h1 className='text-md font-semibold'>
                                  {tiket.nomor < 10
                                    ? '0' + tiket.nomor
                                    : tiket.nomor}
                                </h1>
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    ))}
                  <div className='flex flex-col col-span-1 h-[23vh] '>
                    <img
                      src={'/illustrasi1.png'}
                      className='h-full'
                      alt='Flowbite Logo'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='hidden'>
        <p className='sm bg-lime-500'></p>
        <p className='sm bg-rose-800'></p>
        <p className='sm bg-yellow-700'></p>
        <p className='sm bg-blue-500'></p>
        <p className='sm bg-emerald-700'></p>
      </div>

      <ModalInfo
        show={showModal}
        toggleShow={toggleShow}
        selectTiket={selectTiket}
        canCancel={canCancel}
        riwayat={riwayat}
        getRooms={getRooms}
        getAllTiket={getAllTiket}
        selectRoom={selectRoom}
      />
    </>
  );
}

export default Home;
