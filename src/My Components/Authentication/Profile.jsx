import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PromoBanner from "../HomePage Components/Promobar.jsx";
import Navbar from "../HomePage Components/Navbar.jsx";
import Footer from "../HomePage Components/Footer.jsx";
import useAuth from "./useAuth.js";
import { getUserAvatarSource, getUserInitials } from "../../utils/auth.js";
import { uploadProfilePicture } from "../../services/shopCoApi.js";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const avatarSource = getUserAvatarSource(user);
  const initials = getUserInitials(user);
  const displayName = useMemo(
    () => user?.name || user?.fullName || "User",
    [user],
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleProfileUpload = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedFile) {
      setError("Choose a profile picture first.");
      return;
    }

    try {
      setUploading(true);
      await uploadProfilePicture(selectedFile);
      setSelectedFile(null);
      setSuccess("Profile picture updated.");
    } catch (uploadError) {
      setError(
        uploadError?.response?.data?.message ||
          uploadError?.message ||
          "Unable to update your profile picture.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-black">
      <PromoBanner />
      <Navbar />

      <main className="mx-auto max-w-310 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-4xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-black/50">
                Your profile
              </p>
              <h1 className="mt-4 text-3xl font-black text-black">
                Welcome back
              </h1>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-[#F8F8F8]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : avatarSource ? (
                  <img
                    src={avatarSource}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold uppercase text-black/60">
                    {initials}
                  </span>
                )}
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold">{displayName}</p>
                <p className="text-sm text-black/60">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-8 w-full rounded-full bg-black px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/90"
            >
              Logout
            </button>
          </section>

          <section className="rounded-4xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-black/50">
                Profile photo
              </p>
              <h2 className="mt-3 text-2xl font-bold text-black">
                Upload a new avatar
              </h2>
              <p className="mt-2 text-sm text-black/60">
                Your updated photo will appear in the navbar after upload.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-3xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleProfileUpload}>
              <label className="block text-sm font-medium text-black/80">
                Choose image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setSelectedFile(event.target.files?.[0] || null)
                  }
                  className="mt-2 block w-full rounded-3xl border border-dashed border-gray-300 bg-[#F8F8F8] px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </label>

              {(previewUrl || selectedFile) && (
                <div className="rounded-3xl border border-gray-200 bg-[#FAFAFA] p-4">
                  <p className="mb-3 text-sm font-semibold text-black/70">
                    Preview
                  </p>
                  <div className="flex items-center justify-center rounded-3xl bg-white p-4">
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="h-56 w-56 rounded-3xl object-cover"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-full bg-black px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-black/50"
              >
                {uploading ? "Uploading..." : "Update photo"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;
