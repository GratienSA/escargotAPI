"use client";
import Image from "next/image";
import React, { useState } from "react";
import { UserType } from "@/utils/types";
import { getPictureUrl } from "@/helpers/getPictures"; 

interface ProfileInfoProps {
  user: UserType;
  onEdit: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, onEdit }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const profileImageSrc = user.picture && !imageError
    ? getPictureUrl(user.picture)
    : "/default-avatar.png";

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={profileImageSrc}
          alt={`${user.firstName} ${user.lastName}`}
          width={80}
          height={80}
          className="rounded-full object-cover"
          onError={handleImageError}
        />
        <div>
          <h2 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
          <p className="text-gray-600">{user.email}</p>
          {user.createdAt && (
            <p className="text-gray-600">
              Member since: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
        <p>{user.address}</p>
        <p>{`${user.city}, ${user.postalCode}`}</p>
        <p>{user.country}</p>
      </div>
      <button
        onClick={onEdit}
        className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileInfo;