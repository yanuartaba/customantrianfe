import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Ilustrasi1 from './../img/illustrator1.png';
import Bg1 from './../img/bg1.png';
import { VscError } from 'react-icons/vsc';
import axios from 'axios';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Oval } from 'react-loader-spinner';

function LoginCounter({ logoHeader }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [counter, setCounter] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectRoom, setSelectRoom] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [isValid, setIsValid] = useState(false);

  const getListCounter = async () => {
    const listRoom = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/room/all`
    );

    // console.log(listCounter.data);
    setRooms(listRoom.data);
  };

  const handleAdmin = async (email, password) => {
    try {
      const token = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/signin`,
        { email, password }
      );
      const accessToken = token.data.access_token;
      const myProfile = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/me`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (myProfile.data.isAdmin !== true) {
        navigate('/login');
        if (myProfile.data.isAdmin !== true && isAdmin) {
          setErrors('You dont have authorize to access it');
        }
      } else {
        navigate('/admin/home');
        localStorage.setItem('token-counter', JSON.stringify(token.data));
        localStorage.setItem('my-profile', JSON.stringify(myProfile.data));
        localStorage.setItem(
          'super-admin',
          JSON.stringify({ superAdmin: true })
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
    }
  };

  const handlePetugas = async (email, password) => {
    try {
      const token = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/signin`,
        { email, password }
      );
      const accessToken = token.data.access_token;
      const myProfile = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/me`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      localStorage.setItem('token-counter', JSON.stringify(token.data));
      localStorage.setItem('my-profile', JSON.stringify(myProfile.data));
      localStorage.setItem(
        'super-admin',
        JSON.stringify({ superAdmin: false })
      );

      // const dataCounter = JSON.parse(counter);
      const dataGroup = {
        counterId: 1,
        noCounter: 1,
        group: 1,
        groupName: 'Meja Regis',
      };
      localStorage.setItem('login-counter', JSON.stringify(dataGroup));

      const x = rooms.filter((item) => {
        return item.id === parseInt(selectRoom);
      });
      console.log(rooms);
      console.log(selectRoom);
      console.log(x[0]);
      localStorage.setItem('room-control', JSON.stringify(x[0]));
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // try {
    if (isAdmin) {
      await handleAdmin(email, password);
    } else {
      await handlePetugas(email, password);
    }
    // } catch (error) {
    //   console.log(error);
    //   setErrors(error.response.data.message);
    // }
  };

  useEffect(() => {
    getListCounter();
    if (errors.length > 0) {
      setTimeout(() => {
        setErrors([]);
        setIsLoading(false);
      }, 5000);
    }
  }, [errors]);

  return (
    <>
      <div className='grid grid-cols-8 gap-4 w-full h-[100vh] overflow-hidden'>
        <div className='w-full h-full flex flex-col items-center justify-center relative col-span-3'>
          <img src={Bg1} className='absolute left-0 min-h-[100vh]' alt='' />
          <img src={Ilustrasi1} className='z-10 w-[60%] mt-10' alt='' />
          <div className='px-6 py-5 z-10 mt-5'>
            <h1 className='text-3xl text-gray-200 font-semibold px-16'>
              Beberapa klik lagi untuk masuk ke Dashboard Anda.
            </h1>
            <p className='font-semibold text-gray-200 my-3 px-16'>
              Kelola semua data Anda dimenu Adminstrator
            </p>
          </div>
        </div>
        <div className='w-full h-full col-span-5 flex justify-center items-center'>
          <div className='w-full h-[80vh] flex flex-col items-center justify-evenly'>
            <div className='flex flex-col gap-1 text-center'>
              <div className='flex justify-center'>
                <img
                  className='h-[5rem] w-auto mb-5'
                  src={'/logo_loket.png'}
                  alt=''
                />
              </div>
              <h1 className='text-2xl font-semibold'>Selamat Datang di</h1>
              <h1 className='text-4xl font-bold'>Loket Antrian</h1>
              <h1 className='text-2xl font-semibold'>
                Satu aplikasi untuk segala kebutuhanmu{' '}
              </h1>
            </div>
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className='flex flex-col gap-2 w-[65%] my-4 bg-red-200 rounded-md border-red-600 border-2 px-6 py-4'
              >
                <div className='flex gap-3 items-center'>
                  <VscError className='text-2xl font-semibold text-red-600' />
                  <h1 className='text-xl font-semibold text-red-600'>Error</h1>
                </div>

                {errors.length > 0 && (
                  <ul>
                    {' '}
                    {Array.isArray(errors) ? (
                      errors.map((error) => (
                        <li className='text-red-600'>{error}</li>
                      ))
                    ) : (
                      <li className='text-red-600'>{errors}</li>
                    )}
                  </ul>
                )}
              </motion.div>
            )}

            <div className='flex flex-col w-[60%] gap-2 mt-4'>
              <div>
                <label className='block'>
                  <span className='block text-md font-medium text-slate-700'>
                    Email
                  </span>

                  <input
                    type='email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder='masukan email anda'
                    className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white
                                '
                  />
                </label>
              </div>

              <div>
                <label className='block'>
                  <span className='block text-md font-medium text-slate-700'>
                    Password
                  </span>

                  <input
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder='masukan password anda'
                    className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white
                                '
                  />
                </label>
              </div>

              {isAdmin === false && (
                <div>
                  <label className='block'>
                    <span className='block text-md font-medium text-slate-700'>
                      Room
                    </span>
                  </label>
                  <select
                    onChange={(e) => setSelectRoom(e.target.value)}
                    className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white'
                  >
                    <option disabled selected value={''}>
                      Pilih salah satu
                    </option>
                    {rooms &&
                      rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          Admin {room.roomName}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className='block'>
                <div className='flex justify-end gap-2 items-center'>
                  <input
                    type='checkbox'
                    onChange={() => setIsAdmin(!isAdmin)}
                  />
                  <label>Super Admin</label>
                </div>
              </div>

              <button
                disabled={selectRoom === '' && isAdmin === false}
                onClick={handleLogin}
                className='w-full bg-blue-500 text-gray-100 rounded-md py-4 text-xl font-bold tracking-wide mt-4'
              >
                {isLoading === true ? (
                  <div className='w-full flex justify-center'>
                    <Oval
                      height={30}
                      width={30}
                      color='#1c5ddc'
                      wrapperStyle={{}}
                      wrapperClass=''
                      visible={true}
                      ariaLabel='oval-loading'
                      secondaryColor='#deeafe'
                      strokeWidth={4}
                      strokeWidthSecondary={4}
                    />
                  </div>
                ) : (
                  <p>Masuk</p>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginCounter;
