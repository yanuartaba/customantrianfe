import React, { useState } from 'react';

import { BiRadioCircleMarked } from 'react-icons/bi';
import OptionListAntrian from './OptionListAntrian';

function ListAntrian({ lists, admin, theme, recallAntrian, antrianFinish }) {
  // console.log(lists);

  const listAntrean = lists;
  // const [isMenuCollapse, setIsMenuCollapse] = useState(false);

  const handleAntrian = (val) => {
    recallAntrian(val);
  };

  const handleFinishAntrian = (val) => {
    antrianFinish(val);
  };

  return (
    <>
      <div className='bg-blue-100 rounded-md relative w-[22rem] h-[33rem] overflow-y-auto overflow-x-hidden flex flex-col justify-start'>
        <div
          className={`w-full sticky top-0 z-10 rounded-tl-md rounded-tr-md bg-blue-500 text-center py-3`}
        >
          <h3 className='text-slate-50 font-semibold text-xl'>
            Tiket Antrian: {listAntrean.length}
          </h3>
        </div>

        <div className='pb-4'>
          {listAntrean &&
            listAntrean.map((antrian) => (
              <div
                key={antrian.id}
                className='flex flex-col justify-center items-center relative gap-2 pt-3 pb-1 border-b-[1px] border-slate-500'
              >
                {antrian.status === 2 && (
                  <div className='absolute w-[95%] flex flex-row justify-between items-center top-0 left-1'>
                    <div className='flex flex-row gap-2 justify-start items-center'>
                      <BiRadioCircleMarked className='text-green-600' />
                      <p className='text-green-600 text-sm'>On Progress</p>
                    </div>
                  </div>
                )}

                <h2 className={`text-5xl font-semibold ${theme.textprimary}`}>
                  {antrian.nomor < 10 ? '0' + antrian.nomor : antrian.nomor}
                </h2>
                <p className=' text-slate-600 text-sm'>
                  Created At :{' '}
                  {new Date(antrian.createdAt).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default ListAntrian;
