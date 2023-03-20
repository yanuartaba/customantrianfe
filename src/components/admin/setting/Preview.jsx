import React from "react";
import YouTube from "react-youtube";

function Preview({ media, width, height }) {
  const norm = media[0] ? media[0] : media;

  const { isVideo, isAsset, url } = { ...norm };
  console.log(height);

  return (
    <>
      {/* <h1 className="font-semibold mb-2">Preview</h1> */}
      {!isVideo ? (
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
            {/* <iframe
              id="ytFrame"
              width={width}
              height={height}
              title={url}
              className={`overflow-hidden`}
              src={url}
            ></iframe> */}
            <YouTube
              videoId={url}
              opts={{
                width: "725",
                height: "450",
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
        </div>
      )}
    </>
  );
}

export default Preview;
