import React, { useState } from "react";

const defaultAvatar = "/src/assets/default-avatar.png"; // Add a default avatar image

const Profile: React.FC = () => {
  const [avatar, setAvatar] = useState<string>(defaultAvatar);
  const [name, setName] = useState<string>("John Doe");
  const [email, setEmail] = useState<string>("john@example.com");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-card">
        <img src={avatar} alt="User Avatar" className="profile-avatar" />
        <label className="upload-label">
          Change Photo
          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
        </label>
        <div className="profile-info">
          <div>
            <strong>Name:</strong> {name}
          </div>
          <div>
            <strong>Email:</strong> {email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;