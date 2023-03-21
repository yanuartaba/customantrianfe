import React from "react";
import FooterCard from "./FooterCard";
import YouTube from "react-youtube";

function VideoCard({ isAsset, url, id, theme }) {
  // const { isAsset, url, id } = { ...props };

  // console.log(theme);
  // console.log(props);

  return (
    <>
      {isAsset ? (
        // <video src={`http://localhost:3001/files/${url}`} autoPlay />
        <div
          className={`w-auto h-auto flex flex-col justify-center items-center border-solid border-2 ${theme.secondary} rounded-md`}
        >
          <video controls muted autoPlay>
            <source
              src={`${process.env.REACT_APP_BACKEND_URL}/files/${url}`}
              type="video/mp4"
            ></source>
          </video>

          <FooterCard url={url} id={id} theme={theme} />
        </div>
      ) : (
        <div
          className={`w-auto h-auto flex flex-col justify-center items-center border-solid border-2 ${theme.secondary} rounded-md`}
        >
          <div className="w-full h-auto flex justify-center items-center relative">
            {/* <iframe
              title={url}
              className="overflow-hidden w-full h-[200px]"
              src={url}
            ></iframe> */}
            <YouTube
              videoId={url}
              opts={{
                width: "515",
                height: "220",
                playerVars: {
                  autoplay: 0,
                  controls: 1,
                  rel: 0,
                  showinfo: 0,
                  mute: 1,
                  loop: 1,
                },
              }}
            />
          </div>
          {/* <div className="w-full p-4 flex flex-row justify-between bg-blue-500 text-gray-50">
            <p className="cursor-pointer">Youtube Link</p>
            <button
              type="button"
              className="bg-red-500 px-4 py-1 cursor-pointer"
            >
             
              hapus
            </button>
          </div> */}
          <FooterCard url="Youtube Link" id={id} theme={theme} />
        </div>
      )}
    </>
  );
}

export default VideoCard;
