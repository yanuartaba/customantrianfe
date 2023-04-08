import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
import YouTube from "react-youtube";

const Text = ({ media, durasi }) => {
  // const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [item, setItem] = useState("");
  const [url, setUrl] = useState("");
  const [isAsset, setIsAsset] = useState(true);
  const [assetDurasi, setAssetDurasi] = useState(0);

  const videoSelesai = () => {
    // let newIdx = idx === media.length ? 0 : idx + 1;
    if (idx === media.length) {
      // navigate(0);
      setIdx(0);
      const { type, url, isAsset } = { ...media[0] };
      setItem(type);
      setUrl(url);
      setIsAsset(isAsset);
    } else {
      setIdx(idx + 1);
      setItem(media[idx].type);
      setUrl(media[idx].url);
      setIsAsset(media[idx].isAsset);
    }
    console.log("new idx", idx);
    console.log("media idx", media[idx]);
  };

  // const endYoutube = () => {
  //   console.log("iframe youtube end");
  //   if (idx === media.length) {
  //     navigate(0);
  //   }
  //   setIdx(idx === media.length ? 0 : idx + 1);
  //   setItem(media[idx].type);
  //   setUrl(media[idx].url);
  //   setIsAsset(media[idx].isAsset);
  // };

  useEffect(() => {
    const { type, url, isAsset } = { ...media[0] };
    // console.log(media.length);
    setItem(type);
    setUrl(url);
    setIsAsset(isAsset);
    setAssetDurasi(durasi);
  }, [media, durasi]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((idx) => (idx === media.length ? 0 : idx + 1));
      setItem(media[idx].type);
      setUrl(media[idx].url);
      setIsAsset(media[idx].isAsset);
    }, assetDurasi * 6000);

    return () => clearInterval(interval);
  }, [media, idx, assetDurasi]);

  useEffect(() => {
    if (item !== "image") {
      setAssetDurasi(60);
    } else {
      setAssetDurasi(durasi);
    }
    // console.log(assetDurasi);
  }, [idx, item, assetDurasi, durasi]);

  return (
    <div>
      {item === "image" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-[70vh] rounded-md"
        >
          <img
            className="h-[70vh] w-full object-cover rounded-md"
            src={`${process.env.REACT_APP_BACKEND_URL}/files/${url}`}
            alt=""
          />
        </motion.div>
      ) : isAsset ? (
        // <video src={`http://localhost:3001/files/${url}`} autoPlay />
        <div className="w-auto h-[70vh] flex flex-col justify-center items-center ">
          <video
            // onLoad={console.log("asdasd")}
            onEnded={videoSelesai}
            controls
            muted
            autoPlay
            // loop
            // width="100%"
            // height="100%"
            className="w-full h-[70vh] object-cover"
          >
            <source
              src={`${process.env.REACT_APP_BACKEND_URL}/files/${url}`}
              type="video/mp4"
            ></source>
          </video>
        </div>
      ) : (
        <div
          className={`w-auto h-[70vh] flex flex-col justify-center items-center bg-slate-300`}
        >
          <div className="w-full h-[70vh] flex justify-center items-center relative">
            {/* <iframe
              onLoad={loadYoutube}
              onEnded={endYoutube}
              id="ytFrame"
              width="100%"
              height="100%"
              title={url}
              className={`overflow-hidden`}
              src={url}
            ></iframe> */}
            <YouTube
              className={"rounded-lg"}
              videoId={url}
              opts={{
                width: "660",
                height: "455",
                playerVars: {
                  autoplay: 1,
                  controls: 1,
                  rel: 0,
                  showinfo: 0,
                  mute: 1,
                  loop: 1,
                },
              }}
              onEnd={videoSelesai}
            />
          </div>
        </div>
      )}
    </div>
  );
};

function ScreenBanner({ list, durasi }) {
  //   console.log(list[0]);

  return (
    <>
      <h1>
        <Text media={list} durasi={durasi} />
      </h1>
      {/* {!isVideo ? (
        <img src={`http://localhost:3001/files/${url}`} alt="" />
      ) : isAsset ? (
        // <video src={`http://localhost:3001/files/${url}`} autoPlay />
        <div className="w-auto h-full flex flex-col justify-center items-center ">
          <video
            controls
            muted
            autoPlay
            loop
            // width="100%"
            // height="100%"
            className="w-full h-full object-cover"
          >
            <source
              src={`http://localhost:3001/files/${url}`}
              type="video/mp4"
            ></source>
          </video>
        </div>
      ) : (
        <div className="w-auto h-full flex flex-col justify-center items-center ">
          <div className="w-full h-full flex justify-center items-center relative">
            <iframe
              id="ytFrame"
              width="100%"
              height="100%"
              title="Youtube"
              className={`overflow-hidden`}
              src={url}
            ></iframe>
          </div>
        </div>
      )} */}
    </>
  );
}

export default ScreenBanner;
