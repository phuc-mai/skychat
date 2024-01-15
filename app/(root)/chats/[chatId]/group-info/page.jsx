"use client";

import Loader from "@components/Loader";
import { GroupOutlined } from "@mui/icons-material";
import { CldUploadButton } from "next-cloudinary";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const GroupInfo = () => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});

  const { chatId } = useParams();

  const getChat = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      setLoading(false);
      setChat(data);
      reset({
        name: data.name,
        groupPhoto: data.groupPhoto,
      });
    } catch (err) {
      console.error("Failed to fetch chat details:", err);
    }
  };

  useEffect(() => {
    getChat();
  }, [chatId]);

  const {
    register,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const uploadPhoto = (result) => {
    setValue("groupPhoto", result.info.secure_url, {
      shouldValidate: true,
    });
  };

  const router = useRouter();

  const updateGroup = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/update`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      setLoading(false);

      if (res.ok) {
        router.push(`/chats/${chatId}`);
      }
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit Group Info</h1>
      <form className="edit-profile" onSubmit={handleSubmit(updateGroup)}>
        <div className="input">
          <input
            {...register("name", {
              required: "Group Name is required",
            })}
            type="text"
            placeholder="Group Chat Name"
            className="input-field"
          />
          <GroupOutlined sx={{ color: "#737373" }} />
        </div>
        {errors.name && (
          <p className="text-red-1">{errors.name.message}</p>
        )}

        <div className="flex items-center gap-7">
          <img
            src={watch("groupPhoto") || "/assets/group.png"}
            alt="profile"
            className="w-40 h-40 rounded-full"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={uploadPhoto}
            uploadPreset="qge6i0t5"
          >
            <p className="text-body-bold">Upload new photo</p>
          </CldUploadButton>
        </div>

        <div className="flex flex-wrap gap-3">
          {chat?.members.map((contact, index) => (
            <p className="selected-contact" key={index}>
              {contact.username}
            </p>
          ))}
        </div>

        <button className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default GroupInfo;
