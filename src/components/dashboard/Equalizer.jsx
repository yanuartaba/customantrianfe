import React from "react";

import { Audio } from "react-loader-spinner";
function Equalizer({ theme, pulseLabel }) {
  return (
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
  );
}

export default Equalizer;
