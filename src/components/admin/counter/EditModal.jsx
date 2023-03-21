import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditModal(props) {
  const { showEditModal, toggleEdit, counter } = props;

  const [noCounter, setNoCounter] = useState("");
  const [group, setGroup] = useState("");
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();

  const updateCounter = async () => {
    const dataToken = localStorage.getItem("token-counter");

    const token = JSON.parse(dataToken);

    console.log(token);
    const payload = {
      nomorCounter: noCounter,
      group: group,
    };

    console.log(noCounter);

    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/counter/${counter.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }
      );

      toggleEdit(false);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getMenus = async () => {
      const datas = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/menus`
      );

      setMenus(datas.data);
    };

    getMenus();

    setNoCounter(counter.nomorCounter);
    setGroup(counter.group);
  }, [counter]);

  return (
    <>
      {showEditModal && (
        <div
          tabindex="-1"
          class="backdrop-blur-sm bg-slate-400 bg-opacity-50 fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex justify-center items-center"
        >
          <div class="relative w-full h-full max-w-md md:h-auto">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                onClick={toggleEdit}
                class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="popup-modal"
              >
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
              <h3 className="px-6 pt-6 mt-12">Edit Counter</h3>
              <div className="flex flex-col gap-4 p-6">
                <div className="flex flex-col">
                  <label>No Counter</label>
                  <input
                    type="text"
                    placeholder="Input nomor counter"
                    onChange={(e) => setNoCounter(e.target.value)}
                    value={noCounter}
                    className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white
                                "
                  />
                </div>

                <div className="flex flex-col">
                  <label>Group Counter</label>
                  <select
                    onChange={(e) => setGroup(e.target.value)}
                    value={group}
                    placeholder="Input nomor counter"
                    className="mt-1 block w-full px-3 py-2 bg-[#EDF3FE] border border-slate-300 rounded-md text-sm shadow-sm placeholder-gray-500
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:bg-white
                                "
                  >
                    <option disabled>Pilih salah satu</option>
                    {menus &&
                      menus.map((menu) => (
                        <option key={menu.id} value={menu.codeGroup}>
                          {menu.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-row justify-end gap-4">
                  <button
                    onClick={toggleEdit}
                    className="bg-slate-200 px-5 py-2 text-gray-600 rounded-md hover:bg-slate-500 hover:text-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateCounter}
                    className="hover:bg-blue-400 hover:text-gray-600
                    bg-blue-500 px-5 py-2 text-gray-50 rounded-md"
                  >
                    Perbaharui
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditModal;
