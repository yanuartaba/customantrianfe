import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Ilustrasi1 from "../img/illustrator1.png";
import Bg1 from "../img/bg1.png";
import CS1 from "../img/cs1.png";
import { dataMenu } from "../utils/data";
import { CiHospital1 } from "react-icons/ci";
import { VscError } from "react-icons/vsc";
import axios from "axios";
import { useEffect } from "react";
import { motion } from "framer-motion";

function LoginCounter() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [counter, setCounter] = useState("");
  const [counters, setCounters] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errors, setErrors] = useState([]);
  const [name, setName] = useState("");
  const [noCounter, setNoCounter] = useState("");
  const [group, setGroup] = useState("");

  const getListCounter = async () => {
    const listCounter = await axios.get("http://localhost:3001/counter");

    // console.log(listCounter.data);
    setCounters(listCounter.data);
  };

  const clearError = () => {};

  useEffect(() => {
    getListCounter();
    if (errors.length > 0) {
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  }, [errors]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const dataLogin = {
      email,
      password,
    };

    try {
      const token = await axios.post(
        "http://localhost:3001/auth/signin",
        dataLogin
      );
      localStorage.setItem("token-counter", JSON.stringify(token.data));
      const accessToken = token.data.access_token;
      const myProfile = await axios.get("http://localhost:3001/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      localStorage.setItem("my-profile", JSON.stringify(myProfile.data));

      if (!isAdmin) {
        const dataCounter = JSON.parse(counter);
        const dataGroup = {
          counterId: dataCounter.id,
          noCounter: dataCounter.nomorCounter,
          group: dataCounter.group,
          groupName: dataCounter.menu.label,
        };
        localStorage.setItem("login-counter", JSON.stringify(dataGroup));
        navigate("/dashboard");
      } else {
        navigate("/admin/home");
      }
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
    }
  };

  return (
    <>
      <div className="grid grid-cols-8 gap-4 w-full h-[100vh] overflow-hidden">
        <div className="w-full h-full flex flex-col items-center justify-center relative col-span-3">
          <img src={Bg1} className="absolute left-0 min-h-[100vh]" alt="" />
          <img src={Ilustrasi1} className="z-10" alt="" />
          <div className="px-6 py-5 z-10 mt-5">
            <h1 className="text-3xl text-gray-200 font-semibold px-16">
              Beberapa klik lagi untuk masuk ke Dashboard Anda.
            </h1>
            <p className="font-semibold text-gray-200 my-3 px-16">
              Kelola semua data Anda dimenu Adminstrator
            </p>
          </div>
        </div>
        <div className="w-full h-full col-span-5 flex justify-center items-center">
          <div className="w-[60%] h-[70vh] flex flex-col items-center justify-evenly">
            <div className="flex flex-col gap-2 text-center">
              <div className="flex justify-center">
                <CiHospital1 className="text-7xl font-bold text-center" />
              </div>
              <h1 className="text-2xl font-semibold">Selamat Datang di</h1>
              <h1 className="text-6xl font-bold">System Antrian</h1>
              <h1 className="text-2xl font-semibold">
                Satu aplikasi untuk segala kebutuhanmu{" "}
              </h1>
            </div>
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="flex flex-col gap-2 w-full bg-red-200 rounded-md border-red-600 border-2 px-6 py-4"
              >
                <div className="flex gap-3 items-center">
                  <VscError className="text-2xl font-semibold text-red-600" />
                  <h1 className="text-xl font-semibold text-red-600">Error</h1>
                </div>

                {errors.length > 0 && (
                  <ul>
                    {" "}
                    {Array.isArray(errors) ? (
                      errors.map((error) => (
                        <li className="text-red-600">{error}</li>
                      ))
                    ) : (
                      <li className="text-red-600">{errors}</li>
                    )}
                  </ul>
                )}
              </motion.div>
            )}

            <div className="flex flex-col w-[60%] gap-4">
              <div>
                <label className="block">
                  <span className="block text-md font-medium text-slate-700">
                    Email
                  </span>

                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="masukan email anda"
                    className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white
                                "
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="block text-md font-medium text-slate-700">
                    Password
                  </span>

                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="masukan password anda"
                    className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white
                                "
                  />
                </label>
              </div>

              {isAdmin === false && (
                <div>
                  <label className="block">
                    <span className="block text-md font-medium text-slate-700">
                      Counter
                    </span>

                    <select
                      onChange={(e) => setCounter(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white"
                    >
                      <option value="#" disabled selected>
                        Pilih salah satu
                      </option>
                      {counters.length > 0 &&
                        counters.map((counter) => (
                          <option
                            key={counter.id}
                            value={JSON.stringify(counter)}
                          >
                            {counter.menu.label} : {counter.nomorCounter}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
              )}

              <div className="block">
                <div className="flex justify-end gap-2 items-center">
                  <input
                    type="checkbox"
                    onChange={() => setIsAdmin(!isAdmin)}
                  />
                  <label>Adminstrator</label>
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-blue-500 text-gray-100 rounded-md py-4 text-xl font-bold tracking-wide mt-4"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginCounter;
