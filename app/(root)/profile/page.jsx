"use client";

import Loader from "@components/Loader";
import { PersonOutlined } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      reset({
        username: currentUser.username,
        profileImage: currentUser.profileImage,
      });
      setLoading(false);
    }
  }, [currentUser]);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const uploadPhoto = (result) => {
    setValue("profileImage", result.info.secure_url, {
      shouldValidate: true,
    });
  };

  const router = useRouter();

  const updateUser = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${currentUser._id}/update`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      setLoading(false);
      window.location.reload();
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Edit Your Profile</h1>
      <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
        <div className="input">
          <input
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 2) {
                  return "Username must be more than 1 character";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="input-field"
          />
          <PersonOutlined sx={{ color: "#737373" }} />
        </div>
        {errors.username && (
          <p className="text-red-1">{errors.username.message}</p>
        )}

        <div className="flex items-center justify-between">
          <img
            src={
              watch("profileImage") ||
              currentUser?.profileImage ||
              "/assets/person.jpg"
            }
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

        <button className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
