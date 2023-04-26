import React, { useState } from 'react';
import {
  MdSpaceDashboard,
  MdCountertops,
  MdSettings,
  MdPermMedia,
  MdGroup,
  MdLogout,
} from 'react-icons/md';
import { FaUserTie } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Sidebar({ theme }) {
  const notActiveClass =
    'flex items-center p-2 text-base font-normal text-gray-50 hover:text-gray-800 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700';

  const activeClass =
    'flex items-center p-2 text-base font-normal text-gray-800 rounded-lg bg-gray-100';

  const [isSetting, setIsSetting] = useState(false);
  const [isProfileLink, setIsProfileLink] = useState(false);
  const profile = JSON.parse(localStorage.getItem('my-profile'));

  const navigate = useNavigate();

  const logout = () => {
    localStorage.setItem('my-profile', null);
    localStorage.setItem('token-counter', null);
    localStorage.setItem('login-counter', null);

    navigate('/login');
  };
  return (
    <>
      <button
        data-drawer-target='sidebar-multi-level-sidebar'
        data-drawer-toggle='sidebar-multi-level-sidebar'
        aria-controls='sidebar-multi-level-sidebar'
        type='button'
        className='inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
      >
        <span className='sr-only'>Open sidebar</span>
        <svg
          className='w-6 h-6'
          aria-hidden='true'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            clipRule='evenodd'
            fillRule='evenodd'
            d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'
          ></path>
        </svg>
      </button>

      <aside
        id='sidebar-multi-level-sidebar'
        className='fixed top-0 left-0 z-40 w-64 pt-[3.2rem] h-screen transition-transform -translate-x-full sm:translate-x-0'
        aria-label='Sidebar'
      >
        <div
          className={`h-full px-3 py-10 overflow-y-auto ${theme.primary} dark:bg-gray-800`}
        >
          <ul className='space-y-1'>
            <li>
              <NavLink
                to='/admin/home'
                className={({ isActive }) =>
                  isActive ? activeClass : notActiveClass
                }
              >
                <MdSpaceDashboard />
                <span className='ml-3 font-semibold'>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/counter'
                className={({ isActive }) =>
                  isActive ? activeClass : notActiveClass
                }
              >
                <MdCountertops />
                <span className='ml-3 font-semibold'>Counter</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/group'
                className={({ isActive }) =>
                  isActive ? activeClass : notActiveClass
                }
              >
                <MdGroup />
                <span className='ml-3 font-semibold'>Group</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/staff'
                className={({ isActive }) =>
                  isActive ? activeClass : notActiveClass
                }
              >
                <FaUserTie />
                <span className='ml-3 font-semibold'>Staff</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/media'
                className={({ isActive }) =>
                  isActive ? activeClass : notActiveClass
                }
              >
                <MdPermMedia />
                <span className='ml-3 font-semibold'>Media</span>
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => {
                  setIsSetting(!isSetting);
                  setIsProfileLink(false);
                }}
                className='flex flex-row w-full items-center p-2 text-base font-normal text-gray-50 hover:text-gray-800 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <MdSettings />
                <span className='ml-3 font-semibold'>Setting</span>
                <div className='absolute right-6'>
                  <svg
                    // sidebar-toggle-item
                    className='w-6 h-6'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                </div>
              </button>
              {isSetting && (
                <ul className='space-y-2'>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? activeClass : notActiveClass
                      }
                      to='/admin/settings/banner'
                    >
                      <span className='ml-9 font-semibold'>Banner</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? activeClass : notActiveClass
                      }
                      to='/admin/settings/theme'
                    >
                      <span className='ml-9 font-semibold'>Theme</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? activeClass : notActiveClass
                      }
                      to='/admin/settings/runningtext'
                    >
                      <span className='ml-9 font-semibold'>Running Text</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? activeClass : notActiveClass
                      }
                      to='/admin/settings/print'
                    >
                      <span className='ml-9 font-semibold'>Print</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? activeClass : notActiveClass
                      }
                      to='/admin/settings/secure'
                    >
                      <span className='ml-9 font-semibold'>Security</span>
                    </NavLink>
                  </li>
                </ul>
              )}

              {/* <div> */}
              {/* <NavLink
                  to="/admin/settings"
                  className={({ isActive }) =>
                    isActive ? activeClass : notActiveClass
                  }
                >
                  <MdSettings />
                  <span className="ml-3 font-semibold">Setting</span>
                </NavLink>
              </div>

              <ul>
                <li>Banner</li>
                <li>asdsad</li>
              </ul> */}
            </li>
          </ul>

          <div className='fixed w-full bottom-7'>
            {isProfileLink && (
              <>
                <div
                  onClick={logout}
                  className='bg-gray-50 w-[90%] flex flex-row justify-between items-center mb-3 p-3 rounded-full shadow-2xl cursor-pointer'
                >
                  <h1 className='font-semibold'>Logout</h1>
                  <MdLogout className='font-bold' />
                </div>
                <NavLink to='/admin/profile'>
                  <div className='bg-gray-50 w-[90%] flex flex-row justify-between items-center mb-3 p-3 rounded-full shadow-2xl cursor-pointer'>
                    <h1 className='font-semibold'>Profile</h1>
                    <CgProfile />
                  </div>
                </NavLink>
              </>
            )}

            <div
              // onMouseEnter={() => setIsProfileLink(true)}
              // onMouseLeave={() => setIsProfileLink(false)}
              onClick={() => {
                setIsProfileLink(!isProfileLink);
                setIsSetting(false);
              }}
              className='bg-gray-50 w-[90%] flex flex-row items-center
              justify-around p-3 rounded-full shadow-2xl cursor-pointer'
            >
              {profile.avatar !== null ? (
                <img
                  className='w-[4rem] h-auto rounded-full'
                  src={`${process.env.REACT_APP_BACKEND_URL}/files/${profile.avatar}`}
                  alt=''
                />
              ) : (
                <></>
              )}

              <div className='flex flex-col justify-center items-center'>
                <h1 className='font-bold'>{profile.name}</h1>
                <p>{profile.isAdmin ? 'Administrator' : 'Petugas'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
