import React, { useState } from "react";

function CustomCall({ handleIsCallText }) {
  const [isCallText, setIsCallText] = useState(false);
  const [callText, setCallText] = useState("");
  console.log(handleIsCallText);
  //   const playCTA = () => {
  //     setIsCallText(false);
  //     setPulseLabel("CTA");
  //     playAudioLoader();
  //     const audioElement = document.querySelector("audio");
  //     audioElement.play();
  //   };

  //   const textToSpeech = (text) => {
  //     setTimeout(() => {
  //       const synth = window.speechSynthesis;
  //       const utterThis = new SpeechSynthesisUtterance(text);
  //       utterThis.lang = "id-ID";
  //       utterThis.rate = 0.8;
  //       synth.speak(utterThis);
  //       setPulseLabel("Play CTA");
  //       playAudioLoader();
  //       utterThis.onend = (event) => {
  //         setIsCall(false);
  //         setIsWave(false);
  //         setPulseLabel("Ready");
  //         setCallText("");
  //       };
  //     }, 1000);
  //   };

  //   const finishCta = () => {
  //     setIsCall(false);
  //     setIsWave(false);
  //     setPulseLabel("Ready");

  //     textToSpeech(callText);
  //   };

  return (
    <>
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
                // onClick={this.props.handleIsCallText(false)}
                className="bg-slate-200 px-5 py-2 text-gray-600 rounded-md hover:bg-slate-500 hover:text-gray-50"
              >
                Cancel
              </button>
              <button
                // onClick={playCTA}
                className="hover:bg-blue-400 hover:text-gray-600
                    bg-blue-500 px-5 py-2 text-gray-50 rounded-md"
              >
                Play Text
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomCall;
