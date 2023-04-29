import React, { useEffect, useState } from 'react';
import { Pick, LoginCounter, Dashboard, Screen } from './components';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
// import Print from "./components/Print";
import Admin from './components/Admin';
import Counter from './components/admin/Counter';
import Home from './components/admin/Home';
import Staff from './components/admin/Staff';
import Media from './components/admin/Media';
import Setting from './components/admin/Setting';
import Group from './components/admin/Group';
import Banner from './components/admin/setting/Banner';
import Theme from './components/admin/setting/Theme';
import RunningText from './components/admin/setting/RunningText';
import PrintSetting from './components/admin/setting/PrintSetting';
import AdminRoute from './utils/AdminRoute';
import axios from 'axios';
import { applyTheme } from './themes/option';
import Profile from './components/admin/Profile';
import PetugasRoute from './utils/PetugasRoute';
import Secure from './components/admin/setting/Secure';

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
    // console.log(set.data.text_print);
    // document.body.classList.add(`theme-${set.data.theme.toLowerCase()}`);
    // console.log(set.data.theme);
    // setTheme("theme-" + set.data.theme.toLowerCase());
    setTheme(applyTheme(set.data.theme));
    setText(set.data.text_header);
    setLogoHeader(set.data.logo_header);
    setDurasi(set.data.durasi_transition);
    setFileMedia(JSON.parse(set.data.file_banner));
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
    if (path === '/login') {
      setIsNav(true);
    } else if (path === '/print') {
      setIsNav(true);
    } else {
      setIsNav(false);
    }

    // const getSetTheme = async () => {
    //   const set = await axios.get(
    //     `${process.env.REACT_APP_BACKEND_URL}/setting`
    //   );
    //   // console.log(set.data.text_print);
    //   // document.body.classList.add(`theme-${set.data.theme.toLowerCase()}`);
    //   // console.log(set.data.theme);
    //   // setTheme("theme-" + set.data.theme.toLowerCase());
    //   setTheme(applyTheme(set.data.theme));
    //   setText(set.data.text_header);
    //   setLogoHeader(set.data.logo_header);
    //   setDurasi(set.data.durasi_transition);
    //   setFileMedia(JSON.parse(set.data.file_banner));
    //   setGrid(set.data.grid);
    //   setLogoPrint(set.data.logo_print);
    //   setTextPrint(set.data.text_print);
    // };

    getSetTheme();
    // console.log(textPrint);
  }, [location]);

  return (
    <>
      {!isNav && <Header text={text} logoHeader={logoHeader} />}
      <div
        className={`w-full ${
          isNav ? 'h-full' : 'h-[92vh] mt-[8vh]'
        } flex justify-center items-center bg-gray-100 relative theme-default bg-custom-third overflow-y-hidden`}
      >
        <Routes>
          <Route
            path='/'
            element={
              <Pick
                theme={theme}
                headerText={text}
                logoHeader={logoHeader}
                grid={grid}
                logoPrint={logoPrint}
                textPrint={textPrint}
                isBackground={isBackground}
                backgroundImage={backgroundImage}
              />
            }
          />

          <Route
            path='/login'
            element={<LoginCounter logoHeader={logoHeader} />}
          />

          <Route path='/screen' element={<Screen theme={theme} />} />

          <Route element={<PetugasRoute />}>
            <Route path='/dashboard' element={<Dashboard theme={theme} />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path='/admin' element={<Admin theme={theme} />}>
              <Route path='/admin/home' element={<Home />} />
              <Route
                path='/admin/counter'
                element={<Counter theme={theme} />}
              />
              <Route path='/admin/group' element={<Group theme={theme} />} />
              <Route path='/admin/staff' element={<Staff theme={theme} />} />
              <Route path='/admin/media' element={<Media theme={theme} />} />
              <Route path='/admin/settings' element={<Setting />}>
                <Route
                  path='/admin/settings/banner'
                  element={
                    <Banner
                      theme={theme}
                      durasiTransition={durasi}
                      fileMedia={fileMedia}
                    />
                  }
                />
                <Route
                  path='/admin/settings/theme'
                  element={<Theme defaultTheme={theme} />}
                />
                <Route
                  path='/admin/settings/runningtext'
                  element={<RunningText theme={theme} />}
                />
                <Route
                  path='/admin/settings/print'
                  element={<PrintSetting theme={theme} />}
                />
                <Route
                  path='/admin/settings/secure'
                  element={<Secure theme={theme} />}
                />
              </Route>
              <Route
                path='/admin/profile'
                element={<Profile theme={theme} />}
              />
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
