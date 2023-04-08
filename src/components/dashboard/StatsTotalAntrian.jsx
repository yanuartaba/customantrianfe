import React, { useState, useEffect } from "react";

import axios from "axios";
import { Oval } from "react-loader-spinner";
function StatsTotalAntrian({ theme }) {
  const [isLoading, setIsLoading] = useState(true);
  const [totalAntrian, setTotalAntrian] = useState([]);

  useEffect(() => {
    const getTotalAntrian = async () => {
      setIsLoading(true);
      const menus = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/menus`
      );
      setTotalAntrian(menus.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    getTotalAntrian();
  }, []);

  return (
    <>
      <div className="px-4 py-2 m-0 w-full h-full flex flex-col ">
        <div className="flex flex-row justify-between gap-3 mb-3">
          <h1 className={`text-md font-semibold ${theme.textprimary}`}>
            Layanan
          </h1>
          <h1 className={`text-md font-semibold ${theme.textprimary}`}>
            Jumlah Antrian
          </h1>
        </div>
        {isLoading === true ? (
          <div className="flex justify-center items-center h-full">
            <Oval
              height={80}
              width={80}
              color={theme.bgAudioLoader}
              className="text-center"
              ariaLabel="oval-loading"
              secondaryColor={theme.bgAudioLoaderSecondary}
              strokeWidth={8}
              strokeWidthSecondary={6}
            />
          </div>
        ) : (
          <div>
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
    </>
  );
}

export default StatsTotalAntrian;
