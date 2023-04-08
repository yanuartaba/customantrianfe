import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import socketIO from "socket.io-client";

const Menu = (props) => {
  const socket = socketIO.connect(`${process.env.REACT_APP_BACKEND_URL}`);
  // console.log(props.textPrint);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketId, setSocketId] = useState("");
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const [showTooltip, setShowTooltip] = useState(false);
  const { label, image, urlParam, description, codeGroup, isActive } =
    props.menu;
  const [date, setDate] = useState("");
  const themeRef = useRef(null);
  const HandleNewAntrian = async (e) => {
    e.preventDefault();

    const payload = {
      group: codeGroup,
    };
    const x = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/antrian`,
      payload
    );
    // console.log(x.data);
    let tikeNumber = (await x.data.group) + (await x.data.nomor);

    let jam =
      "Jam :" +
      new Date(await x.data.createdAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    var win = window.open("", "_blank");
    var docDefinition = {
      content: [
        {
          image: "header",
          fit: [150, 150],
          alignment: "center",
        },
        {
          text: props.textPrint,
          fontSize: 48,
          alignment: "center",
          margin: [20, 0, 20, 0],
        },
        {
          text: "-----------------------------------------------------",
          fontSize: 32,
          alignment: "center",
          margin: [20, 0, 20, 0],
        },
        {
          text: tikeNumber,
          fontSize: 96,
          alignment: "center",
          margin: [40, 0, 40, 0],
        },
        {
          text: "-----------------------------------------------------",
          fontSize: 32,
          alignment: "center",
          margin: [20, 0, 20, 0],
        },
        {
          text: date,
          fontSize: 32,
          alignment: "center",
        },
        {
          text: jam,
          fontSize: 32,
          alignment: "center",
        },
        {
          text: "silahkan menunggu antrian",
          fontSize: 32,
          alignment: "center",
        },
      ],
      images: {
        header: `${process.env.REACT_APP_BACKEND_URL}/files/${props.logoPrint}`,
      },
      superMargin: {
        margin: [10, 0, 10, 0],
        fontSize: 15,
      },
    };

    pdfMake.createPdf(docDefinition).print({}, win);
    setTimeout(() => {
      win.close();

      socket.emit("newAntrian", {
        msg: "new antrian",
        isNew: true,
      });
    }, 500);
  };

  useEffect(() => {
    const date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setDate(date.toLocaleDateString("id-ID", options));

    socket.on("connect", () => {
      console.log("connect");
      setIsConnected(true);
      setSocketId(socket.id);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("disconnect");
    });
  }, [props]);

  return (
    <>
      {isActive && (
        <motion.div
          onClick={HandleNewAntrian}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          ref={themeRef}
          className={` ${props.theme.primary} w-full h-full relative col-auto  shadow-lg rounded-lg my-2 py-2 m-auto flex flex-col justify-center items-center overflow-hidden cursor-pointer`}
        >
          {description && (
            <AiOutlineQuestionCircle
              onClick={() => setShowTooltip(true)}
              className="absolute top-3 text-2xl right-3 transition duration-150 ease-in-out text-gray-100"
            />
          )}

          {showTooltip && (
            <motion.div
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 360 }}
              exit={{ rotateY: 0 }}
              // onClick={() => setShowTooltip(false)}
              className="bg-slate-700 absolute w-full h-full flex flex-col items-start justify-start"
            >
              <div className="w-full text-left relative h-7">
                <BiArrowBack
                  className="text-gray-100 text-2xl absolute top-2 left-2"
                  onClick={() => setShowTooltip(false)}
                />
              </div>
              <p className="text-slate-200 p-3 font-semibold">
                {" "}
                <i>{description}</i>
              </p>
            </motion.div>
          )}

          {image !== "" ? (
            <img
              // onClick={HandleNewAntrian}
              className="w-40 h-40"
              src={`${process.env.REACT_APP_BACKEND_URL}/files/${image}`}
              alt={urlParam}
            />
          ) : (
            <div
              // onClick={HandleNewAntrian}
              className="flex justify-center items-center h-[7rem] w-[7rem] rounded-full bg-slate-200 my-2"
            >
              <h1 className="text-center text-4xl font-bold">{codeGroup}</h1>
            </div>
          )}

          <h1 className="text-2xl font-semibold text-gray-100 px-2 text-center leading-6">
            {label}
          </h1>
        </motion.div>
      )}
    </>
  );
};

export default Menu;
