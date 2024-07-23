"use client";

import React, { useState, ChangeEvent } from "react";
import { UserType } from "@/utils/types";
import Image from "next/image";

interface EditProfileFormProps {
  user: UserType;
  onSave: (data: Partial<UserType>) => void;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    address: user.address,
    city: user.city,
    postalCode: user.postalCode,
    country: user.country,
  });

  const [picture, setPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.profileImagePath ? `/uploads/profiles/${user.profileImagePath}` : null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPicture(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedData: Partial<UserType> = { ...formData };
  
    if (picture) {
      try {
        const formData = new FormData();
        formData.append('file', picture);
        formData.append('type', 'profile');
        formData.append('id', user.id.toString());

        const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/image/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          updatedData.profileImagePath = data.imagePath.split('/').pop();
        } else {
          setImageError(data.message || 'Error uploading image');
          return;
        }
      } catch (error) {
        setImageError("Error uploading image");
        return;
      }
    }
  
    onSave(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Profile Picture</label>
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Profile preview"
            width={200}
            height={200}
            className="w-32 h-32 object-cover rounded-full mb-2"
          />
        )}
        <input
          type="file"
          name="picture"
          onChange={handlePictureChange}
          className="w-full px-3 py-2 border rounded"
          accept="image/*"
        />
        {imageError && <div className="text-red-500 mt-1">{imageError}</div>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;