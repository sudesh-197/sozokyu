import { useState } from "react";
import TextField from "./TextField.jsx";
import { validateRegister } from "../../lib/auth.js";

export default function RegisterForm({ onSubmit, onLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const set =
    (k, clean = (v) => v) =>
    (e) => {
      setForm((f) => ({ ...f, [k]: clean(e.target.value) }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    };

  const submit = (e) => {
    e.preventDefault();
    const errs = validateRegister(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      e.currentTarget.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    onSubmit(form);
  };

  return (
    <form
      className="login__form login__form--register"
      onSubmit={submit}
      noValidate
    >
      <div className="login__top login__top--register">
        <div className="login__intro login__intro--register">
          <h1>
            <span>Create Your Account</span>
          </h1>
          <p>
            Join SOZOKYU and be the first to know about new arrivals, Exclusive
            offers and more
          </p>
        </div>

        <div className="login__fields">
          <TextField
            label="Full name"
            type="text"
            autoComplete="name"
            placeholder="Enter Full Name *"
            value={form.name}
            error={errors.name}
            onChange={set("name")}
          />
          <TextField
            label="Email ID"
            type="email"
            autoComplete="email"
            placeholder="Enter Email ID *"
            value={form.email}
            error={errors.email}
            onChange={set("email")}
          />
          <TextField
            label="Phone number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="Enter Phone Number *"
            value={form.phone}
            error={errors.phone}
            onChange={set("phone", (v) => v.replace(/\D/g, "").slice(0, 10))}
          />
        </div>
      </div>

      <div className="login__actions login__actions--register">
        <button type="submit" className="login__btn login__btn--dark">
          Create Account
        </button>
        <p className="login__new">
          Already Have Account?{" "}
          <button type="button" className="login__create" onClick={onLogin}>
            Login
          </button>
        </p>
      </div>
    </form>
  );
}
