import React, { useEffect, useMemo, useState } from "react";
import bcrypt from "bcryptjs";
import { apiUrl } from "../lib/api";

const defaultAvatar = "https://via.placeholder.com/120?text=Avatar";

export default function ProfilePage() {
  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("currentUser") || "null"); } catch { return null; }
  }, []);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Editable fields
  const [avatar, setAvatar] = useState<string>(defaultAvatar);
  const [fullName, setFullName] = useState("");
  const [surname, setSurname] = useState("");
  const [cell, setCell] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [serverUser, setServerUser] = useState<any>(null);

  // Load latest user from server
  useEffect(() => {
    if (!currentUser?.email) return;
    fetch(`${apiUrl("/users")}?email=${encodeURIComponent(currentUser.email)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load profile");
        const users = await r.json();
        const u = Array.isArray(users) ? users[0] : null;
        if (!u) throw new Error("User not found");
        setServerUser(u);
        setAvatar(u.avatar || defaultAvatar);
        setFullName(u.fullName || "");
        setSurname(u.surname || "");
        setCell(u.cell || "");
        setEmail(u.email || "");
        setError("");
      })
      .catch((e: Error) => setError(e.message));
  }, [currentUser?.email]);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar((ev.target?.result as string) || defaultAvatar);
    reader.readAsDataURL(f);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverUser?.id) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      let passwordHash = serverUser.passwordHash;
      if (newPassword.trim()) {
        // Verify current password
        const ok = await bcrypt.compare(currentPassword || "", serverUser.passwordHash || "");
        if (!ok) throw new Error("Current password is incorrect");
        passwordHash = await bcrypt.hash(newPassword.trim(), 10);
      }
      const payload = {
        id: serverUser.id,
        fullName: fullName.trim(),
        surname: surname.trim(),
        cell: cell.trim(),
        email: email.trim(),
        avatar,
        passwordHash,
        createdAt: serverUser.createdAt || new Date().toISOString(),
      };
      const res = await fetch(apiUrl(`/users/${serverUser.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      setSuccess("Profile updated");
      // Update localStorage currentUser (non-sensitive subset)
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ id: serverUser.id, fullName: payload.fullName, surname: payload.surname, cell: payload.cell, email: payload.email, avatar: payload.avatar })
      );
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: any) {
      setError(e.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <form className="profile-card" onSubmit={onSave}>
        <img src={avatar} alt="User Avatar" className="profile-avatar" />
        <label className="upload-label">
          Change Photo
          <input type="file" accept="image/*" onChange={onAvatarChange} hidden />
        </label>
        <div className="profile-info">
          {!serverUser && !error && <p className="muted">Loading profile...</p>}
          {error && <p className="error" role="alert">{error}</p>}
          {success && <p className="successMsg" role="status">{success}</p>}
          <div className="formGroup">
            <label htmlFor="fullName">Name</label>
            <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="formGroup">
            <label htmlFor="surname">Surname</label>
            <input id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
          </div>
          <div className="formGroup">
            <label htmlFor="cell">Cell</label>
            <input id="cell" value={cell} onChange={(e) => setCell(e.target.value)} />
          </div>
          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <hr style={{ margin: '8px 0', opacity: .4 }} />
          <div className="formGroup">
            <label htmlFor="currentPassword">Current Password</label>
            <input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="formGroup">
            <label htmlFor="newPassword">New Password</label>
            <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <button className="primaryBtn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}
