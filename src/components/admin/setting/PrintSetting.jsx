import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Blocks } from "react-loader-spinner";

function PrintSetting({ theme }) {
  const navigate = useNavigate();

  // const [setting, setSetting] = useState([]);

  const [logoPrint, setLogoPrint] = useState("");
  const [fontsize, setFontsize] = useState(0);
  const [headerText, setHeaderText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState("");

  const saveData = async (logo) => {
    const payload = {
      logo_print: logo,
      fontsize_print: parseInt(fontsize),
      text_print: headerText,
    };

    console.log(payload);

    await axios.patch(`http://localhost:3001/setting`, payload, {
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
        "http://localhost:3001/menus/file",
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );

      const logo = await res.data.file.filename;

      setLogoPrint(logo);

      await saveData(logo);
    } else {
      saveData(logoPrint);
    }

    // console.log(logoPrint);
  };

  useEffect(() => {
    const getSetting = async () => {
      setIsLoading(true);
      const set = await axios.get("http://localhost:3001/setting");

      setFontsize(set.data.fontsize_print);
      setHeaderText(set.data.text_print);
      setLogoPrint(set.data.logo_print);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    getSetting();
  }, []);

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
          className={`w-full ${theme.primary} text-gray-50 rounded-lg flex flex-col justify-center items-center py-2`}
        >
          <h1 className="font-bold text-xl">Print Resi Setting</h1>
        </div>

        <div className="grid grid-flow-row grid-cols-2 gap-4">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <div
                className={`w-[60%] ${theme.secondary} py-2 px-2 rounded-md`}
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
                className={`w-[60%] ${theme.secondary} py-2 px-2 rounded-md`}
              >
                <p className="font-semibold ml-2">Header Text</p>
              </div>
              <div className="w-full flex flex-col p-4 gap-1">
                <div className="w-full flex flex-col">
                  <input
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-flow-row grid-cols-2 gap-4 mt-5">
          <div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div
                  className={`w-[60%] ${theme.secondary} py-2 px-2 rounded-md`}
                >
                  <p className="font-semibold ml-2">Font Size</p>
                </div>

                <div className="w-full">
                  <select
                    className={`w-[60%] ${theme.primary} text-gray-50 p-2`}
                    value={fontsize}
                    onChange={(e) => setFontsize(e.target.value)}
                  >
                    <option selected disabled>
                      Pilih salah satu
                    </option>
                    <option value={16}>16px</option>
                    <option value={18}>18px</option>
                    <option value={20}>20px</option>
                    <option value={24}>24px</option>
                    <option value={30}>30px</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 right-10">
        <button
          onClick={updateSetting}
          className={`${theme.secondary} ${theme.textprimary} ${theme.hoverPrimary} font-semibold py-2 px-4 rounded-md`}
        >
          Terapkan
        </button>
      </div>
    </>
  );
}

export default PrintSetting;
