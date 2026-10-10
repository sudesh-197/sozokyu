import { useState } from "react";
import BackLink from "../../components/account/BackLink.jsx";
import PfField from "../../components/account/PfField.jsx";
import { getUser, updateUser, isEmail, isMobile } from "../../lib/auth.js";
import { useLoginModal } from "../../context/LoginModalContext.jsx";

// Profile Information – read-only fields until "Edit" is pressed (Figma: Profile)
export default function ProfilePage() {
  const { openLogin } = useLoginModal();
  const loggedIn = !!getUser();
  const user = getUser() || {};
  const initial = {
    name: user.name || "",
    email: user.email || "",
    phone: isMobile(user.identifier || "") ? user.identifier : user.phone || "",
  };
  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const save = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Please enter your name";
    if (form.email && !isEmail(form.email.trim()))
      err.email = "Enter a valid email address";
    if (form.phone && !isMobile(form.phone))
      err.phone = "Enter a valid 10-digit mobile number";
    setErrors(err);
    if (Object.keys(err).length) return;
    updateUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
    setEditing(false);
  };
  const cancel = () => {
    setForm(initial);
    setErrors({});
    setEditing(false);
  };

  const field = (k, placeholder, type = "text") => (
    <PfField
      type={type}
      value={form[k]}
      onChange={set(k)}
      placeholder={placeholder}
      readOnly={!editing}
      error={errors[k]}
    />
  );

  return (
    <div className="profile">
      <div className="profile__main">
        <div className="profile__titlerow">
          <BackLink className="profile__back" />
          <h1 className="account__title">
            <span className="pf-full">Profile Information</span>
            <span className="pf-short">Profile Info</span>
          </h1>
        </div>
        <p className="account__sub">Update your profile and keep it secure</p>
        <div className="profile__fields">
          {field("name", "Name")}
          {field("email", "Email", "email")}
          {field("phone", "Mobile number", "tel")}
        </div>
      </div>
      <div className="profile__actions">
        {editing ? (
          <>
            <button type="button" className="btn-dark" onClick={save}>
              Save
            </button>
            <button type="button" className="btn-outline" onClick={cancel}>
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn-dark"
            onClick={() =>
              loggedIn
                ? setEditing(true)
                : openLogin({ redirectTo: "/account/profile" })
            }
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
