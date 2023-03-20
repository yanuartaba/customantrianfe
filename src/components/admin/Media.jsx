import React, { useState, useEffect } from "react";

import axios from "axios";
import { Blocks } from "react-loader-spinner";
import { VscError } from "react-icons/vsc";
import Outsource from "../media/Outsource";
import Insource from "../media/Insource";
import Masonry from "react-masonry-css";
import CardMedia from "../media/CardMedia";

function Media({ theme }) {
  const [isOutSource, setIsOutSource] = useState(true);
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getMedia = () => {
    // const data = axios.get()
    setIsLoading(true);

    setTimeout(async () => {
      const data = await axios.get("http://localhost:3001/media");
      // console.log(data.data);
      setMedia(data.data);
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    getMedia();
    // console.log(media);
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
          <h3>Loading</h3>
        </div>
      )}
      <div className="w-full flex flex-col">
        <div
          className={`w-full ${theme.primary} flex flex-col justify-center items-center rounded-t-lg py-4`}
        >
          <h1 className="text-2xl text-gray-50 font-semibold">Media</h1>
        </div>
        <div className="w-full flex flex-col outline-dotted outline-1 -outline-offset-1">
          <div className="w-full flex flex-col items-start p-4">
            <h3>Tambah Baru</h3>
            <div className="flex flex-row gap-4 my-2">
              <div className="flex flex-row gap-2">
                <input
                  type="radio"
                  onChange={() => setIsOutSource(true)}
                  name="choice"
                  checked={isOutSource}
                />
                <label>Out Source</label>
              </div>
              <div className="flex flex-row gap-2">
                <input
                  type="radio"
                  onChange={() => setIsOutSource(false)}
                  name="choice"
                />
                <label>In Source</label>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col p-4">
            {isOutSource ? <Outsource /> : <Insource />}
          </div>
        </div>
      </div>

      <div className="my-4">
        <Masonry
          breakpointCols={3}
          className="flex"
          columnClassName="my-masonry-grid_column"
        >
          {media.map((data) => (
            <CardMedia props={data} theme={theme} />
          ))}
        </Masonry>
      </div>
    </>
  );
}

export default Media;
