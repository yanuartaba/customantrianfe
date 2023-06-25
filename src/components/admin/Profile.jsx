import React, { useState, useRef, useEffect } from 'react';
import { Blocks } from 'react-loader-spinner';
import { GoPencil } from 'react-icons/go';
import { RiEyeFill, RiEyeCloseLine } from 'react-icons/ri';
import axios from 'axios';
import { VscError } from 'react-icons/vsc';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

function Profile({ theme }) {
  const navigate = useNavigate();
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null);

  const [errors, setErrors] = useState([]);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    // const profile = JSON.parse(localStorage.getItem("my-profile"));

    const getProfile = async () => {
      const dataToken = localStorage.getItem('token-counter');

      const token = JSON.parse(dataToken);

      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token.access_token}` },
        })
        .then((res) => {
          setProfile(res.data);
          setName(res.data.name);
          setUserId(res.data.id);
        });
    };
    getProfile();
  }, []);
  const passwordInput = useRef();
  const confirmPasswordInput = useRef();

  const showTextPassword = () => {
    setIsShowPassword(!isShowPassword);
    if (isShowPassword !== true) {
      passwordInput.current.type = 'text';
    } else {
      passwordInput.current.type = 'password';
    }
  };

  const showTextConfirmPassword = () => {
    setIsShowConfirmPassword(!isShowConfirmPassword);
    if (isShowConfirmPassword !== true) {
      confirmPasswordInput.current.type = 'text';
    } else {
      confirmPasswordInput.current.type = 'password';
    }
  };

  const handleUpdateProfile = () => {
    if (isChangePassword) {
      updateProfile({
        name: name,
        password: password,
        confirmation_password: confirmationPassword,
      });
    } else {
      updateProfile({
        name: name,
      });
    }
  };

  const updateProfile = async ({ name, password, confirmation_password }) => {
    const dataToken = localStorage.getItem('token-counter');

    const token = JSON.parse(dataToken);

    const payload = {
      name: name,
      password: password,
      confirmation_password: confirmation_password,
    };

    try {
      await axios
        .patch(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token.access_token}` },
          }
        )
        .then((res) => {
          setProfile(res.data);
          setName(res.data.name);
          localStorage.setItem('my-profile', JSON.stringify(res.data));
        });
      //   toggleEdit(false);
      navigate(0);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
    }
  };

  return (
    <>
      <Header isAdmin={true} />

      <div className='container-fluid'>
        <div className='row md:p-10 xl:p-20 flex flex-col gap-4 m-auto w-[50%]'>
          <h1 className='text-3xl font-bold'>Profile</h1>

          <div className='flex flex-col gap-3'>
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className='flex flex-col gap-2 bg-red-200 rounded-md border-red-600 border-2 p-4'
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
          </div>

          <div className='flex flex-col gap-5 w-50'>
            <div className='flex flex-col gap-2 '>
              <label className='font-semibold'>Nama</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white'
              />
            </div>

            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gal-2'>
                <label className='font-semibold'>Email</label>
                <input
                  type='text'
                  value={profile.email}
                  disabled={true}
                  className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white'
                />
              </div>

              <div className='flex flex-col gap-4'>
                <button
                  onClick={() => setIsChangePassword(!isChangePassword)}
                  className={`${theme.primary} w-[20%] rounded-md py-2 px-4 text-gray-50 font-semibold`}
                >
                  Ubah Password
                </button>

                {isChangePassword && (
                  <>
                    <div className='flex flex-col'>
                      <label className='font-semibold'>Password</label>
                      <div className='relative'>
                        <input
                          type='password'
                          ref={passwordInput}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white'
                        />
                        {isShowPassword ? (
                          <RiEyeFill
                            onClick={() => showTextPassword()}
                            className='absolute right-4 top-4 cursor-pointer'
                          />
                        ) : (
                          <RiEyeCloseLine
                            onClick={() => showTextPassword()}
                            className='absolute right-4 top-4 cursor-pointer'
                          />
                        )}
                      </div>
                    </div>

                    <div className='flex flex-col'>
                      <label className='font-semibold'>
                        Konfirmasi Password
                      </label>
                      <div className='relative'>
                        <input
                          type='password'
                          value={confirmationPassword}
                          onChange={(e) =>
                            setConfirmationPassword(e.target.value)
                          }
                          ref={confirmPasswordInput}
                          className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white'
                        />
                        {isShowConfirmPassword ? (
                          <RiEyeFill
                            onClick={() => showTextConfirmPassword()}
                            className='absolute right-4 top-4 cursor-pointer'
                          />
                        ) : (
                          <RiEyeCloseLine
                            onClick={() => showTextConfirmPassword()}
                            className='absolute right-4 top-4 cursor-pointer'
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='fixed bottom-10 right-10'>
        <button
          onClick={handleUpdateProfile}
          className={`${theme.secondary} ${theme.textprimary} ${theme.hoverPrimary} font-semibold py-2 px-4 rounded-md`}
        >
          Simpan
        </button>
      </div>
    </>
  );
}

export default Profile;
