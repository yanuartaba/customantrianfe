import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IoCaretBackCircleSharp,
  IoCaretForwardCircleSharp,
} from "react-icons/io5";
import { Audio } from "react-loader-spinner";

import socketIO from "socket.io-client";

import Cta from "../sound/Airport_Bell.mp3";
import Bell from "../img/bell.png";
import BellPlus from "../img/bellPlus.png";
import Back from "../img/back.png";
import Next from "../img/next.png";
import axios from "axios";

function Dashboard({ theme }) {
  const [isWave, setIsWave] = useState(false);
  const [isCall, setIsCall] = useState(false);
  const [listAntrean, setListAntrean] = useState([]);
  const [selectAntrian, setSelectAntrian] = useState([]);
  const [isBackActive, setIsBackActive] = useState(false);
  const [backStep, setBackStep] = useState(0);
  const [pulseLabel, setPulseLabel] = useState(["Ready"]);
  const [admin, setAdmin] = useState([]);
  const [cardVisual, setCardVisual] = useState(true);
  const [totalAntrian, setTotalAntrian] = useState([]);
  const [task, setTask] = useState([]);
  const [callText, setCallText] = useState("");
  const [isCallText, setIsCallText] = useState(false);

  const socket = socketIO.connect(`${process.env.REACT_APP_BACKEND_URL}`);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const playCTA = () => {
    setIsCallText(false);
    setPulseLabel("CTA");
    playAudioLoader();
    const audioElement = document.querySelector("audio");
    audioElement.play();
  };

  const textToSpeech = (text) => {
    setTimeout(() => {
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(text);
      utterThis.lang = "id-ID";
      utterThis.rate = 0.8;
      synth.speak(utterThis);
      setPulseLabel("Play CTA");
      playAudioLoader();
      utterThis.onend = (event) => {
        setIsCall(false);
        setIsWave(false);
        setPulseLabel("Ready");
        setCallText("");
      };
    }, 1000);
  };

  const finishCta = () => {
    setIsCall(false);
    setIsWave(false);
    setPulseLabel("Ready");

    textToSpeech(callText);
  };

  const attentionCall = () => {
    setIsCallText(true);
  };

  const playAudioLoader = () => {
    setIsWave(true);
    setIsCall(true);
  };

  const getToken = () => {
    const dataToken = localStorage.getItem("token-counter");

    const token = JSON.parse(dataToken);

    return token;
  };

  const getPetugasId = async () => {
    const token = getToken();

    const petugas = await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })
      .then((res) => {
        return res.data.id;
      })
      .catch((error) => console.log(error));
    // console.log(petugas.data.id);
    return petugas;
  };

  const finishTask = async (antrianId) => {
    const petugasId = await getPetugasId();
    const token = getToken();

    const payload = {
      petugasId,
    };

    await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/tasks/${antrianId}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }
    );

    setTask([]);
    return "ok";
  };

  const createTask = async (group, counterId, antrianId) => {
    const petugasId = await getPetugasId();
    const token = getToken();

    console.log(petugasId);
    const payload = {
      group,
      petugasId,
      counterId,
      antrianId,
    };

    const newTask = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/tasks`,
      payload,
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }
    );

    setTask(newTask);
    return "ok";
  };

  const backAntrian = async (e) => {
    e.preventDefault();
    const localAdmin = localStorage.getItem("login-counter");
    const parseAdmin = await JSON.parse(localAdmin);
    setAdmin(parseAdmin);
    const lists = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/antrian?group=${parseAdmin.group}&isFinish=false&isSkip=true`
    );
    // console.log(lists);
    if (lists.data.length < 1) {
      alert("Tidak ada antrian tertunda");
    } else {
      const res = await lists.data[backStep];

      if (backStep < lists.data.length) {
        const findExistId = listAntrean.filter(
          (antrian) => antrian.id === res.id
        );

        if (findExistId) {
          setBackStep(backStep + 1);
        }
        setListAntrean([res, ...listAntrean]);
      }
    }
  };

  useEffect(() => {
    const findSkip = async () => {
      const localAdmin = localStorage.getItem("login-counter");
      const parseAdmin = await JSON.parse(localAdmin);
      setAdmin(parseAdmin);
      const lists = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/antrian?group=${parseAdmin.group}&isFinish=false&isSkip=true`
      );

      if (lists.data.length > 0) {
        setIsBackActive(true);
      }
    };
  }, []);

  const nextAntrian = async () => {
    const synth = window.speechSynthesis;
    const strNoCounter = addSpace(admin.noCounter);
    const strGroupCounter = admin.groupName;
    const counterId = admin.counterId;
    // console.log(listAntrean[0].nomor);
    const utterThis = new SpeechSynthesisUtterance(
      `Nomor Urut ${listAntrean[0].nomor}${listAntrean[0].group}, silahkan ke counter ${strGroupCounter},  ${strNoCounter}`
    );
    utterThis.lang = "id-ID";
    utterThis.rate = 0.8;
    synth.speak(utterThis);
    setPulseLabel("Next");
    playAudioLoader();

    utterThis.onend = (event) => {
      setIsCall(false);
      setIsWave(false);
      setPulseLabel("Ready");
    };

    socket.emit("pingClient", {
      msg: "ping from client",
      socketID: socket.id,
      id: listAntrean[0].id,
      noAntrian: listAntrean[0].nomor + listAntrean[0].group,
      groupCounter: strGroupCounter,
      noCounter: admin.noCounter,
    });

    await createTask(listAntrean[0].group, counterId, listAntrean[0].id);
  };

  const recallAntrian = async () => {
    const synth = window.speechSynthesis;
    const getAntrian = await listAntrean[0].nomor;
    console.log(getAntrian);
    const utterThis = new SpeechSynthesisUtterance(
      `Perhatian untuk Nomor Urut ${getAntrian}!. Segera ke counter ${admin.noCounter}, apabila tidak hadir nomor antrian anda akan hangus!`
    );
    utterThis.lang = "id-ID";
    utterThis.rate = 0.8;
    synth.speak(utterThis);
    setPulseLabel("Recall");
    playAudioLoader();

    utterThis.onend = (event) => {
      setIsCall(false);
      setIsWave(false);
      setPulseLabel("Ready");
    };
  };

  const addSpace = (str) => {
    return str.split("").join(", ");
  };

  const getAdmin = async () => {
    const localAdmin = localStorage.getItem("login-counter");
    const parseAdmin = await JSON.parse(localAdmin);
    setAdmin(parseAdmin);
  };

  const antrianFinish = async () => {
    const dataToken = localStorage.getItem("token-counter");

    const token = JSON.parse(dataToken);

    const antrianId = listAntrean[0].id;

    const antrian = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/antrian/${antrianId}`,
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }
    );

    if (antrian) {
      await finishTask(antrianId);
      listAntrean.shift();
    } else {
      alert("something wrong with server");
    }
  };

  const antrianSkip = async () => {
    const dataToken = localStorage.getItem("token-counter");

    const token = JSON.parse(dataToken);

    const antrianId = listAntrean[0].id;

    const antrian = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/antrian/skip/${antrianId}`,

      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }
    );

    if (antrian) {
      await finishTask(antrianId);
      listAntrean.shift();
    } else {
      alert("something wrong with server");
    }
  };

  useEffect(() => {
    const getListAntrean = async (group) => {
      const localAdmin = localStorage.getItem("login-counter");
      const parseAdmin = await JSON.parse(localAdmin);
      setAdmin(parseAdmin);
      const lists = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/antrian?group=${parseAdmin.group}&isFinish=false&isSkip=false`
      );
      setListAntrean(lists.data);
      setSelectAntrian(lists.data[0]);
    };

    const getTotalAntrian = async () => {
      const menus = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/menus`
      );
      setTotalAntrian(menus.data);
    };
    getListAntrean();
    getTotalAntrian();

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("connect");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("disconnect");
    });
  }, []);

  return (
    <div className="w-full md:w-[65%] lg:w-[45%] h-screen flex flex-col items-center justify-center gap-5">
      <div className="w-full h-[45rem] bg-[#edf4fe] flex flex-col gap-4 justify-center">
        <h1 className="text-4xl font-bold text-center">SYSTEM ANTRIAN</h1>
        <div className="flex flex-row w-full px-16 gap-4 mt-4">
          <div
            className={`w-[50%] h-[15rem] ${theme.secondary} border-4 border-white rounded-md flex flex-col items-center justify-center`}
          >
            {listAntrean.length > 0 &&
              (isCall ? (
                <motion.h1
                  initial={{ opacity: 0.2, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    repeat: 5,
                  }}
                  className={`text-8xl font-bold ${theme.textprimary}`}
                >
                  {listAntrean[0].nomor}
                  {listAntrean[0].group}
                </motion.h1>
              ) : (
                <h1 className={`text-8xl font-bold ${theme.textprimary}`}>
                  {listAntrean[0].nomor}
                  {listAntrean[0].group}
                </h1>
              ))}
          </div>
          <div
            className={`w-[50%] h-[15rem] ${theme.secondary} border-4 border-white rounded-md flex flex-col items-center justify-center`}
          >
            <h1 className={`text-4xl ${theme.textprimary}`}>
              {admin.groupName} : {admin.noCounter}
            </h1>
          </div>
        </div>
        <div className="flex flex-row w-full px-16 gap-4 mt-4">
          <div className="w-[50%] flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <motion.button
                whileTap={isWave === false ? { scale: 0.9 } : { scale: 1 }}
                disabled={isWave}
                onClick={antrianSkip}
                className={`"w-full ${
                  isWave === false ? "bg-red-700" : "bg-[#D1D4DB]"
                } py-4 tracking-wide text-2xl font-bold text-gray-100 rounded-md border-4 border-white
              ${isWave === false ? "hover:bg-red-500" : "hover:bg-[#D1D4DB]"}
                `}
              >
                SKIP
              </motion.button>

              <motion.button
                whileTap={isWave === false ? { scale: 0.9 } : { scale: 1 }}
                disabled={isWave}
                onClick={antrianFinish}
                className={`"w-full ${
                  isWave === false ? "bg-[#009F3C]" : "bg-[#D1D4DB]"
                } py-4 tracking-wide text-2xl font-bold text-gray-100 rounded-md border-4 border-white
              ${isWave === false ? "hover:bg-green-500" : "hover:bg-[#D1D4DB]"}
                `}
              >
                FINISH
              </motion.button>
            </div>

            <div className="w-full flex flex-row justify-between gap-4">
              <audio src={Cta} onEnded={finishCta}></audio>
              <motion.button
                whileTap={isWave === false ? { scale: 0.9 } : { scale: 1 }}
                onClick={attentionCall}
                disabled={isWave}
                className={`${
                  isWave === false ? theme.primary : "bg-[#D1D4DB]"
                } w-full flex flex-col items-center justify-center py-4 rounded-md ${
                  isWave === false
                    ? theme.hoverBgSecondary
                    : "hover:bg-[#D1D4DB]"
                }`}
              >
                <img src={Bell} alt="" />
                <h1 className="text-3xl font-semibold text-gray-100">Call</h1>
              </motion.button>
              <motion.button
                whileTap={isWave === false ? { scale: 0.9 } : { scale: 1 }}
                disabled={isWave}
                onClick={recallAntrian}
                className={`${
                  isWave === false ? theme.primary : "bg-[#D1D4DB]"
                } w-full flex flex-col items-center justify-center py-4 rounded-md ${
                  isWave === false
                    ? theme.hoverBgSecondary
                    : "hover:bg-[#D1D4DB]"
                }`}
              >
                <img src={BellPlus} alt="" />
                <h1 className="text-3xl font-semibold text-gray-100">Recall</h1>
              </motion.button>
            </div>

            <div className="w-full flex flex-row justify-between gap-4">
              <motion.button
                whileTap={isWave === false ? { scale: 0.9 } : { scale: 1 }}
                disabled={isWave && isBackActive}
                onClick={backAntrian}
                className={`bg-[#D1D4DB] w-full flex flex-col items-center justify-center py-4 rounded-md ${
                  isWave === false ? "hover:bg-gray-400" : "hover:bg-[#D1D4DB]"
                }`}
              >
                <img src={Back} alt="" />
                <h1 className="text-3xl font-semibold text-gray-100">Back</h1>
              </motion.button>
              <motion.button
                whileTap={isWave === false ? { scale: 0.9 } : { scale: 1 }}
                disabled={isWave}
                onClick={nextAntrian}
                className={`bg-[#D1D4DB] w-full flex flex-col items-center justify-center py-4 rounded-md ${
                  isWave === false ? "hover:bg-gray-400" : "hover:bg-[#D1D4DB]"
                }`}
              >
                <img src={Next} alt="" />
                <h1 className="text-3xl font-semibold text-gray-100">Next</h1>
              </motion.button>
            </div>
          </div>
          <div className="w-[50%] bg-white flex flex-col border-1 border-b-slate-600">
            <div
              className={`${theme.primary} w-full py-5 tracking-wide font-bold text-gray-100 
                            flex flex-row justify-between items-center px-2`}
            >
              <IoCaretBackCircleSharp
                onClick={() => setCardVisual(!cardVisual)}
                className="text-2xl cursor-pointer"
              />
              <h1 className="text-xl">
                {cardVisual ? "Audio Visualizer" : "Antrian"}
              </h1>
              <IoCaretForwardCircleSharp
                onClick={() => setCardVisual(!cardVisual)}
                className="text-2xl cursor-pointer"
              />
            </div>
            {cardVisual ? (
              <div className="w-full h-full flex flex-col justify-center items-center">
                {isWave ? (
                  <>
                    <Audio
                      height="100"
                      width="100"
                      color={theme.bgAudioLoader}
                      ariaLabel="audio-loading"
                      wrapperStyle={{}}
                      wrapperClass="wrapper-class"
                      visible={true}
                    />
                    <p>{pulseLabel}</p>
                  </>
                ) : (
                  <p className={`${theme.textprimary} font-semibold`}>
                    {pulseLabel}
                  </p>
                )}
              </div>
            ) : (
              <div className="px-6 py-4 m-0 w-full h-full flex flex-col">
                <div className="flex flex-row justify-between gap-3 mb-3">
                  <h1
                    className={`text-2xl font-semibold ${theme.textprimary} ml-2`}
                  >
                    Layanan
                  </h1>
                  <h1
                    className={`text-2xl font-semibold ${theme.textprimary} ml-2`}
                  >
                    Jumlah Antrian
                  </h1>
                </div>
                {totalAntrian.length > 0 &&
                  totalAntrian.map((total) => (
                    <div
                      className={`flex flex-row justify-between items-center my-1 ${theme.secondary} pl-2 py-2`}
                    >
                      <h3 className={`w-full ${theme.textprimary}`}>
                        {total.label}
                      </h3>
                      <h3 className={`text-center w-full ${theme.textprimary}`}>
                        {total.jumlahAntrian}
                      </h3>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* modal calltext */}
      {isCallText && (
        <div
          tabindex="-1"
          class="backdrop-blur-sm bg-slate-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex justify-center items-center"
        >
          <div class="relative w-full h-full max-w-md md:h-auto">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 p-5">
              <div className="flex flex-col gap-3">
                <textarea
                  type="text"
                  placeholder="Ketik pesan anda disini..."
                  maxLength={100}
                  onChange={(e) => setCallText(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white
                                "
                ></textarea>
              </div>

              <div className="flex flex-row justify-end gap-4 mt-3">
                <button
                  onClick={() => setIsCallText(!isCallText)}
                  className="bg-slate-200 px-5 py-2 text-gray-600 rounded-md hover:bg-slate-500 hover:text-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={playCTA}
                  className="hover:bg-blue-400 hover:text-gray-600
                    bg-blue-500 px-5 py-2 text-gray-50 rounded-md"
                >
                  Play Text
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
