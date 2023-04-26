import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Blocks } from 'react-loader-spinner';
import { RiEyeCloseLine, RiEyeFill } from 'react-icons/ri';

function Secure({ theme }) {
  const navigate = useNavigate();

  const [newInputPin, setNewInputPin] = useState('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState('');
  const [pinCode, setPinCode] = useState('');
  //   const [reInputPin, setReInputPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPin, setIsShowPin] = useState(false);
  const [changePin, setChangePin] = useState(false);
  const [textBtnChange, setTextBtnChange] = useState('Change');

  const pinInput = useRef();

  const showTextPin = () => {
    setIsShowPin(!isShowPin);
    if (isShowPin !== true) {
      pinInput.current.type = 'text';
    } else {
      pinInput.current.type = 'password';
    }
  };

  const handleChangePin = () => {
    setChangePin(!changePin);
    if (changePin) {
      setTextBtnChange('Change');
    } else {
      setTextBtnChange('Cancel');
    }
  };

  const updateSetting = async () => {
    if (newInputPin === '' || confirmNewPinInput === '') {
      alert('New pin cannot empty');
    } else if (newInputPin !== confirmNewPinInput) {
      alert('New pin not match');
    } else {
      setIsLoading(true);

      const payload = {
        pin_code: newInputPin,
      };

      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/setting`,
        payload,
        {
          headers: { codepipe: 'GJddPyb9jqK1Bxm68wqLRcYsNPt2UKJC' },
        }
      );

      setTimeout(() => {
        setIsLoading(false);
        navigate(0);
      }, 2000);
    }
  };

  useEffect(() => {
    const getSetting = async () => {
      setIsLoading(true);
      const set = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/setting`
      );

      //   setInputPin(set.data.pin_code);
      setPinCode(set.data.pin_code);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    getSetting();
  }, []);

  return (
    <>
      {isLoading && (
        <div
          tabindex='-1'
          class='backdrop-blur-sm bg-slate-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex flex-col justify-center items-center'
        >
          <Blocks
            visible={true}
            height='80'
            width='80'
            ariaLabel='blocks-loading'
            wrapperStyle={{}}
            wrapperClass='blocks-wrapper'
          />
          <h3>Please wait while saving setting</h3>
        </div>
      )}

      <div className='w-full flex flex-col gap-3'>
        <div
          className={`w-full ${theme.primary} text-gray-50 rounded-lg flex flex-col justify-center items-center py-2`}
        >
          <h1 className='font-bold text-xl'>Security Pin</h1>
        </div>

        <div className='grid grid-flow-row grid-cols-custom2 gap-4'>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col'>
              <div
                className={`w-[60%] ${theme.secondary} py-2 px-2 rounded-md`}
              >
                <p className='font-semibold ml-2'>Pin Code</p>
              </div>
              <div className='flex flex-col gap-2 p-4'>
                <label>Security Pin</label>

                <div className='relative'>
                  <input
                    type='password'
                    ref={pinInput}
                    value={pinCode}
                    disabled={true}
                    onChange={(e) => setPinCode(e.target.value)}
                    className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white'
                  />
                  {isShowPin ? (
                    <RiEyeFill
                      onClick={() => showTextPin()}
                      className='absolute right-4 top-4 cursor-pointer'
                    />
                  ) : (
                    <RiEyeCloseLine
                      onClick={() => showTextPin()}
                      className='absolute right-4 top-4 cursor-pointer'
                    />
                  )}
                </div>

                <div className='w-1/4 mb-4'>
                  <button
                    onClick={() => handleChangePin()}
                    className={`${theme.secondary} ${theme.textprimary} ${theme.hoverPrimary} font-semibold py-2 px-4 rounded-md`}
                  >
                    {textBtnChange}
                  </button>
                </div>

                {changePin && (
                  <div className='flex flex-col gap-4'>
                    <div className='flex flex-col'>
                      <label>New Pin</label>
                      <input
                        type='text'
                        pattern='[0-9]*'
                        maxLength={4}
                        onChange={(e) =>
                          setNewInputPin((v) =>
                            e.target.validity.valid ? e.target.value : v
                          )
                        }
                        value={newInputPin}
                        className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white'
                      />
                    </div>

                    <div className='flex flex-col'>
                      <label>Retype New Pin</label>
                      <input
                        value={confirmNewPinInput}
                        pattern='[0-9]*'
                        maxLength={4}
                        onChange={(e) =>
                          setConfirmNewPinInput((v) =>
                            e.target.validity.valid ? e.target.value : v
                          )
                        }
                        type='password'
                        className='mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white'
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-5'>
            <div className='flex flex-col'>
              <div
                className={`w-[60%] ${theme.secondary} py-2 px-2 rounded-md`}
              >
                <p className='font-semibold ml-2'>Catatan</p>
              </div>
              <div className='w-full flex flex-col p-4 gap-1'>
                <div className='w-full flex flex-col'>
                  <p className='text-base'>
                    <i>
                      ** Pin code digunakan untuk memproteksi laman pengambilan
                      nomor antrian
                    </i>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='fixed bottom-10 right-10'>
        {changePin && (
          <button
            onClick={updateSetting}
            className={`${theme.secondary} ${theme.textprimary} ${theme.hoverPrimary} font-semibold py-2 px-4 rounded-md`}
          >
            Terapkan
          </button>
        )}
      </div>
    </>
  );
}

export default Secure;
