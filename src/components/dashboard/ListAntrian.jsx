import React, { useState } from 'react';

import { BiRadioCircleMarked } from 'react-icons/bi';
import OptionListAntrian from './OptionListAntrian';

function ListAntrian({ lists, admin, theme, recallAntrian, antrianFinish }) {
  // console.log(testFunction);

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
      <div className='bg-blue-100 rounded-md relative w-[22rem] h-[35rem] overflow-y-auto overflow-x-hidden flex flex-col justify-start'>
        <div
          className={`w-full sticky top-0 z-10 rounded-tl-md rounded-tr-md ${theme.primary} text-center py-3`}
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
                className='flex flex-col justify-center items-center relative gap-2 py-5 border-b-[1px] border-slate-500'
              >
                {antrian.statusAntrian === 2 && (
                  <div className='absolute w-[95%] flex flex-row justify-between items-center top-0 left-1'>
                    <div className='flex flex-row gap-2 justify-start items-center'>
                      <BiRadioCircleMarked className='text-green-600' />
                      <p className='text-green-600 text-sm'>On Progress</p>
                    </div>

                    <OptionListAntrian
                      antrian={antrian}
                      handleAntrian={handleAntrian}
                      handleFinishAntrian={handleFinishAntrian}
                    />
                  </div>
                )}

                {antrian.statusAntrian === 3 && (
                  <div className='absolute w-[95%] flex flex-row justify-between items-center top-0 left-1'>
                    <div className='flex flex-row gap-2 justify-start items-center'>
                      <BiRadioCircleMarked className='text-red-600' />
                      <p className='text-red-600 text-sm'>Skip</p>
                    </div>

                    <OptionListAntrian
                      antrian={antrian}
                      handleAntrian={handleAntrian}
                      handleFinishAntrian={handleFinishAntrian}
                    />
                  </div>
                )}
                <h3 className='text-xl text-gray-600'>{admin.groupName}</h3>
                <h2 className={`text-4xl font-semibold ${theme.textprimary}`}>
                  {antrian.group}
                  {antrian.nomor}
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
