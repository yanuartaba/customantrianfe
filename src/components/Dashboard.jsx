import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoCaretBackCircleSharp,
  IoCaretForwardCircleSharp,
} from 'react-icons/io5';

import { Blocks } from 'react-loader-spinner';

import { BiMessageDots } from 'react-icons/bi';
import { FaPowerOff } from 'react-icons/fa';

// import socketIO from 'socket.io-client';

import Cta from './../sound/airportbell.mp3';
import Bell from '../img/bell.png';
import BellPlus from '../img/bellPlus.png';
import axios from 'axios';
import ListAntrian from './dashboard/ListAntrian';
import Equalizer from './dashboard/Equalizer';
import Header from './Header';

function Dashboard({ theme }) {
  const [isWave, setIsWave] = useState(false);
  const [isCall, setIsCall] = useState(false);
  const [cardVisual, setCardVisual] = useState(true);
  const [listAntrean, setListAntrean] = useState([]);
  const [pulseLabel, setPulseLabel] = useState(['Ready']);
  const [admin, setAdmin] = useState([]);
  const [callText, setCallText] = useState('');
  const [isCallText, setIsCallText] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectTiket, setSelectTiket] = useState(null);

  const navigate = useNavigate();

  let { idRoom } = useParams();

  const playCTA = () => {
    setIsCallText(false);
    setPulseLabel('CTA');
    playAudioLoader();
    const audioElement = document.querySelector('audio');
    audioElement.play();
  };

  const textToSpeech = (text) => {
    setTimeout(() => {
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(text);
      utterThis.lang = 'id-ID';
      utterThis.rate = 0.8;
      synth.speak(utterThis);
      setPulseLabel('Play CTA');
      playAudioLoader();
      utterThis.onend = (event) => {
        setIsCall(false);
        setIsWave(false);
        setPulseLabel('Ready');
        setCallText('');
      };
    }, 1000);
  };

  const finishCta = () => {
    setIsCall(false);
    setIsWave(false);
    setPulseLabel('Ready');

    textToSpeech(callText);
  };

  const attentionCall = () => {
    setIsCallText(true);
  };

  const playAudioLoader = () => {
    setIsWave(true);
    setIsCall(true);
  };

  const setNextTiket = async () => {
    const tiket = await listAntrean.filter((item) => {
      return item.status < 2;
    });
    setSelectTiket(tiket[0]);
    return tiket[0];
  };

  const findIsProsesTiket = async () => {
    const tiket = listAntrean.filter((item) => {
      return item.status === 2;
    });
    return tiket;
  };

  const setFinishProsesTiket = async (tiketId) => {
    const dataToken = localStorage.getItem('token-counter');

    const token = JSON.parse(dataToken);
    const adminRoom = localStorage.getItem('room-control');
    const parseAdmin = await JSON.parse(adminRoom);
    setAdmin(parseAdmin);

    await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/riwayat/${parseAdmin.id}/${tiketId}`,
      {
        isProses: 2,
      },
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }
    );

    const antrian = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/tiket/${tiketId}`,
      {
        status: 1,
        roomId: null,
        isIdle: true,
      },
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }
    );
    return antrian;
  };

  const callTiket = (tiket) => {
    console.log(tiket);
    if (tiket === undefined) {
      alert('Tiket antrian telah selesai');
      setListAntrean([]);
      setSelectTiket(null);
    } else {
      const synth = window.speechSynthesis;

      const utterThis = new SpeechSynthesisUtterance(
        `Nomor Urut ${
          tiket?.nomor < 10 ? '0' + tiket?.nomor : tiket?.nomor
        }, silahkan ke ${admin.roomName}`
      );
      utterThis.lang = 'id-ID';
      utterThis.rate = 0.8;
      synth.speak(utterThis);
      setPulseLabel('Next');
      playAudioLoader();

      utterThis.onend = (event) => {
        setIsCall(false);
        setIsWave(false);
        setPulseLabel('Ready');
      };
    }
  };

  const nextAntrian = async () => {
    if (listAntrean.length < 1) {
      alert('tidak ada antrian');
    } else {
      const prosesTiket = await findIsProsesTiket();
      if (prosesTiket.length < 1) {
        const tiket = await setNextTiket();
        callTiket(tiket);
        await updateTiket(tiket.id, { status: 2 });
        await getListAntrean();
      } else {
        setFinishProsesTiket(prosesTiket[0].id);
        const tiket = await setNextTiket();
        callTiket(tiket);
        if (tiket.id !== undefined) {
          await updateTiket(tiket.id, { status: 2 });
        }
        await getListAntrean();
      }
    }
  };

  const updateTiket = async (tiketId, payload) => {
    const dataToken = localStorage.getItem('token-counter');

    const token = JSON.parse(dataToken);

    const antrian = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/tiket/${tiketId}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }
    );
    return antrian;
  };

  const recallAntrian = async (antrian) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(
      `Perhatian untuk Nomor Urut ${
        selectTiket?.nomor < 10 ? '0' + selectTiket?.nomor : selectTiket?.nomor
      }!. Segera ke ${admin.roomName}`
    );
    utterThis.lang = 'id-ID';
    utterThis.rate = 0.8;
    synth.speak(utterThis);
    setPulseLabel('Recall');
    playAudioLoader();

    utterThis.onend = (event) => {
      setIsCall(false);
      setIsWave(false);
      setPulseLabel('Ready');
    };
  };

  const logout = () => {
    localStorage.setItem('my-profile', null);
    localStorage.setItem('token-counter', null);
    localStorage.setItem('login-counter', null);
    localStorage.setItem('super-admin', null);

    navigate('/login');
  };

  const antrianFinish = async (antrian) => {
    // await updateAntrian(antrian.id, 4);
    // socket.emit('changeStatus', {
    //   msg: 'change status',
    //   id: antrian.id,
    //   statusAntrian: 4,
    // });
  };

  const getListAntrean = async () => {
    const adminRoom = localStorage.getItem('room-control');
    const parseAdmin = await JSON.parse(adminRoom);
    setAdmin(parseAdmin);
    const lists = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/room/${idRoom}`
    );
    setListAntrean(lists.data.tikets);
    const proses = lists.data.tikets.filter((item) => {
      return item.status === 2;
    });
    if (proses.length > 0) {
      setSelectTiket(proses[0]);
    }
  };

  useEffect(() => {
    const getListAntrean = async () => {
      const adminRoom = localStorage.getItem('room-control');
      const parseAdmin = await JSON.parse(adminRoom);
      setAdmin(parseAdmin);
      try {
        const lists = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/room/${idRoom}`
        );
        setListAntrean(lists.data.tikets);
        const proses = lists.data.tikets.filter((item) => {
          return item.status === 2;
        });
        if (proses.length > 0) {
          setSelectTiket(proses[0]);
        }
      } catch (error) {
        setIsLoading(false);
      }

      // console.log(.nomor);
    };
    getListAntrean();
  }, [idRoom]);

  useEffect(() => {
    setInterval(async () => {
      await getListAntrean();
    }, 1000);
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <div
            tabIndex='-1'
            className='backdrop-blur-sm bg-slate-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex flex-col justify-center items-center'
          >
            <Blocks
              visible={true}
              height='80'
              width='80'
              ariaLabel='blocks-loading'
              wrapperStyle={{}}
              wrapperClass='blocks-wrapper'
            />
            <h3>Loading</h3>
          </div>
        </>
      ) : (
        <>
          <Header isAdmin={true} />
          <div className='w-full md:w-[85%] lg:w-[65%] mt-3 flex flex-row justify-center gap-5 m-auto'>
            <div className='w-full h-[33rem] relative rounded-md  bg-blue-100 flex flex-col gap-2 justify-center'>
              <div
                className='absolute top-2 left-2 p-3 bg-slate-50 rounded-lg cursor-pointer'
                onClick={() => logout()}
              >
                <FaPowerOff className='text-md text-red-600 font-bold' />
              </div>

              <h1 className='text-2xl font-bold text-center'>LOKET ANTRIAN</h1>
              <div className='flex flex-row w-full px-16 gap-2 mt-4'>
                <div
                  className={`w-[50%] h-[12rem] ${theme.secondary} border-4 border-white rounded-md flex flex-col items-center justify-center`}
                >
                  {selectTiket && (
                    <motion.h1
                      initial={{ opacity: 0.2, scale: 1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.5,
                        repeat: 5,
                      }}
                      className={`text-8xl font-bold ${theme.textprimary}`}
                    >
                      {selectTiket.nomor < 10
                        ? '0' + selectTiket.nomor
                        : selectTiket.nomor}
                    </motion.h1>
                  )}
                </div>
                <div
                  className={`w-[50%] h-[12rem] ${theme.secondary} border-4 border-white rounded-md flex flex-col items-center justify-center`}
                >
                  <h1 className={`text-2xl font-semibold ${theme.textprimary}`}>
                    {admin.roomName}
                  </h1>
                </div>
              </div>
              <div className='flex flex-row w-full px-16 gap-2 mt-4'>
                <div className='w-[50%] flex flex-col gap-2'>
                  {/* <div className='flex flex-col gap-1'>
                <motion.button
                  whileTap={isWave === false ? { scale: 0.9 } : { scale: 1 }}
                  disabled={isWave}
                  onClick={antrianSkip}
                  className={`"w-full ${
                    isWave === false ? 'bg-red-700' : 'bg-[#D1D4DB]'
                  } py-2 tracking-wide text-2xl font-bold text-gray-100 rounded-md
              ${isWave === false ? 'hover:bg-red-500' : 'hover:bg-[#D1D4DB]'}
                `}
                >
                  <h1 className='text-xl font-semibold text-gray-100'>Skip</h1>
                </motion.button>
              </div> */}

                  <div className='w-full flex flex-row justify-between gap-4'>
                    <audio src={Cta} onEnded={finishCta}></audio>
                    <motion.button
                      whileTap={
                        isWave === false ? { scale: 0.9 } : { scale: 1 }
                      }
                      onClick={attentionCall}
                      disabled={isWave}
                      className={`${
                        isWave === false ? 'bg-green-700' : 'bg-[#D1D4DB]'
                      } w-full flex flex-row items-center justify-center gap-3 py-8 rounded-md ${
                        isWave === false
                          ? 'hover:bg-green-600'
                          : 'hover:bg-[#D1D4DB]'
                      }`}
                    >
                      <BiMessageDots className='text-slate-50 text-xl' />
                      <h1 className='text-xl font-semibold text-gray-100'>
                        Custom Call
                      </h1>
                    </motion.button>
                  </div>

                  <div className='w-full flex flex-row justify-between gap-4'>
                    <motion.button
                      whileTap={
                        isWave === false || selectTiket == null
                          ? { scale: 0.9 }
                          : { scale: 1 }
                      }
                      disabled={isWave || selectTiket === null}
                      onClick={() => recallAntrian(selectTiket)}
                      className={` w-full flex flex-col items-center justify-center py-4 rounded-md ${
                        isWave || selectTiket === null
                          ? 'bg-[#D1D4DB] hover:bg-[#D1D4DB]'
                          : 'bg-blue-500 hover:bg-blue-400'
                      }`}
                    >
                      <img src={BellPlus} width={32} alt='' />
                      <h1 className='text-xl font-semibold text-gray-100'>
                        Recall
                      </h1>
                    </motion.button>
                    <motion.button
                      whileTap={
                        isWave === false ? { scale: 0.9 } : { scale: 1 }
                      }
                      disabled={isWave || listAntrean.length < 1}
                      onClick={nextAntrian}
                      className={` w-full flex flex-col items-center justify-center py-4 rounded-md ${
                        isWave || listAntrean.length < 1
                          ? 'bg-[#D1D4DB] hover:bg-[#D1D4DB]'
                          : ' bg-blue-500 hover:bg-blue-400'
                      }`}
                    >
                      <img src={Bell} width={32} alt='' />
                      <h1 className='text-xl font-semibold text-gray-100'>
                        Call
                      </h1>
                    </motion.button>
                  </div>
                </div>
                <div className='w-[50%] bg-white flex flex-col border-1 border-b-slate-600 rounded-t-lg'>
                  <div
                    className={`bg-blue-500 w-full py-2 tracking-wide font-bold text-gray-100 flex flex-row justify-between items-center px-2 rounded-t-lg`}
                  >
                    <h1 className='text-xl m-auto'>
                      {cardVisual ? 'Audio Visualizer' : 'Antrian'}
                    </h1>
                  </div>
                  {cardVisual && (
                    <div className='w-full h-full flex flex-col justify-center items-center'>
                      {isWave ? (
                        <Equalizer theme={theme} pulseLabel={pulseLabel} />
                      ) : (
                        <p className={`${theme.textprimary} font-semibold`}>
                          {pulseLabel}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ListAntrian
              lists={listAntrean}
              admin={admin}
              theme={theme}
              recallAntrian={recallAntrian}
              antrianFinish={antrianFinish}
            />

            {/* modal calltext */}
            {isCallText && (
              <div
                tabindex='-1'
                class='backdrop-blur-sm bg-slate-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex justify-center items-center'
              >
                <div class='relative w-full h-full max-w-md md:h-auto'>
                  <div class='relative bg-white rounded-lg shadow dark:bg-gray-700 p-5'>
                    <div className='flex flex-col gap-3'>
                      <textarea
                        type='text'
                        placeholder='Ketik pesan anda disini...'
                        maxLength={100}
                        onChange={(e) => setCallText(e.target.value)}
                        className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white
                                '
                      ></textarea>
                    </div>

                    <div className='flex flex-row justify-end gap-4 mt-3'>
                      <button
                        onClick={() => setIsCallText(!isCallText)}
                        className='bg-slate-200 px-5 py-2 text-gray-600 rounded-md hover:bg-slate-500 hover:text-gray-50'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={playCTA}
                        className='hover:bg-blue-400 hover:text-gray-600
                    bg-blue-500 px-5 py-2 text-gray-50 rounded-md'
                      >
                        Play Text
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;
