import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Blocks } from "react-loader-spinner";

function RunningText({ theme }) {
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(true);
  const [runningText, setRunningText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateSetting = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      running_text_active: isActive,
      running_text: runningText,
    };

    await axios.patch(`http://localhost:3001/setting`, payload, {
      headers: { codepipe: "GJddPyb9jqK1Bxm68wqLRcYsNPt2UKJC" },
    });

    setTimeout(() => {
      setIsLoading(false);
      navigate(0);
    }, 2000);
  };

  useEffect(() => {
    const getSetting = async () => {
      setIsLoading(true);
      const set = await axios.get("http://localhost:3001/setting");

      setIsActive(set.data.running_text_active);
      setRunningText(set.data.running_text);

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
          <h1 className="font-bold text-xl">Running Text Setting</h1>
        </div>

        <div className="grid grid-flow-row grid-cols-2 gap-4">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <div
                className={`w-[60%] ${theme.secondary} py-2 px-2 rounded-md`}
              >
                <p className="font-semibold ml-2">Active Running Text</p>
              </div>
              <div className="w-full flex flex-col p-4 gap-1">
                <div className="flex flex-row gap-2">
                  <input
                    type="radio"
                    name="activeText"
                    checked={isActive}
                    onClick={() => setIsActive(!isActive)}
                  />
                  <label className="font-semibold">Active</label>
                </div>

                <div className="flex flex-row gap-2">
                  <input
                    type="radio"
                    name="activeText"
                    checked={!isActive}
                    onClick={() => setIsActive(!isActive)}
                  />
                  <label className="font-semibold">Tidak Active</label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <div
                className={`w-[60%] ${theme.secondary} py-2 px-2 rounded-md`}
              >
                <p className="font-semibold ml-2">Running Text</p>
              </div>
              <div className="w-full flex flex-col p-4 gap-1">
                {/* {runningText} */}
                <textarea
                  className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white"
                  cols="30"
                  rows="10"
                  // defaultValue={runningText}
                  value={runningText}
                  onChange={(e) => setRunningText(e.target.value)}
                />
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

export default RunningText;
