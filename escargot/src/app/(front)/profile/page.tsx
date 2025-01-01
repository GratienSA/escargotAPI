"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import ProfileInfo from "@/components/ProfileInfo";
import EditProfileForm from "@/components/EditProfileForm";
import { getUserProfile, updateUserProfile } from "@/helpers/auth";
import OrderHistory from "@/components/OrderHistory";
import { UserType } from "@/utils/types";
import { getPictureUrl } from "@/helpers/getPictures";

const ProfilePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUserProfile = useCallback(async () => {
    try {
      const profile: UserType = await getUserProfile();
      if (profile.profileImagePath) {
        profile.profileImagePath = getPictureUrl(profile.profileImagePath);
      }
      setUser(profile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Échec du chargement du profil utilisateur :", error);
      setError("Échec du chargement du profil utilisateur. Veuillez réessayer.");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      } else {
        await fetchUserProfile();
      }
    };

    checkAuth();
  }, [router, fetchUserProfile]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async (updatedUser: Partial<UserType>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProfile: UserType = await updateUserProfile(updatedUser);
      if (updatedProfile.profileImagePath) {
        updatedProfile.profileImagePath = getPictureUrl(updatedProfile.profileImagePath);
      }
      setUser(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil utilisateur :", error);
      setError("Échec de la mise à jour du profil. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container>
        <div className="text-center">
          <p className="text-red-500">Vous n'êtes pas authentifié. Veuillez vous connecter.</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Aller à la connexion
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Mon Compte</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isEditing && user ? (
        <EditProfileForm user={user} onSave={handleSave} onCancel={handleCancel} />
      ) : user ? (
        <ProfileInfo user={user} onEdit={handleEdit} />
      ) : null}
      {user && <OrderHistory userId={user.id} />}
    </Container>
  );
};

export default ProfilePage;