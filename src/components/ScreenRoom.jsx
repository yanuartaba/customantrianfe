import React, { useState, useEffect } from 'react';

function ScreenRoom({ room }) {
  const [activeTiket, setActiveTiket] = useState(null);
  const [listTiket, setListTiket] = useState([]);

  useEffect(() => {
    const active = room.tikets.filter((item) => item.status === 2);
    setActiveTiket(active[0]);
    const onQueue = room.tikets.filter((item) => item.status === 1);

    if (onQueue.length < 5) {
      for (let i = 0; i < 7 - onQueue.length; i++) {
        onQueue.push({ nomor: '-' });
      }
    }
    setListTiket(onQueue);
  }, [room]);
  return (
    <>
      {room && (
        <div className='card w-full h-full flex flex-col justify-center items-center bg-blue-100'>
          <div className='h-[58vh] flex justify-center items-center'>
            {activeTiket && (
              <h1 className='text-[8rem] font-bold'>
                {activeTiket.nomor < 10
                  ? '0' + activeTiket.nomor
                  : activeTiket.nomor}
              </h1>
            )}
          </div>
          <div
            className={`w-full px-2 ${room.color} flex justify-center rounded-t-xl`}
          >
            <h1 className='text-2xl p-2 text-gray-50 font-bold'>
              {room.roomName}
            </h1>
          </div>

          <div className='w-full grid grid-cols-2 gap-2 mt-6'>
            {listTiket &&
              listTiket.map((tiket, idx) => (
                <div
                  key={idx}
                  className={`${
                    idx < 4 ? '' : 'hidden'
                  } w-full row-span-1 flex justify-center items-center p-4 ${
                    room.color
                  }`}
                >
                  <h1 className='text-3xl font-semibold text-gray-50'>
                    {tiket.nomor < 10 ? '0' + tiket.nomor : tiket.nomor}
                  </h1>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ScreenRoom;
