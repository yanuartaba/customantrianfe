import axios from "axios";
import React, { useState } from "react";
import { VscError } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { Blocks } from "react-loader-spinner";

function Outsource() {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [isUrl, setIsUrl] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [payload, setPayload] = useState([]);
  const [canUpload, setCanUpload] = useState(false);
  // const [embedLink, setEmbedLink] = useState("");
  const [idVideo, setIdVideo] = useState("");
  const [click, setClick] = useState(0);

  const urlYoutube = (URL) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/)?([a-zA-Z0-9\-_]+)/;

    const match = url.match(regex);

    // if (match) {
    //   const videoId = match[1];
    //   setIdVideo(videoId);
    // }
    return match;
  };

  const getInfoUrl = async () => {
    setIsLoading(true);
    setClick(click + 1);
    setTimeout(() => {
      const isYoutube = urlYoutube(url);
      if (!isYoutube) {
        setIsUrl(false);
        setErrorMsg("Hanya memperbolehkan youtube url");
        setCanUpload(false);
      } else {
        setIdVideo(isYoutube);
        setIsUrl(true);
        setCanUpload(true);
        embedVideo(url);
        ok();
      }

      console.log(idVideo);
      setIsLoading(false);
    }, 1000);
  };

  const embedVideo = (yotubeUrl) => {
    const splitUrl = yotubeUrl.split("=");
    // const idVideo = splitUrl[1];
    // const newLink = `https://www.youtube.com/embed/${idVideo}?autoplay=1&controls=0&showinfo=0&loop=1`;
    // const newLink = `https://www.youtube.com/embed/${idVideo}?autoplay=1&mute=1&controls=0&showinfo=0&enablejsapi=1`;
    // setEmbedLink(newLink);
    setIdVideo(splitUrl[1]);
    // setCanUpload(true);
  };

  const ok = () => {
    setPayload({
      url: idVideo,
      isVideo: true,
      isAsset: false,
      type: "video",
    });
  };

  const uploadMedia = async () => {
    console.log(payload);

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/media/upload`,
        payload
      );

      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && (
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
          <h3>Please wait</h3>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label>URL Media</label>
        <div className="relative w-full">
          {!isUrl && (
            <div className="flex flex-col gap-2 bg-red-200 rounded-md border-red-600 border-2 p-4 mb-3">
              <div className="flex gap-3 items-center">
                <VscError className="text-2xl font-semibold text-red-600" />
                <h3 className=" font-semibold text-red-600">{errorMsg}</h3>
              </div>
            </div>
          )}

          <div>
            <div className="flex rounded-md shadow-sm">
              <input
                onChange={(e) => setUrl(e.target.value)}
                onPaste={(e) => setUrl(e.target.value)}
                type="text"
                id="hs-trailing-button-add-on"
                name="hs-trailing-button-add-on"
                className="py-3 px-4 block w-full border border-slate-300  text-sm shadow-sm placeholder-gray-500
                        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white"
              />
              <button
                onClick={getInfoUrl}
                type="button"
                className="py-3 px-4 inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-r-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              >
                Get Info
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full justify-start mt-4">
        {click > 1 && (
          <button
            onClick={uploadMedia}
            disabled={!canUpload}
            className={`px-4 py-2  ${
              canUpload ? "bg-blue-500" : "bg-gray-500"
            }  text-gray-50 rounded-md`}
          >
            Upload
          </button>
        )}
      </div>
    </>
  );
}

export default Outsource;
