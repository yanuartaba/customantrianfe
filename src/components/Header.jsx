import React, { useState, useEffect } from 'react';
import { FaUserAstronaut } from 'react-icons/fa';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

function Header({ text, logoHeader, isAdmin }) {
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [time, setTime] = useState(null);
  const [isShowProfile, setIsShowProfile] = useState(false);
  const [isShowSubRoom, setIsShowSubRoom] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(true);
  const [name, setName] = useState('');
  const [rooms, setRooms] = useState([]);

  const getDate = () => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = new Date();
    console.log(date.toLocaleDateString('id-ID', options));
    setDate(date.toLocaleDateString('id-ID', options));
  };

  const refreshClock = () => {
    setTime(new Date().toLocaleTimeString('id-ID'));
  };

  const getTime = () => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  };

  const logout = () => {
    localStorage.setItem('my-profile', null);
    localStorage.setItem('token-counter', null);
    localStorage.setItem('login-counter', null);
    localStorage.setItem('super-admin', null);

    navigate(0);

    navigate('/login');
  };

  const toRoom = (room) => {
    localStorage.setItem('room-control', JSON.stringify(room));

    // navigate(`/admin/room/${room.id}`);
  };

  useEffect(() => {
    // console.log({ logoHeader });
    const timerId = setInterval(refreshClock, 1000);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = new Date();
    // console.log(date.toLocaleDateString("id-ID", options));
    setDate(date.toLocaleDateString('id-ID', options));
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    const superAdmin = JSON.parse(localStorage.getItem('super-admin'));

    setIsSuperAdmin(superAdmin?.superAdmin);
  }, []);

  useEffect(() => {
    const myProfile = JSON.parse(localStorage.getItem('my-profile'));

    setName(myProfile?.name);
  }, []);

  useEffect(() => {
    const getRooms = async () => {
      const token = JSON.parse(localStorage.getItem('token-counter'));
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/room/all`, {
          headers: { Authorization: `Bearer ${token.access_token}` },
        })
        .then((res) => setRooms(res.data));
    };
    getRooms();
  }, []);

  return (
    <>
      <div>
        <nav className='bg-white border-gray-200  shadow-md w-full'>
          <div className='w-full flex flex-wrap items-center justify-between mx-2 p-4'>
            <a href='/admin/home' className='flex items-center'>
              <img
                src={'/logo_loket_full.png'}
                className='h-8 mr-3'
                alt='Flowbite Logo'
              />
            </a>
            <button
              data-collapse-toggle='navbar-multi-level'
              type='button'
              className='inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
              aria-controls='navbar-multi-level'
              aria-expanded='false'
            >
              <span className='sr-only'>Open main menu</span>
              <svg
                className='w-6 h-6'
                aria-hidden='true'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                ></path>
              </svg>
            </button>
            {isAdmin ? (
              <div
                className='hidden w-full md:block md:w-auto mr-[3rem]'
                id='navbar-default'
              >
                <ul className='font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white  items-center'>
                  {isSuperAdmin && (
                    <>
                      <li>
                        <NavLink
                          to='/admin/home'
                          className={`block py-2 pl-3 pr-4 
                          }  hover:text-white text-gray-900 rounded hover:bg-blue-600 `}
                          style={({ isActive, isPending }) => {
                            return {
                              fontWeight: isActive ? 'bold' : '',
                              color: isActive ? '#2F76EC' : '',
                            };
                          }}
                        >
                          Antrian
                        </NavLink>
                      </li>
                      <li>
                        <div
                          onClick={() => {
                            setIsShowSubRoom(!isShowSubRoom);
                            setIsShowProfile(false);
                          }}
                          className='flex flex-row gap-2 justify-center items-center px-4 py-2 cursor-pointer hover:text-white text-gray-900 rounded hover:bg-blue-600 relative'
                        >
                          Room
                          {isShowSubRoom && (
                            <div className='absolute -bottom-[9.8rem] min-w-max bg-slate-200 text-gray-700 flex flex-col gap-2 px-6 py-2 rounded-md text-left z-10'>
                              {rooms &&
                                rooms.map((room) => (
                                  <div
                                    key={room.id}
                                    onClick={() => toRoom(room)}
                                    className='text-sm text-left px-2 hover:text-blue-500 w-full'
                                  >
                                    <a href={`/admin/room/${room.id}`}>
                                      {room.roomName}
                                    </a>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </li>
                      <li>
                        <NavLink
                          to='/admin/kuota'
                          className='block py-2 pl-3 pr-4  hover:text-white text-gray-900 rounded hover:bg-blue-600 '
                          style={({ isActive, isPending }) => {
                            return {
                              fontWeight: isActive ? 'bold' : '',
                              color: isActive ? '#2F76EC' : '',
                            };
                          }}
                        >
                          Kuota
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to='/admin/pengguna'
                          className='block py-2 pl-3 pr-4  hover:text-white text-gray-900 rounded hover:bg-blue-600 '
                          style={({ isActive, isPending }) => {
                            return {
                              fontWeight: isActive ? 'bold' : '',
                              color: isActive ? '#2F76EC' : '',
                            };
                          }}
                        >
                          Pengguna
                        </NavLink>
                      </li>
                    </>
                  )}
                  <li>
                    <NavLink
                      to='/screen'
                      className='block py-2 pl-3 pr-4  hover:text-white text-gray-900 rounded hover:bg-blue-600 '
                      style={({ isActive, isPending }) => {
                        return {
                          fontWeight: isActive ? 'bold' : '',
                          color: isActive ? '#2F76EC' : '',
                        };
                      }}
                      target='_blank'
                    >
                      Public Monitor
                    </NavLink>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        setIsShowProfile(!isShowProfile);
                        setIsShowSubRoom(false);
                      }}
                      className='flex flex-row gap-2 justify-center items-center px-4 py-2 cursor-pointer bg-blue-600 text-gray-50 rounded-md relative'
                    >
                      <FaUserAstronaut />
                      <div className='flex flex-col'>
                        <h3>{name}</h3>
                      </div>

                      {isShowProfile && (
                        <div className='absolute -bottom-[4.75rem] bg-slate-200 text-gray-700 flex flex-col gap-2 px-6 py-2 rounded-md'>
                          <a
                            href='/admin/profile'
                            className='text-sm hover:text-blue-500'
                          >
                            Profile
                          </a>
                          <button
                            onClick={logout}
                            className='text-sm hover:text-blue-500'
                          >
                            logout
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <div className='flex items-center gap-2 mr-[3rem]'>
                <h1 className='text-xl font-semibold'>{date}</h1>
                <h1 className='text-xl font-semibold text-gray-600'>|</h1>
                <h1 className='text-xl font-semibold'>{time}</h1>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

export default Header;
