import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import axios from 'axios';

import { Blocks } from 'react-loader-spinner';
// import socketIO from 'socket.io-client';
import { useEffect } from 'react';
import ScreenBanner from './ScreenBanner';

import Header from './Header';
import ScreenRoom from './ScreenRoom';

function Screen({ theme }) {
  // const socket = socketIO.connect(`${process.env.REACT_APP_BACKEND_URL}`);

  // const [isConnected, setIsConnected] = useState(socket.connected);

  const [activeAntrian, setActiveAntrian] = useState([]);

  const [mejaRegis, setMejaRegis] = useState([]);
  const [activeMejaRegis, setActiveMejaRegis] = useState(null);
  const [listAntrianMejaRegis, setListAntrianMejaRegis] = useState([]);

  const [ruangDokter, setRuangDokter] = useState([]);
  const [activeRuangDokter, setActiveRuangDokter] = useState(null);
  const [listAntrianRuangDokter, setListAntrianRuangDokter] = useState([]);

  const [ruangFoto, setRuangFoto] = useState([]);
  const [activeRuangFoto, setActiveRuangFoto] = useState(null);
  const [listAntrianRuangFoto, setListAntrianRuangFoto] = useState([]);

  const [ruangCuciWajah, setRuangCuciWajah] = useState([]);
  const [activeRuangCuciWajah, setActiveRuangCuciWajah] = useState(null);
  const [listAntrianRuangCuciWajah, setListAntrianRuangCuciWajah] = useState(
    []
  );

  const [ruangAlat, setRuangAlat] = useState([]);
  const [activeRuangAlat, setActiveRuangAlat] = useState(null);
  const [listAntrianRuangAlat, setListAntrianRuangAlat] = useState([]);

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const getAllRoom = async () => {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/room`)
        .then((res) => {
          setRooms(res.data);
        });
    };

    setInterval(async () => {
      await getAllRoom();
    }, 1000);
  }, []);

  return (
    <>
      <Header />

      <div className='w-full h-full'>
        <div className='flex flex-cols-5 gap-1 p-8 w-full h-[84vh]'>
          {rooms &&
            rooms.map((room) => <ScreenRoom key={room.id} room={room} />)}
        </div>
      </div>

      <div className='hidden'>
        <p className='sm bg-lime-500'></p>
        <p className='sm bg-rose-800'></p>
        <p className='sm bg-yellow-700'></p>
        <p className='sm bg-blue-500'></p>
        <p className='sm bg-emerald-700'></p>
      </div>
    </>
  );
}

export default Screen;
