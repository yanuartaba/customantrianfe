import React, { useState } from 'react';
import axios from 'axios';

export const tuts = [
  {
    label: '1',
    val: 1,
    action: 'add',
  },
  {
    label: '2',
    val: 2,
    action: 'add',
  },
  {
    label: '3',
    val: 3,
    action: 'add',
  },
  {
    label: '4',
    val: 4,
    action: 'add',
  },
  {
    label: '5',
    val: 5,
    action: 'add',
  },
  {
    label: '6',
    val: 6,
    action: 'add',
  },
  {
    label: '7',
    val: 7,
    action: 'add',
  },
  {
    label: '8',
    val: 8,
    action: 'add',
  },
  {
    label: '9',
    val: 9,
    action: 'add',
  },
  {
    label: 'Del',
    val: '',
    action: 'del',
  },
  {
    label: '0',
    val: 0,
    action: 'add',
  },
  {
    label: 'Enter',
    val: '',
    action: 'enter',
  },
];

function CodePin({ isVisible, theme, handleSecurePage }) {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);

  const handleInputPin = (val, action) => {
    setIsError(false);
    if (action === 'del' && pin.length > 0) {
      const lastChar = pin.slice(0, -1);
      setPin(lastChar);
    } else if (action === 'enter') {
      accessPage();
    } else {
      setPin(pin + val);
    }
  };

  const accessPage = async () => {
    const payload = {
      pin_code: pin,
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/setting/code`,
        payload
      );
      handleSecurePage(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
      setPin('');
    }
  };

  return (
    <>
      <>
        {isVisible && (
          <div
            tabIndex='-1'
            className='backdrop-blur-sm bg-slate-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex justify-center items-center'
          >
            <div className='relative w-full h-full max-w-md md:h-auto'>
              <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
                <div className='p4 flex flex-col gap-3'>
                  <h3 className='text-center font-bold py-4'>Security Pin</h3>
                  {isError && (
                    <div className='bg-red-300 p-6 mx-6 my-2 rounded-md'>
                      <h1 className='text-md font-semibold'>Not Authorized</h1>
                    </div>
                  )}

                  <div className='px-6'>
                    <input
                      type='password'
                      disabled
                      value={pin}
                      maxLength={4}
                      className='text-center text-3xl mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md tracking-widest shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white
                                '
                    />
                  </div>

                  <div className='p-4 grid grid-cols-custom3 gap-4'>
                    {tuts &&
                      tuts.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleInputPin(item.val, item.action)}
                          className={`p-4 text-center ${theme.primary} ${theme.textwhite} rounded-md cursor-pointer`}
                        >
                          <h1 className='text-2xl font-semibold'>
                            {item.label}
                          </h1>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
}

export default CodePin;
