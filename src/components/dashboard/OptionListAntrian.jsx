import React, { useState } from 'react';

import { BsThreeDots } from 'react-icons/bs';
import { MdOutlineCallEnd, MdOutlineAddIcCall } from 'react-icons/md';

function OptionListAntrian({ antrian, handleAntrian, handleFinishAntrian }) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipCall, setTooltipCall] = useState(false);
  const [tooltipEndcall, setTooltipEndcall] = useState(false);

  const childRecall = () => {
    handleAntrian(antrian);
    setIsVisible(false);
  };

  const childFinish = () => {
    console.log(antrian);
    handleFinishAntrian(antrian);
    setIsVisible(false);
  };

  return (
    <>
      <div className='relative'>
        <div
          className='cursor-pointer'
          onClick={() => setIsVisible(!isVisible)}
        >
          <BsThreeDots className='text-2xl' />
        </div>

        {isVisible && (
          <div className='absolute top-4 -right-4 w-[100px] h-[100px] flex flex-col items-end gap-1  p-3 z-10'>
            <div className='flex flex-row items-center gap-2'>
              {tooltipCall && (
                <p className='py-1 px-2 rounded-md bg-slate-700 text-slate-50 text-sm'>
                  Recall
                </p>
              )}

              <div
                className='bg-slate-50 rounded-md p-2 cursor-pointer'
                onMouseEnter={() => setTooltipCall(true)}
                onMouseLeave={() => setTooltipCall(false)}
              >
                <MdOutlineAddIcCall
                  className='text-blue-600 font-bold text-xl'
                  onClick={() => childRecall()}
                />
              </div>
            </div>

            <div className='flex flex-row items-center gap-2'>
              {tooltipEndcall && (
                <p className='py-1 px-2 rounded-md bg-slate-700 text-slate-50 text-sm'>
                  EndCall
                </p>
              )}

              <div
                className='bg-slate-50 rounded-md p-2 cursor-pointer'
                onMouseEnter={() => setTooltipEndcall(true)}
                onMouseLeave={() => setTooltipEndcall(false)}
              >
                <MdOutlineCallEnd
                  className='text-blue-600 font-bold text-xl'
                  onClick={() => childFinish()}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default OptionListAntrian;
