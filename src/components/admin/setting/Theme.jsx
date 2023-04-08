import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { Blocks } from "react-loader-spinner";

function Theme({ defaultTheme }) {
  const navigate = useNavigate();

  const [theme, setTheme] = useState("");
  const [logoHeader, setLogoHeader] = useState("");
  const [grid, setGrid] = useState(0);
  const [textHeader, setTextHeader] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState([]);

  const saveData = async (logo) => {
    const payload = {
      logo_header: logo,
      text_header: textHeader,
      theme: theme,
      grid: parseInt(grid),
    };

    console.log(payload);

    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/setting`, payload, {
      headers: { codepipe: "GJddPyb9jqK1Bxm68wqLRcYsNPt2UKJC" },
    });

    setTimeout(() => {
      setIsLoading(false);
      navigate(0);
    }, 2000);
  };

  const updateSetting = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // console.log(file);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/menus/file`,
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );

      const logo = await res.data.file.filename;

      await saveData(logo);
    } else {
      saveData(logoHeader);
    }

    // console.log(logoPrint);
  };

  useEffect(() => {
    const getSetting = async () => {
      setIsLoading(true);
      const set = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/setting`
      );

      setGrid(set.data.grid);
      setTextHeader(set.data.text_header);
      setLogoHeader(set.data.logo_header);
      setTheme(set.data.theme);
      setPreview(set.data.theme);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    getSetting();
  }, []);

  const changeTheme = (e) => {
    console.log(e);
    setTheme(e);
    switch (e) {
      case "REDMINE":
        setPreview({
          primary:
            "w-[120px] h-[30px] bg-red-600 outline outline-offset-4 outline-1 outline-gray-400 mr-2",
          secondary:
            "w-[120px] h-[30px] bg-red-200 outline outline-offset-4 outline-1 outline-gray-400 mr-2",
        });
        break;
      case "SUNSHINE":
        setPreview({
          primary:
            "w-[120px] h-[30px] bg-orange-600 outline outline-offset-4 outline-1 outline-gray-400 mr-2",
          secondary:
            "w-[120px] h-[30px] bg-orange-200 outline outline-offset-4 outline-1 outline-gray-400 mr-2",
        });
        break;
      default:
        setPreview({
          primary:
            "w-[120px] h-[30px] bg-blue-600 outline outline-offset-4 outline-1 outline-gray-400 mr-2",
          secondary:
            "w-[120px] h-[30px] bg-blue-200 outline outline-offset-4 outline-1 outline-gray-400 mr-2",
        });
    }
  };

  return (
    <>
      {isLoading && (
        <div
          tabindex="-1"
          class="backdrop-blur-sm bg-slate-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex flex-col justify-center items-center"
        >
          <Blocks
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
          />
          <h3>Please wait while saving setting</h3>
        </div>
      )}
      <div className="w-full flex flex-col gap-3">
        <div
          className={`w-full ${defaultTheme.primary} text-gray-50 rounded-lg flex flex-col justify-center items-center py-2`}
        >
          <h1 className="font-bold text-xl">Theme Setting</h1>
        </div>

        <div className="grid grid-flow-row grid-cols-custom2 gap-4">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <div
                className={`w-[60%] ${defaultTheme.secondary} py-2 px-2 rounded-md`}
              >
                <p className="font-semibold ml-2">Logo Header</p>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <label>File Upload</label>
                <input
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <div
                className={`w-[60%] ${defaultTheme.secondary} py-2 px-2 rounded-md`}
              >
                <p className="font-semibold ml-2">Text Header</p>
              </div>
              <div className="w-full flex flex-col p-4 gap-1">
                <div className="w-full flex flex-col">
                  <input
                    value={textHeader}
                    onChange={(e) => setTextHeader(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-flow-row grid-cols-custom2 gap-4 mt-5">
          <div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div
                  className={`w-[60%] ${defaultTheme.secondary} py-2 px-2 rounded-md`}
                >
                  <p className="font-semibold ml-2">Main Theme Color</p>
                </div>

                <div className="w-full">
                  <select
                    value={theme}
                    onChange={(e) => changeTheme(e.target.value)}
                    className={`w-[60%] ${defaultTheme.primary} text-gray-50 p-2`}
                  >
                    <option selected disabled>
                      Pilih salah satu
                    </option>
                    <option value="DEFAULT">Default</option>
                    <option value="REDMINE">Redmine</option>
                    <option value="SUNSHINE">Sunshine</option>
                  </select>
                </div>

                <div className="w-[60%] flex flex-row gap-5 items-center justify-between my-3">
                  <h3 className="font-semibold mr-3">Primary Color</h3>
                  <div className={preview.primary} />
                </div>

                <div className="w-[60%] flex flex-row gap-5 items-center justify-between my-3">
                  <h3 className="font-semibold mr-3">Secondary Color</h3>
                  <div className={preview.secondary} />
                </div>
              </div>
            </div>
          </div>

          <div className=" w-full h-auto">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <div
                  className={`w-[60%] ${defaultTheme.secondary} py-2 px-2 rounded-md`}
                >
                  <p className="font-semibold ml-2">Grid Setting</p>
                </div>
                <div className="w-full flex flex-col p-4 gap-1">
                  <div className="w-full flex flex-col">
                    <select
                      value={grid}
                      onChange={(e) => setGrid(e.target.value)}
                      className={`w-[60%] ${defaultTheme.primary} text-gray-50 p-2`}
                    >
                      <option selected disabled>
                        Pilih salah satu
                      </option>
                      <option value={2}>2 Grid</option>
                      <option value={3}>3 Grid</option>
                      <option value={4}>4 Grid</option>
                      <option value={5}>5 Grid</option>
                      <option value={6}>6 Grid</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 right-10">
        <button
          onClick={updateSetting}
          className={`${defaultTheme.secondary} ${defaultTheme.textprimary} ${defaultTheme.hoverPrimary} font-semibold py-2 px-4 rounded-md`}
        >
          Terapkan
        </button>
      </div>
    </>
  );
}

export default Theme;
