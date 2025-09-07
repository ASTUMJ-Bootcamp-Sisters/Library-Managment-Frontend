import { Avatar } from "@/components/ui/avatar";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import useMembershipStore from "../store/membershipStore";

const API_URL = "http://localhost:5000/api/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
    bio: "",
    profilePic: null,
  });
  const [preview, setPreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("accessToken");

  const { emailVerificationStatus, requestEmailOtp } = useMembershipStore();
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setFormData({
          fullName: res.data.fullName,
          username: res.data.username || "",
          phone: res.data.phone || "",
          bio: res.data.bio || "",
          profilePic: null,
        });
        setPreview(
          res.data.profilepic
            ? `http://localhost:5000/${res.data.profilepic}`
            : null
        );
      })
      .catch((err) => console.log(err));
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("username", formData.username);
    data.append("phone", formData.phone);
    data.append("bio", formData.bio);
    if (formData.profilePic) data.append("profilePic", formData.profilePic);

    try {
      const res = await axios.put(`${API_URL}/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setMessage(res.data.message);
      if (res.data.user.profilepic) {
        setPreview(`http://localhost:5000/${res.data.user.profilepic}`);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/profile/change-password`,
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message);
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Password change failed");
    }
  };

  const handleVerifyEmail = async () => {
    setVerifying(true);
    try {
      await requestEmailOtp();
      setMessage("OTP sent to your email. Please check your inbox.");
    } catch (err) {
      setMessage("Failed to send OTP. Try again.");
    }
    setVerifying(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  if (!user)
    return <div className="text-center p-10 text-gray-800">Loading...</div>;

  return (
  <div className="min-h-screen bg-gradient-to-r from-[#fffaf3] via-[#fdf8f3] to-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[#5c4033] mb-4">Profile</h1>
        {message && (
          <div className="p-3 rounded bg-[#e6d5c3] text-[#5c4033] border border-[#bfa181]">
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-[#fff8f0] shadow-lg rounded-2xl p-6 border border-[#e6d5c3]">
          <div className="flex items-center space-x-6 mb-6">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-24 h-24 object-cover rounded-full shadow-lg border-2 border-[#bfa181]"
              />
            ) : (
              <Avatar className="w-24 h-24 text-2xl bg-[#bfa181] text-white">
                {user.fullName?.[0]}
              </Avatar>
            )}
            <div>
              <h2 className="text-xl font-semibold text-[#5c4033]">
                {user.fullName}
              </h2>
              <p className="text-[#7b5e57]">@{user.username}</p>
              <p className="text-[#a58d6f]">{user.email}</p>

              {/* Verify Email Button */}
              {user?.role === "student" && !emailVerificationStatus.isVerified && (
                <Button
                  onClick={handleVerifyEmail}
                  className="mt-2 bg-[#5c4033] hover:bg-[#7b5e57] text-white px-4 py-2 rounded-lg shadow"
                  disabled={verifying || emailVerificationStatus.loading}
                >
                  {verifying || emailVerificationStatus.loading
                    ? "Sending OTP..."
                    : "Verify My Email"}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[#5c4033] text-sm">
            <p>
              <strong>Phone:</strong> {user.phone || "-"}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Date Joined:</strong>{" "}
              {format(new Date(user.createdAt), "PPP")}
            </p>
            <p>
              <strong>Last Login:</strong>{" "}
              {user.lastLogin
                ? format(new Date(user.lastLogin), "PPPpp")
                : "Never"}
            </p>
            <p className="col-span-2">
              <strong>Bio:</strong> {user.bio || "-"}
            </p>
          </div>
        </div>

        {/* Edit Profile + Change Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Edit Profile */}
          <div className="bg-[#fff8f0] shadow-lg rounded-2xl p-6 border border-[#e6d5c3]">
            <h2 className="text-lg font-semibold mb-4 text-[#5c4033]">
              Edit Profile
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-3">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="border border-[#e6d5c3] p-2 rounded w-full bg-[#fdf8f3] text-[#5c4033]"
              />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="border border-[#e6d5c3] p-2 rounded w-full bg-[#fdf8f3] text-[#5c4033]"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="border border-[#e6d5c3] p-2 rounded w-full bg-[#fdf8f3] text-[#5c4033]"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                className="border border-[#e6d5c3] p-2 rounded w-full bg-[#fdf8f3] text-[#5c4033]"
              />
              <input
                type="file"
                name="profilePic"
                onChange={handleChange}
                className="w-full"
              />
              <Button
                type="submit"
                className="bg-[#5c4033] hover:bg-[#7b5e57] text-white px-4 py-2 rounded-lg shadow w-full"
              >
                Update Profile
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-[#fff8f0] shadow-lg rounded-2xl p-6 border border-[#e6d5c3]">
            <h2 className="text-lg font-semibold mb-4 text-[#5c4033]">
              Change Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                placeholder="Old Password"
                className="border border-[#e6d5c3] p-2 rounded w-full bg-[#fdf8f3] text-[#5c4033]"
              />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="New Password"
                className="border border-[#e6d5c3] p-2 rounded w-full bg-[#fdf8f3] text-[#5c4033]"
              />
              <Button
                type="submit"
                className="bg-[#7b5e57] hover:bg-[#5c4033] text-white px-4 py-2 rounded-lg shadow w-full"
              >
                Change Password
              </Button>
            </form>
          </div>
        </div>

        {/* Logout */}
        <div className="text-center">
          <Button
            onClick={handleLogout}
            className="bg-[#bfa181] hover:bg-[#5c4033] text-white px-4 py-2 rounded-lg shadow"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
