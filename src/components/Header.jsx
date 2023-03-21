import React, { useState, useEffect } from "react";

function Header({ text, logoHeader }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState(null);

  // const getDate = () => {
  //   const options = {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   };
  //   const date = new Date();
  //   console.log(date.toLocaleDateString("id-ID", options));
  //   setDate(date.toLocaleDateString("id-ID", options));
  // };

  const refreshClock = () => {
    setTime(new Date().toLocaleTimeString("id-ID"));
  };

  // const getTime = () => {
  //   const timerId = setInterval(refreshClock, 1000);
  //   return function cleanup() {
  //     clearInterval(timerId);
  //   };
  // };
  useEffect(() => {
    // console.log({ logoHeader });
    const timerId = setInterval(refreshClock, 1000);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date();
    // console.log(date.toLocaleDateString("id-ID", options));
    setDate(date.toLocaleDateString("id-ID", options));
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);
  return (
    <div className="w-full bg-white dshadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative top-0">
      <div className="fixed top-0 w-full z-10 flex justify-between px-10 py-4">
        <div className="flex items-center gap-3">
          <img
            className="h-[50px] w-auto"
            src={`${process.env.REACT_APP_BACKEND_URL}/files/${logoHeader}`}
            alt=""
          />
          <h3 className="text-2xl font-bold">{text}</h3>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{date}</h1>
          <h1 className="text-xl font-semibold text-gray-600">|</h1>
          <h1 className="text-xl font-semibold">{time}</h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
