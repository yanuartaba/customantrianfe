import axios from "axios";
import React, { useState, useEffect } from "react";
import Preview from "./Preview";
import { useNavigate } from "react-router-dom";

import { Blocks } from "react-loader-spinner";

function Banner({ theme, durasiTransition, fileMedia }) {
  const navigate = useNavigate();
  const [durasi, setDurasi] = useState(durasiTransition);
  const [isVideo, setIsVideo] = useState(true);
  const [medias, setMedias] = useState([]);
  const [filterMedias, setFilterMedias] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaBanner, setMediaBanner] = useState([]);
  // const [addBanner, setAddBaner] = useState([
  //   JSON.parse(setting.file_banner) || {},
  // ]);
  const [addBanner, setAddBaner] = useState([]);

  // const mediaBanner = JSON.parse(setting.file_banner);
  // console.log(typeof durasiTransition);

  const changeFilter = () => {
    const data = medias.filter((media) => media.isVideo === isVideo);

    setFilterMedias(data);
  };

  const filterData = (e) => {
    console.log(e);
    setIsVideo(e);
    changeFilter();
  };

  const pickMedia = (e) => {
    let getMedia = filterMedias.filter((media) => media.id === parseInt(e));

    setSelectedMedia(getMedia);
  };

  const updateSetting = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const files = mediaBanner.concat(addBanner);

    const payload = {
      banner_type: !isVideo ? "VIDEO" : "IMAGE",
      durasi_transition: parseInt(durasi),
      file_banner: JSON.stringify(files),
    };

    // console.log(JSON.stringify(selectedMedia[0]));

    await axios.patch(`http://localhost:3001/setting`, payload, {
      // headers: { Authorization: `Bearer ${token.access_token}` },
      headers: { codepipe: "GJddPyb9jqK1Bxm68wqLRcYsNPt2UKJC" },
    });

    setTimeout(() => {
      setIsLoading(false);
      navigate(0);
    }, 2000);
  };

  const addMedia = () => {
    // let banner = addBanner.push(selectedMedia[0]);
    setAddBaner([...addBanner, selectedMedia[0]]);
    // console.log(addBanner);
  };

  const removeMediaBanner = (idx) => {
    // let listBanner = mediaBanner.filter((media) => media.id !== id);
    console.log(idx);
    mediaBanner.splice(idx, 1);
    setMediaBanner([...mediaBanner]);
  };

  const removeBanner = (idx) => {
    // let listBanner = addBanner.filter((media) => media.id !== id);
    addBanner.splice(idx, 1);
    // console.log(addBanner);
    // let listBanner = addBanner;
    // console.log();
    setAddBaner([...addBanner]);
  };

  // const removeMediaBanner = () => {};

  useEffect(() => {
    const getMedias = async () => {
      setIsLoading(true);
      const datas = await axios.get("http://localhost:3001/media");

      const filter = datas.data.filter((data) => data.isVideo === false);

      setMedias(datas.data);
      setFilterMedias(filter);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    getMedias();
    setDurasi(durasiTransition);
    setMediaBanner(fileMedia);
    // document
    //   .getElementsByClassName("ytp-large-play-button")
    //   .onClick(console.log("dasdasd"));
    // setTimeout(() => {

    // }, 3000);
  }, [durasiTransition, fileMedia]);

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
          <h3>Please wait while saving setting</h3>
        </div>
      )}

      <div className="w-full flex flex-col gap-3">
        <div
          className={`w-full ${theme.primary} text-gray-50 rounded-lg flex flex-col justify-center items-center py-2`}
        >
          <h1 className="font-bold text-xl">Banner Setting</h1>
        </div>

        <div className="grid grid-flow-row grid-cols-2 gap-4">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <div
                className={`w-[60%] ${theme.secondary} py-2 px-2 rounded-md`}
              >
                <p className="font-semibold ml-2">Jenis Banner</p>
              </div>
              <div className="w-full flex flex-col p-4 gap-1">
                <div className="flex flex-row gap-2">
                  <input
                    type="radio"
                    name="jenisBanner"
                    // checked={isVideo}
                    onClick={() => filterData(!isVideo)}
                  />
                  <label className="font-semibold">Image</label>
                </div>

                <div className="flex flex-row gap-2">
                  <input
                    type="radio"
                    name="jenisBanner"
                    onClick={() => filterData(!isVideo)}
                  />
                  <label className="font-semibold">Video</label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <div
                className={`w-[60%] ${theme.secondary} py-2 px-2 rounded-md`}
              >
                <p className="font-semibold ml-2">Durasi Banner</p>
              </div>
              <div className="w-full flex flex-col p-4 gap-1">
                <div className="w-full flex flex-col">
                  <input
                    className="range  accent-green-500"
                    type="range"
                    value={durasi}
                    min="1"
                    max="60"
                    onChange={(e) => setDurasi(e.target.value)}
                    onMouseMove={(e) => setDurasi(e.target.value)}
                  ></input>
                  <p className="font-semibold">{durasi} Menit</p>
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
                  <p className="font-semibold ml-2">Pilih Media</p>
                </div>

                <div className="w-full">
                  <select
                    onChange={(e) => pickMedia(e.target.value)}
                    className={`w-[60%] ${theme.primary} text-gray-50 p-2`}
                  >
                    <option disabled>Pilih salah satu</option>
                    {filterMedias &&
                      filterMedias.map((media) => (
                        <option key={media.id} value={media.id}>
                          {media.url}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col gap-3 mt-5">
                  <div className="flex items-end">
                    <button
                      className={`${
                        selectedMedia.length < 1
                          ? theme.secondary
                          : theme.primary
                      } ${theme.textsecondary} px-5 py-2 rounded-md`}
                      onClick={addMedia}
                      disabled={selectedMedia.length < 1}
                    >
                      Add
                    </button>
                  </div>

                  {/* <div className="w-full">
                    <table class="w-full table-auto">
                      <thead
                        className={`border-1 rounded-lg ${theme.secondary}`}
                      >
                        <tr>
                          <th className="py-1">No</th>
                          <th className="py-1">Type</th>
                          <th className="py-1">Media</th>
                        </tr>
                      </thead>
                    </table>
                  </div> */}

                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Filename
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Asset
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mediaBanner &&
                          mediaBanner.map((media, idx) => (
                            <tr
                              key={idx}
                              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                              <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                {media.isAsset ? media.url : "Link"}
                              </th>
                              <td className="px-6 py-4">
                                {media.isAsset ? "Localfile" : "Youtube"}
                              </td>
                              <td className="px-6 py-4">{media.type}</td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeMediaBanner(idx);
                                  }}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        {addBanner &&
                          addBanner.map((banner, idx) => (
                            <tr
                              key={idx}
                              className={`${theme.secondary} border-b dark:bg-gray-800 dark:border-gray-700`}
                            >
                              <th
                                scope="row"
                                className={`px-6 py-4 font-medium whitespace-nowrap ${theme.textprimary}`}
                              >
                                {banner.isAsset ? banner.url : "Link"}
                              </th>
                              <td className="px-6 py-4 text-black">
                                {banner.isAsset ? "Localfile" : "Youtube"}
                              </td>
                              <td className="px-6 py-4 text-black">
                                {banner.type}
                              </td>
                              <td className="px-6 py-4">
                                {" "}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeBanner(idx);
                                  }}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" w-full h-auto">
            <div className="p-3">
              <Preview media={selectedMedia} width={"100%"} height={"360px"} />
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

export default Banner;
