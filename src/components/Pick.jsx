import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Menu } from '../components/index';
import CodePin from './CodePin';

function Pick({
  theme,
  logoHeader,
  headerText,
  grid,
  logoPrint,
  textPrint,
  isBackground,
  backgroundImage,
}) {
  const [menus, setMenus] = useState([]);
  const [classGrid, setClassGrid] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const getMenu = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/menus`);
    const data = res.data;
    setMenus(data);
  };

  const handleSecurePage = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    const setGrid = () => {
      switch (grid) {
        case 3:
          setClassGrid('grid-cols-custom3');
          break;
        case 4:
          setClassGrid('grid-cols-custom4');
          break;
        case 5:
          setClassGrid('grid-cols-custom5');
          break;
        case 6:
          setClassGrid('grid-cols-custom6');
          break;
        default:
          setClassGrid('grid-cols-custom2');
      }
    };
    setGrid();
    getMenu();
  }, [grid]);

  return (
    <>
      <CodePin
        isVisible={isVisible}
        theme={theme}
        handleSecurePage={handleSecurePage}
      />

      <div className='w-full h-full'>
        <div className='relative min-w-max min-h-screen'>
          {isBackground && (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/files/${backgroundImage}`}
              alt='background'
              className='absolute top-0 left-0 w-full h-full bg-cover '
            />
          )}

          <div className='w-full min-h-screen flex flex-col items-center justify-center z-10'>
            <div className='w-full md:w-[75%]  min-h-[35rem] flex flex-col items-center gap-4 justify-center'>
              <h1 className='text-4xl text-black font-semibold tracking-wide text-center z-10'>
                SILAHKAN AMBIL NOMOR ANTRIAN
              </h1>
              <div
                className={`${
                  grid < 4 ? 'w-[50%]' : 'w-full'
                } h-full p-3 m-3 grid ${classGrid} auto-cols-max gap-4 content-center`}
              >
                {menus.map((menu) => (
                  <Menu
                    key={menu.id}
                    menu={menu}
                    theme={theme}
                    headerText={headerText}
                    logoHeader={logoHeader}
                    logoPrint={logoPrint}
                    textPrint={textPrint}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pick;
