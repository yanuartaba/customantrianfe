import axios from "axios";
import React, { useEffect, useState } from "react";
import { Menu } from "../components/index";
// import { localString, dataMenu } from '../utils/data';

function Pick({ theme, logoHeader, headerText }) {
  // let localData = localStorage.getItem('listAntrian');
  // const [listAntrian, setListAntrian] = useState(localData ? JSON.parse(localData) : [])
  const [menus, setMenus] = useState([]);
  // const [params, setParams] = useState("");

  // const speech = (nomor, counter) => {
  //   const synth = window.speechSynthesis;

  //   const utterThis = new SpeechSynthesisUtterance(
  //     `Nomor Urut ${nomor}, silahkan ke counter ${counter}`
  //   );
  //   utterThis.lang = "id-ID";
  //   utterThis.rate = 0.8;
  //   synth.speak(utterThis);
  // };

  const getMenu = async () => {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/menus`);
    const data = res.data;
    setMenus(data);
    // console.log(menu);
  };

  useEffect(() => {
    getMenu();
  }, []);

  return (
    <>
      <div className="w-full md:w-[75%] min-h-screen flex flex-col items-center justify-center">
        <div className="w-full min-h-[30rem] flex flex-col items-center gap-10 justify-center">
          <h1 className="text-6xl text-black font-semibold tracking-wide text-center">
            SILAHKAN AMBIL NOMOR ANTRIAN
          </h1>
          <div className="w-full h-auto  p-3 m-3 flex flex-wrap gap-5 justify-center">
            {menus.map((menu) => (
              <Menu
                key={menu.id}
                menu={menu}
                theme={theme}
                headerText={headerText}
                logoHeader={logoHeader}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Pick;
