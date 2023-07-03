import React, { useEffect, useState } from 'react';
import { Pick, LoginCounter, Dashboard, Screen } from './components';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/admin/Home';
import Staff from './components/admin/Staff';
import AdminRoute from './utils/AdminRoute';
import axios from 'axios';
import { applyTheme } from './themes/option';
import Profile from './components/admin/Profile';
import PetugasRoute from './utils/PetugasRoute';
import Kuota from './components/admin/Kuota';

function App() {
  const [isNav, setIsNav] = useState(true);
  const [theme, setTheme] = useState('');
  const [text, setText] = useState('');
  const [logoHeader, setLogoHeader] = useState('');
  const [durasi, setDurasi] = useState(0);
  const [fileMedia, setFileMedia] = useState([]);
  const [grid, setGrid] = useState(4);
  const location = useLocation();
  const [logoPrint, setLogoPrint] = useState('');
  const [textPrint, setTextPrint] = useState('');
  const [isBackground, setIsBackgroud] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');

  // componentDidMount() {
  const getSetTheme = async () => {
    const set = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/setting`);
    setTheme(applyTheme(set.data.theme));
    setText(set.data.text_header);
    setLogoHeader(set.data.logo_header);
    setDurasi(set.data.durasi_transition);
    setGrid(set.data.grid);
    setLogoPrint(set.data.logo_print);
    setTextPrint(set.data.text_print);
    setIsBackgroud(set.data.background_enable);
    setBackgroundImage(set.data.background_img);
  };
  // }

  useEffect(() => {
    const path = location.pathname;
    // console.log(path);
    if (path === '/') {
      setIsNav(false);
    } else if (path === '/print') {
      setIsNav(true);
    } else {
      setIsNav(false);
    }
    getSetTheme();
  }, [location]);

  return (
    <>
      {/* {!isNav && <Header text={text} logoHeader={logoHeader} />} */}
      {/* <div
        className={`w-full ${
          isNav ? 'h-full' : 'h-[92vh] mt-[8vh]'
        } flex justify-center items-center bg-gray-100 relative theme-default bg-custom-third overflow-y-hidden`}
      > */}
      <Routes>
        <Route
          path='/'
          // element={
          //   <Pick
          //     theme={theme}
          //     headerText={text}
          //     logoHeader={logoHeader}
          //     grid={grid}
          //     logoPrint={logoPrint}
          //     textPrint={textPrint}
          //     isBackground={isBackground}
          //     backgroundImage={backgroundImage}
          //   />
          // }
          element={<LoginCounter />}
        />

        <Route
          path='/login'
          element={<LoginCounter logoHeader={logoHeader} />}
        />

        <Route path='/screen' element={<Screen theme={theme} />} />

        <Route element={<PetugasRoute />}>
          <Route path='/dashboard' element={<Dashboard theme={theme} />} />
        </Route>

        <Route path='/admin/profile' element={<Profile theme={theme} />} />

        <Route element={<AdminRoute />}>
          {/* <Route path='/admin' element={<Admin theme={theme} />}> */}
          <Route path='/admin/home' element={<Home />} />
          <Route path='/admin/kuota' element={<Kuota />} />
          <Route path='/admin/pengguna' element={<Staff />} />
          <Route
            path='/admin/room/:idRoom'
            element={<Dashboard theme={theme} />}
          />
        </Route>
        {/* </Route> */}
      </Routes>
      {/* </div> */}
    </>
  );
}

export default App;
