import React, { useState, useRef, useEffect } from "react";
import { Blocks } from "react-loader-spinner";
import { GoPencil } from "react-icons/go";
import { RiEyeFill, RiEyeCloseLine } from "react-icons/ri";
import axios from "axios";
import { VscError } from "react-icons/vsc";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Profile({ theme }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");

  const [errors, setErrors] = useState([]);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    // const profile = JSON.parse(localStorage.getItem("my-profile"));

    const getProfile = async () => {
      setIsLoading(true);
      const dataToken = localStorage.getItem("token-counter");

      const token = JSON.parse(dataToken);

      await axios
        .get(`http://localhost:3001/users/me`, {
          headers: { Authorization: `Bearer ${token.access_token}` },
        })
        .then((res) => {
          setProfile(res.data);
          setName(res.data.name);
        });
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    getProfile();
  }, []);
  const passwordInput = useRef();
  const confirmPasswordInput = useRef();
  const hiddenInputFile = useRef();

  const showTextPassword = () => {
    setIsShowPassword(!isShowPassword);
    if (isShowPassword !== true) {
      passwordInput.current.type = "text";
    } else {
      passwordInput.current.type = "password";
    }
  };

  const showTextConfirmPassword = () => {
    setIsShowConfirmPassword(!isShowConfirmPassword);
    if (isShowConfirmPassword !== true) {
      confirmPasswordInput.current.type = "text";
    } else {
      confirmPasswordInput.current.type = "password";
    }
  };

  const uploadAvatar = () => {
    hiddenInputFile.current.click();
  };

  const handleUpdateProfile = () => {
    if (isChangePassword) {
      updateProfile({
        name: name,
        password: password,
        confirmation_password: confirmationPassword,
      });
    } else {
      updateProfile({
        name: name,
      });
    }
  };

  const updateProfile = async ({
    name,
    password,
    confirmation_password,
    avatar,
  }) => {
    const dataToken = localStorage.getItem("token-counter");

    const token = JSON.parse(dataToken);

    const payload = {
      name: name,
      avatar: avatar,
      password: password,
      confirmation_password: confirmation_password,
    };

    try {
      setIsLoading(true);
      await axios
        .patch(`http://localhost:3001/users`, payload, {
          headers: { Authorization: `Bearer ${token.access_token}` },
        })
        .then((res) => {
          setProfile(res.data);
          setName(res.data.name);
          localStorage.setItem("my-profile", JSON.stringify(res.data));
        });
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      //   toggleEdit(false);
      navigate(0);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
    }
  };

  const handleChangeAvatar = async (e) => {
    const file = await e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "http://localhost:3001/menus/file",
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );

      const dataImage = await res.data.file.filename;
      setAvatar(dataImage);
      updateProfile({ avatar: dataImage });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {isLoading && (
        <div
          tabindex="-1"
          class="backdrop-blur-sm bg-slate-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex flex-col justify-center items-center"
        >
          <Blocks
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
          />
          <h3>Loading</h3>
        </div>
      )}

      <div className="w-full flex flex-col gap-3">
        <div
          className={`w-full ${theme.primary} text-gray-50 rounded-lg flex flex-col justify-center items-center py-2`}
        >
          <h1 className="font-bold text-xl">Profile</h1>
        </div>

        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-2 bg-red-200 rounded-md border-red-600 border-2 p-4"
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

        <div className="grid grid-flow-row grid-cols-2 gap-4">
          <div className="flex flex-col justify-center gap-5">
            <div className="flex flex-col justify-center items-center">
              <div
                className={`w-[40%] ${theme.secondary} py-2 px-2 rounded-md`}
              >
                <p className="font-semibold ml-2 text-center">Foto Profile</p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center relative">
              <img
                className="w-[25rem] h-auto"
                src={`http://localhost:3001/files/${profile.avatar}`}
                alt=""
              />
              <button
                onClick={uploadAvatar}
                className={`w-[3rem] h-[3rem] flex flex-col justify-center items-center ${theme.primary} ${theme.textwhite}  ${theme.hoverSecondary} rounded-full absolute bottom-10 right-[15rem]`}
              >
                <GoPencil className={` font-semibold`} />
                <input
                  type="file"
                  onChange={handleChangeAvatar}
                  ref={hiddenInputFile}
                  className="hidden"
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gal-2">
              <label className="font-semibold">Nama</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-col gal-2">
              <label className="font-semibold">Email</label>
              <input
                type="text"
                value={profile.email}
                disabled={true}
                className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => setIsChangePassword(!isChangePassword)}
                className={`${theme.primary} w-[20%] rounded-md py-2 px-4 text-gray-50 font-semibold`}
              >
                Ubah Password
              </button>

              {isChangePassword && (
                <>
                  <div className="flex flex-col">
                    <label className="font-semibold">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        ref={passwordInput}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white"
                      />
                      {isShowPassword ? (
                        <RiEyeFill
                          onClick={() => showTextPassword()}
                          className="absolute right-4 top-4 cursor-pointer"
                        />
                      ) : (
                        <RiEyeCloseLine
                          onClick={() => showTextPassword()}
                          className="absolute right-4 top-4 cursor-pointer"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">Konfirmasi Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={confirmationPassword}
                        onChange={(e) =>
                          setConfirmationPassword(e.target.value)
                        }
                        ref={confirmPasswordInput}
                        className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white"
                      />
                      {isShowConfirmPassword ? (
                        <RiEyeFill
                          onClick={() => showTextConfirmPassword()}
                          className="absolute right-4 top-4 cursor-pointer"
                        />
                      ) : (
                        <RiEyeCloseLine
                          onClick={() => showTextConfirmPassword()}
                          className="absolute right-4 top-4 cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 right-10">
        <button
          onClick={handleUpdateProfile}
          className={`${theme.secondary} ${theme.textprimary} ${theme.hoverPrimary} font-semibold py-2 px-4 rounded-md`}
        >
          Simpan
        </button>
      </div>
    </>
  );
}

export default Profile;
