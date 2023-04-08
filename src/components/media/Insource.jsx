import axios from "axios";
import React, { useState, useEffect } from "react";
import { VscError } from "react-icons/vsc";
import { Blocks } from "react-loader-spinner";

function Insource() {
  const [file, setFile] = useState(null);

  const [canUpload, setCanUpload] = useState(false);
  const [isType, setIsType] = useState(true);
  // const [filename, setFilename] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getType = (type) => {
    const x = type.split("/");
    const res = x[0];
    return res;
  };

  // const uploadFile = async () => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:3001/menus/file",
  //       formData,
  //       {
  //         headers: {
  //           "Content-type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     const url = await res.data.file.filename;
  //     console.log(url);
  //     setFilename(url);
  //   } catch (error) {
  //     setIsType(false);
  //     setCanUpload(false);
  //   }
  // };

  const uploadMedia = async () => {
    setIsLoading(true);
    // console.log(file);
    const type = getType(file.type);
    // console.log(type);
    if (type !== "video" && type !== "image") {
      setIsType(false);
      setCanUpload(false);
      setIsLoading(false);
    } else {
      // await uploadFile();

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/menus/file`,
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );

      const url = await res.data.file.filename;

      const payload = {
        url: url,
        isVideo: type === "video" ? true : false,
        isAsset: true,
        type: type,
      };

      setTimeout(async () => {
        try {
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/media/upload`,
            payload
          );
          setIsLoading(false);
          setFile(null);
          setCanUpload(false);
          window.location.reload(false);
        } catch (error) {
          setIsLoading(false);
          setFile(null);
          setCanUpload(false);
          console.log(error);
        }
      }, 2000);
    }
  };

  useEffect(() => {
    if (file !== null) {
      setCanUpload(true);
    }
  }, [file, canUpload]);

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
      {!isType && (
        <div className="flex flex-col gap-2 bg-red-200 rounded-md border-red-600 border-2 p-4 mb-3">
          <div className="flex gap-3 items-center">
            <VscError className="text-2xl font-semibold text-red-600" />
            <h3 className=" font-semibold text-red-600">
              Format file tidak mendukung
            </h3>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label>File Upload</label>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setIsType(true);
          }}
          accept="video/*, image/*"
        />
      </div>

      <div className="w-full justify-start mt-4">
        <button
          onClick={uploadMedia}
          disabled={!canUpload}
          className={`px-4 py-2  ${
            canUpload ? "bg-blue-500" : "bg-gray-500"
          }  text-gray-50 rounded-md`}
        >
          Upload
        </button>
      </div>
    </>
  );
}

export default Insource;
