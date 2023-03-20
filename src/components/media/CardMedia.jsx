import React from "react";
import VideoCard from "./VideoCard";

// import { GoTrashcan } from "react-icons/go";
import FooterCard from "./FooterCard";

function CardMedia({ props, theme }) {
  const { url, isVideo, isAsset, id } = { ...props };
  // const url = props.url;
  // console.log(theme);

  return (
    <>
      <div className="w-auto m-2">
        {!isVideo ? (
          <div
            className={`w-auto h-auto flex flex-col justify-center items-center border-solid border-2 ${theme.secondary} rounded-md`}
          >
            <img
              className="p-4"
              src={`http://localhost:3001/files/${url}`}
              alt=""
            />
            {/* <div className="w-full p-4 flex flex-row justify-between bg-blue-500 text-gray-50">
              <p>{url}</p>
              <button>
                <GoTrashcan className="cursor-pointer" />
              </button>
            </div> */}
            <FooterCard url={url} id={id} theme={theme} />
          </div>
        ) : (
          // <img src={`http://localhost:3001/files/${url}`} />
          // <h1>ini image</h1>
          // <img src="" alt="" />
          // <h1>ini video</h1>
          // <VideoCard props={{ isAsset, url, id }} />
          <VideoCard url={url} isAsset={isAsset} id={id} theme={theme} />
          // <></>
        )}

        {/* <h1>test</h1> */}
      </div>
    </>
  );
}

export default CardMedia;
