import React, { useState } from "react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import PromotionVideo from "../video/share.mp4";
import { activeCounter } from "../utils/data";
import axios from "axios";

import socketIO from "socket.io-client";
import { useEffect } from "react";
import Preview from "./admin/setting/Preview";
import ScreenBanner from "./ScreenBanner";

function Screen({ theme }) {
  const socket = socketIO.connect(`${process.env.REACT_APP_BACKEND_URL}`);

  const [isConnected, setIsConnected] = useState(socket.connected);

  const [activeAntrian, setActiveAntrian] = useState([]);

  const [items, setItems] = useState([]);
  const [socketId, setSocketId] = useState("");
  const [media, setMedia] = useState([]);
  const [isVideo, setIsVideo] = useState("");
  const [isAsset, setIsAsset] = useState(true);
  const [isRunning, setIsRunning] = useState(true);
  const [runningText, setRunningText] = useState("");
  const [durasi, setDurasi] = useState(0);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      // console.log("connect");
      // console.log(socket.id);
      setSocketId(socket.id);
      sentId();
    });

    const sentId = () => {
      socket.emit("storeScreenInfo", { socketId });
    };

    socket.on("pingServer", ({ data, queues }) => {
      console.log(data);

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
      setIsVideo(set.data.banner_type);
      setIsAsset(set.data.isAsset);
      setIsRunning(set.data.running_text_active);
      setRunningText(set.data.running_text);
      setDurasi(set.data.durasi_transition);
    };
    getSetting();

    // console.log(media, durasi);
  }, [items]);

  return (
    <div className="w-full h-[93vh] p-10">
      {/* <div className='w-full h-screen flex flex-col'>
              <div className="w-full h-[85%] bg-slate-200 flex">
                  
                  <div className='w-[80%]  flex items-center justify-center'>
                      <motion.h1
                          initial={{y: '15%', opacity: 0 }}
                          animate={{y: '-5%', opacity: 1 }}
                          exit={{y: '0', opacity: 0 }}
                        //   transition={{duration: 1}}
                          className='text-[20rem] font-semibold'>05D</motion.h1>                      
                  </div>
                  
                  <div className='flex flex-col'>
                      <div className='flex-1 border-black-400 relative'>                       
                          <iframe
                            width="480"
                            height="390"
                            // src={`https://www.youtube.com/embed/Za5-fvwbPJI?&autoplay=1`}
                            src={`https://www.youtube.com/embed/69IT-53ULZA?&autoplay=1&&controls=0&&showinfo=0&loop=1`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen                              
                            title="Embedded youtube"
                            />
                      </div>
                       <div className='flex-1 relative w-[480px] h-[390px]'>
                        <video
                            src={PromotionVideo}
                            type="video/mp4"
                            loop
                            controls={false}
                            muted
                            autoPlay
                            className='w-full h-full object-cover'
                        />                                               
                      </div>
                  </div>
              </div>
          
              <div className='w-full h-full flex divide-x-4 divide-gray-200'>
                  
                  {
                      activeCounter.length > 0 &&
                      (
                          activeCounter.map((counter) => (
                            <div key={counter.id} className='flex-1'>
                                <div className='w-full h-full flex flex-col items-center justify-center divide-y-2 divide-gray-200'>
                                    <div className='h-[80%] flex items-center justify-center'>                              
                                        <h1 className='text-9xl'>{counter.noAntrian}</h1>
                                    </div>
                                    <div className='w-full h-[30%] flex items-center justify-center bg-gray-600 text-gray-200'>
                                        <h1 className='text-3xl'>{counter.noCounter}</h1>
                                    </div>
                                </div>                      
                            </div>
                          ))                         
                      )
                  }

                   

              </div>              
             
          </div> */}
      <div className="grid grid-rows-8 gap-4 w-full h-full rounded-md">
        <div className="row-span-5 w-full h-[100%] flex flex-row gap-6">
          <div className="w-[50%] h-full">
            {/* {isVideo === "VIDEO" ? (
              <video
                src={PromotionVideo}
                type="video/mp4"
                loop
                controls={false}
                muted
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : ( */}
            {/* <Preview media={media} height={"100%"} width={"100%"} /> */}
            <ScreenBanner list={media} durasi={durasi} />
            {/* {isAsset ? (
              <video
                src={`http://localhost:3001/files/${media.url}`}
                type="video/mp4"
                loop
                controls={false}
                muted
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                width="100%"
                height="100%"
                // src={`https://www.youtube.com/embed/Za5-fvwbPJI?&autoplay=1`}
                // src={`https://www.youtube.com/embed/69IT-53ULZA?autoplay=1&controls=0&showinfo=0&loop=1`}
                src={media.url}
                frameBorder="0"
                allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
              /> */}
            {/* )} */}
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
              <h1
                className={`text-[18rem] leading-[15rem] mb-2 ${theme.textprimary} font-bold`}
              >
                {activeAntrian.noAntrian}
              </h1>
              <h1 className={`text-4xl ${theme.textprimary} font-semibold`}>
                {activeAntrian.groupCounter}: {activeAntrian.noCounter}
              </h1>
            </div>
          </div>
        </div>
        <div className="row-span-2 w-full h-full grid grid-cols-4 gap-[5rem] rounded-md">
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
                  <h1 className={`${theme.textprimary} text-2xl font-semibold`}>
                    {item.groupCounter}: {item.noCounter}
                  </h1>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Screen;
