import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoCaretBackCircleSharp,
  IoCaretForwardCircleSharp,
} from 'react-icons/io5';

import { BiMessageDots } from 'react-icons/bi';
import { FaPowerOff } from 'react-icons/fa';

import socketIO from 'socket.io-client';

import Cta from '../sound/Airport_Bell.mp3';
import Bell from '../img/bell.png';
import BellPlus from '../img/bellPlus.png';
import axios from 'axios';
import ListAntrian from './dashboard/ListAntrian';
import Equalizer from './dashboard/Equalizer';
import StatsTotalAntrian from './dashboard/StatsTotalAntrian';

function Dashboard({ theme }) {
  const [isWave, setIsWave] = useState(false);
  const [isCall, setIsCall] = useState(false);
  const [listAntrean, setListAntrean] = useState([]);
  const [selectAntrian, setSelectAntrian] = useState({});
  const [pulseLabel, setPulseLabel] = useState(['Ready']);
  const [admin, setAdmin] = useState([]);
  const [cardVisual, setCardVisual] = useState(true);
  const [callText, setCallText] = useState('');
  const [isCallText, setIsCallText] = useState(false);

  const socket = socketIO.connect(`${process.env.REACT_APP_BACKEND_URL}`);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const navigate = useNavigate();

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

  const getToken = () => {
    const dataToken = localStorage.getItem('token-counter');

    const token = JSON.parse(dataToken);

    return token;
  };

  const getPetugasId = async () => {
    const token = getToken();

    const petugas = await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })
      .then((res) => {
        return res.data.id;
      })
      .catch((error) => console.log(error));
    // console.log(petugas.data.id);
    return petugas;
  };

  const postTask = async (antrianId) => {
    const counter = JSON.parse(localStorage.getItem('login-counter'));
    const petugas = JSON.parse(localStorage.getItem('my-profile'));

    const payload = {
      group: counter.group,
      petugasId: petugas.id,
      counterId: counter.counterId,
      antrianId: antrianId,
    };

    const token = JSON.parse(localStorage.getItem('token-counter'));
    // console.log(token);

    const task = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/tasks`,
      payload,
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }
    );
    return task;
  };

  const nextAntrian = async () => {
    if (Object.keys(selectAntrian).length !== 0) {
      await updateAntrian(selectAntrian.id, 4);
    }
    const newAntrian = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/antrian?group=${admin.group}&listAntrian=false&statusAntrian=1`
    );

    // setSelectAntrian(newAntrian.data[0]);

    if (newAntrian.data.length < 1) {
      alert('tidak ada antrian');
      setSelectAntrian({});
    } else {
      await postTask(newAntrian.data[0].id);
      await updateAntrian(newAntrian.data[0].id, 2).then((res) => {
        setSelectAntrian(res.data);
        // console.log(res);
        const synth = window.speechSynthesis;
        const strNoCounter = addSpace(admin.noCounter);
        const strGroupCounter = admin.groupName;
        // const counterId = admin.counterId;
        // console.log(listAntrean[0].nomor);
        const utterThis = new SpeechSynthesisUtterance(
          `Nomor Urut ${res.data.group}${res.data.nomor}, silahkan ke counter ${strGroupCounter},  ${strNoCounter}`
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

        socket.emit('pingClient', {
          msg: 'ping from client',
          socketID: socket.id,
          id: res.data.id,
          noAntrian: res.data.group + res.data.nomor,
          groupCounter: strGroupCounter,
          noCounter: admin.noCounter,
        });

        socket.emit('changeStatus', {
          msg: 'change status',
          id: res.data.id,
          statusAntrian: 2,
        });
      });
    }

    const localAdmin = localStorage.getItem('login-counter');
    const parseAdmin = JSON.parse(localAdmin);
    setAdmin(parseAdmin);
    const lists = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/antrian?group=${parseAdmin.group}&listAntrian=true&statusAntrian=3`
    );
    setListAntrean(lists.data);
  };

  const updateAntrian = async (idAntrian, val) => {
    const dataToken = localStorage.getItem('token-counter');

    const token = JSON.parse(dataToken);

    const antrian = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/antrian/${idAntrian}`,
      {
        statusAntrian: val,
      },
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }
    );
    return antrian;
  };

  const recallAntrian = async (antrian) => {
    const strGroupCounter = admin.groupName;
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(
      `Perhatian untuk Nomor Urut ${antrian.group} ${antrian.nomor}!. Segera ke counter ${admin.noCounter}`
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
    setSelectAntrian(antrian);
    socket.emit('pingClient', {
      msg: 'ping from client',
      socketID: socket.id,
      id: antrian.id,
      noAntrian: antrian.group + antrian.nomor,
      groupCounter: strGroupCounter,
      noCounter: admin.noCounter,
    });
  };

  const addSpace = (str) => {
    return str.split('').join(', ');
  };

  const logout = () => {
    localStorage.setItem('my-profile', null);
    localStorage.setItem('token-counter', null);
    localStorage.setItem('login-counter', null);

    navigate('/login');
  };

  const antrianFinish = async (antrian) => {
    await updateAntrian(antrian.id, 4);

    socket.emit('changeStatus', {
      msg: 'change status',
      id: antrian.id,
      statusAntrian: 4,
    });

    setSelectAntrian({});
  };

  const antrianSkip = async () => {
    console.log(selectAntrian.id);
    await updateAntrian(selectAntrian.id, 3).then((res) => {
      socket.emit('changeStatus', {
        msg: 'change status',
        id: res.data.id,
        statusAntrian: 3,
      });

      setSelectAntrian({});
    });
  };

  useEffect(() => {
    const getListAntrean = async (group) => {
      const localAdmin = localStorage.getItem('login-counter');
      const parseAdmin = await JSON.parse(localAdmin);
      setAdmin(parseAdmin);
      const lists = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/antrian?group=${parseAdmin.group}&listAntrian=true&statusAntrian=3`
      );
      setListAntrean(lists.data);
    };
    getListAntrean();

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('connect');
    });

    socket.on('statusAntrian', ({ data }) => {
      getListAntrean();
    });

    socket.on('newAntrian', ({ data }) => {
      getListAntrean();
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('disconnect');
    });
  }, []);

  return (
    <div className='w-full md:w-[85%] lg:w-[65%] h-screen flex flex-row justify-center gap-5 mt-20'>
      <div className='w-full h-[35rem] relative rounded-md  bg-blue-100 flex flex-col gap-2 justify-center'>
        <div
          className='absolute top-2 left-2 p-3 bg-slate-50 rounded-lg cursor-pointer'
          onClick={() => logout()}
        >
          <FaPowerOff className='text-md text-red-600 font-bold' />
        </div>

        <h1 className='text-3xl font-bold text-center'>LOKET ANTRIAN</h1>
        <div className='flex flex-row w-full px-16 gap-2 mt-4'>
          <div
            className={`w-[50%] h-[12rem] ${theme.secondary} border-4 border-white rounded-md flex flex-col items-center justify-center`}
          >
            {selectAntrian !== [] && (
              <motion.h1
                initial={{ opacity: 0.2, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  repeat: 5,
                }}
                className={`text-6xl font-bold ${theme.textprimary}`}
              >
                {selectAntrian.group}
                {selectAntrian.nomor}
              </motion.h1>
            )}
          </div>
          <div
            className={`w-[50%] h-[12rem] ${theme.secondary} border-4 border-white rounded-md flex flex-col items-center justify-center`}
          >
            <h1 className={`text-3xl font-semibold ${theme.textprimary}`}>
              {admin.groupName} : {admin.noCounter}
            </h1>
          </div>
        </div>
        <div className='flex flex-row w-full px-16 gap-2 mt-4'>
          <div className='w-[50%] flex flex-col gap-2'>
            <div className='flex flex-col gap-1'>
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
            </div>

            <div className='w-full flex flex-row justify-between gap-4'>
              <audio src={Cta} onEnded={finishCta}></audio>
              <motion.button
                whileTap={isWave === false ? { scale: 0.9 } : { scale: 1 }}
                onClick={attentionCall}
                disabled={isWave}
                className={`${
                  isWave === false ? theme.primary : 'bg-[#D1D4DB]'
                } w-full flex flex-row items-center justify-center gap-3 py-2 rounded-md ${
                  isWave === false
                    ? theme.hoverBgSecondary
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
                  isWave === false && Object.keys(selectAntrian).length > 0
                    ? { scale: 0.9 }
                    : { scale: 1 }
                }
                disabled={isWave || Object.keys(selectAntrian).length < 1}
                onClick={() => recallAntrian(selectAntrian)}
                className={`bg-[#D1D4DB] w-full flex flex-col items-center justify-center py-4 rounded-md ${
                  isWave === false && Object.keys(selectAntrian).length > 0
                    ? 'hover:bg-gray-400'
                    : 'hover:bg-[#D1D4DB]'
                }`}
              >
                <img src={BellPlus} alt='' />
                <h1 className='text-xl font-semibold text-gray-100'>Recall</h1>
              </motion.button>
              <motion.button
                whileTap={isWave === false ? { scale: 0.9 } : { scale: 1 }}
                disabled={isWave}
                onClick={nextAntrian}
                className={`bg-[#D1D4DB] w-full flex flex-col items-center justify-center py-4 rounded-md ${
                  isWave === false ? 'hover:bg-gray-400' : 'hover:bg-[#D1D4DB]'
                }`}
              >
                <img src={Bell} alt='' />
                <h1 className='text-xl font-semibold text-gray-100'>Call</h1>
              </motion.button>
            </div>
          </div>
          <div className='w-[50%] bg-white flex flex-col border-1 border-b-slate-600 rounded-t-lg'>
            <div
              className={`${theme.primary} w-full py-2 tracking-wide font-bold text-gray-100 flex flex-row justify-between items-center px-2 rounded-t-lg`}
            >
              <IoCaretBackCircleSharp
                onClick={() => setCardVisual(!cardVisual)}
                className='text-2xl cursor-pointer'
              />
              <h1 className='text-xl'>
                {cardVisual ? 'Audio Visualizer' : 'Antrian'}
              </h1>
              <IoCaretForwardCircleSharp
                onClick={() => setCardVisual(!cardVisual)}
                className='text-2xl cursor-pointer'
              />
            </div>
            {cardVisual ? (
              <div className='w-full h-full flex flex-col justify-center items-center'>
                {isWave ? (
                  <Equalizer theme={theme} pulseLabel={pulseLabel} />
                ) : (
                  <p className={`${theme.textprimary} font-semibold`}>
                    {pulseLabel}
                  </p>
                )}
              </div>
            ) : (
              <div className='w-full h-[10rem] overflow-y-auto'>
                <StatsTotalAntrian theme={theme} />
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
  );
}

export default Dashboard;
