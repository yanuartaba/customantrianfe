import axios from "axios";
import React, { useState } from "react";
import { GoTrashcan } from "react-icons/go";
import { useNavigate } from "react-router-dom";

import ConfirmationDelete from "../../components/admin/utils/ConfirmationDelete";

function FooterCard({ url, id, theme }) {
  const { primary } = { ...theme };

  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isDelete = false;
  const toggleDelete = () => setShowDeleteModal((val) => !val);
  const deleteMedia = async () => {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/media/${id}`);

    navigate(0);
  };

  return (
    <>
      <div
        className={`w-full p-4 flex flex-row justify-between ${primary} text-gray-50`}
      >
        <ConfirmationDelete
          showDeleteModal={showDeleteModal}
          toggleDelete={toggleDelete}
          model="Media"
          id={id}
          isDelete={isDelete}
          handleDelete={deleteMedia}
        />
        <p>{url}</p>
        <button onClick={toggleDelete} type="button" className="cursor-pointer">
          <GoTrashcan />
        </button>
      </div>
    </>
  );
}

export default FooterCard;
