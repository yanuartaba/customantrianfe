import axios from "axios";
import React from "react";
import { GoTrashcan } from "react-icons/go";
import { useNavigate } from "react-router-dom";

function FooterCard({ url, id, theme }) {
  console.log({ ...theme });

  const { primary, secondary } = { ...theme };

  const navigate = useNavigate();

  const deleteMedia = async () => {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/media/${id}`);

    navigate(0);
  };

  return (
    <>
      <div
        className={`w-full p-4 flex flex-row justify-between ${primary} text-gray-50`}
      >
        <p>{url}</p>
        <button onClick={deleteMedia} type="button" className="cursor-pointer">
          <GoTrashcan />
        </button>
      </div>
    </>
  );
}

export default FooterCard;
