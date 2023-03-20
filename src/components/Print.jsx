import React, { useState, useEffect } from "react";
// import { CiHospital1 } from "react-icons/ci";
import { useSearchParams } from "react-router-dom";

function Print({ headerText, logoHeader }) {
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const [noAntrian, setNoAntrian] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleMessage = (event) => {
    if (event.data.action === "receipt-loaded") {
      setIsLoading(false);
    }
  };

  const printIframe = (id) => {
    const iframe = document.frames
      ? document.frames[id]
      : document.getElementById(id);
    const iframeWindow = iframe.contentWindow || iframe;

    iframe.focus();
    iframeWindow.print();

    return false;
  };

  useEffect(() => {
    // const path = location;
    // console.log(path);
    // const param = params
    // console.log(param.gets('no'))
    // console.log(params.get('no'));
    const getNo = searchParams.get("no");
    setNoAntrian(getNo);
    // console.log(getNo);
    // console.log({ logoHeader });
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date();
    // console.log(date.toLocaleDateString("id-ID", options));
    setDate(date.toLocaleDateString("id-ID", options));

    setTime(
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [searchParams]);

  return (
    <>
      <iframe
        id="receipt"
        src="/print"
        style={{ display: "none", margin: "0" }}
        title="Receipt"
      />
      <div className="flex flex-col gap-2 justify-center items-center mt-2">
        <img
          className="h-[40px] w-auto "
          src={`http://localhost:3001/files/${logoHeader}`}
          alt=""
        />
        <h3 className="font-bold text-md">{headerText}</h3>
        <div className="w-full border-[.5px] border-dashed border-gray-500"></div>
        {/* <h1 className="text-4xl font-bold">{noAntrian}</h1> */}
        <h1 className="text-4xl font-bold">{noAntrian}</h1>
        <h3 className="text-sm">{date}</h3>
        <h3 className="text-sm">Jam: {time}</h3>
        <div className="w-full border-[.5px] border-dashed border-gray-500"></div>
        <button onClick={() => printIframe("receipt")}>
          {isLoading ? "Loading..." : "Silahkan menunggu antrian"}
        </button>
      </div>
    </>
  );
}

export default Print;
