import React, { useState } from "react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import axios from "axios";

import { Blocks } from "react-loader-spinner";
import socketIO from "socket.io-client";
import { useEffect } from "react";
import ScreenBanner from "./ScreenBanner";

function Screen({ theme }) {
  const socket = socketIO.connect(`${process.env.REACT_APP_BACKEND_URL}`);

  const [isConnected, setIsConnected] = useState(socket.connected);

  const [activeAntrian, setActiveAntrian] = useState([]);

  const [items, setItems] = useState([]);
  const [socketId, setSocketId] = useState("");
  const [media, setMedia] = useState([]);
  // const [isVideo, setIsVideo] = useState("");
  // const [isAsset, setIsAsset] = useState(true);
  const [isRunning, setIsRunning] = useState(true);
  const [runningText, setRunningText] = useState("");
  const [durasi, setDurasi] = useState(0);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      setSocketId(socket.id);
      sentId();
    });

    const sentId = () => {
      socket.emit("storeScreenInfo", { socketId });
    };

    socket.on("pingServer", ({ data, queues }) => {
      setActiveAntrian(data);

      if (queues.length > 4) {
        queues = queues.slice(-4);
      }
      setItems(queues.reverse());
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    const getSetting = async () => {
      const set = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/setting`
      );

      setMedia(JSON.parse(set.data.file_banner));
      setIsRunning(set.data.running_text_active);
      setRunningText(set.data.running_text);
      setDurasi(set.data.durasi_transition);
    };
    getSetting();
  }, [items]);

  return (
    <>
      {!isConnected ? (
        <div
          tabIndex="-1"
          className="backdrop-blur-sm bg-slate-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex flex-col justify-center items-center"
        >
          <Blocks
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
          />
          <h3>Please wait while connected to server</h3>
        </div>
      ) : (
        <div className="w-full h-[93vh] p-10">
          <div className="grid grid-rows-8 gap-4 w-full h-full rounded-md">
            <div className="row-span-5 w-full h-[100%] flex flex-row gap-6">
              <div className="w-[50%] h-full">
                <ScreenBanner list={media} durasi={durasi} />
              </div>
              <div className="w-[50%] h-[70vh] flex flex-col gap-2 rounded-md">
                {isRunning && (
                  <div
                    className={`w-full h-[20%] ${theme.primary} text-gray-100 flex items-center overflow-hidden relative rounded-md`}
                  >
                    <Marquee
                      className="overflow-hidden h-full"
                      gradient={false}
                      speed={100}
                      delay={1}
                    >
                      <h1 className="text-5xl font-semibold ml-[5rem]">
                        {runningText}
                      </h1>
                    </Marquee>
                  </div>
                )}
                <div
                  className={`${theme.secondary} w-full h-full flex flex-col justify-center items-center gap-4 rounded-md`}
                >
                  <h1 className={`text-4xl ${theme.textprimary} font-semibold`}>
                    Nomor Antrian
                  </h1>
                  <motion.h1
                    initial={{ opacity: 0.2, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 3.8,
                      delay: 0.5,
                      repeat: 5,
                    }}
                    className={`text-[12rem] leading-[12rem] mb-2 ${theme.textprimary} font-bold`}
                  >
                    {activeAntrian.noAntrian}
                  </motion.h1>
                  <h1 className={`text-4xl ${theme.textprimary} font-semibold`}>
                    {activeAntrian.groupCounter}: {activeAntrian.noCounter}
                  </h1>
                </div>
              </div>
            </div>
            <div className="row-span-2 w-full h-full grid grid-cols-custom4 gap-[5rem] rounded-md">
              {items.length > 0 &&
                items.map((item) => (
                  <div key={item.id} className="flex flex-col">
                    <div
                      className={`${theme.primary} h-[60%] flex justify-center items-center`}
                    >
                      <h1 className="text-6xl text-gray-100 font-bold">
                        {item.noAntrian}
                      </h1>
                    </div>
                    <div
                      className={`${theme.secondary} h-[40%] flex justify-center items-center`}
                    >
                      <h1
                        className={`${theme.textprimary} text-2xl font-semibold`}
                      >
                        {item.groupCounter}: {item.noCounter}
                      </h1>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Screen;
