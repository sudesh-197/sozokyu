import { useState } from "react";
import { isMobile } from "../../lib/auth.js";
import {
  getAddresses,
  saveAddresses,
  formatAddress,
  STATES,
} from "../../lib/addresses.js";
import DeleteAddressPopup from "../../components/account/DeleteAddressPopup.jsx";
import ChangeDefaultPopup from "../../components/account/ChangeDefaultPopup.jsx";
import PfField from "../../components/account/PfField.jsx";
import BackLink, { MobileHead } from "../../components/account/BackLink.jsx";
import { ChevronDownIcon } from "../../components/Icons.jsx";

function validate(f) {
  const e = {};
  if (!f.first.trim()) e.first = "Enter first name";
  // last name is optional
  if (!f.line.trim()) e.line = "Please enter the address";
  if (!f.city.trim()) e.city = "Enter city";
  if (!/^\d{6}$/.test(f.pincode.trim())) e.pincode = "Enter 6-digit PIN";
  if (!isMobile(f.phone)) e.phone = "Enter a valid 10-digit mobile number";
  return e;
}

// "Add Delivery Address" popup (Figma 3338:10841) - also used for Edit
function AddressForm({ initial, onSave, onCancel }) {
  const isEdit = !!initial;
  const [first = "", ...rest] = (initial?.name || "").split(" ");
  const [f, setF] = useState({
    first,
    last: rest.join(" "),
    line: initial?.line || "",
    apt: "",
    city: initial?.city || "",
    state: initial?.state || "Karnataka",
    pincode: initial?.pincode || "",
    phone: initial?.phone || "",
  });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF((cur) => ({ ...cur, [k]: e.target.value }));
  const setDigits = (k, max) => (e) =>
    setF((cur) => ({
      ...cur,
      [k]: e.target.value.replace(/\D/g, "").slice(0, max),
    }));

  const submit = (e) => {
    e.preventDefault();
    const err = validate(f);
    setErrors(err);
    if (Object.keys(err).length) return;
    onSave({
      ...(initial || {}),
      name: [f.first, f.last]
        .map((s) => s.trim())
        .filter(Boolean)
        .join(" "),
      phone: f.phone,
      line: [f.line.trim(), f.apt.trim()].filter(Boolean).join(", "),
      city: f.city.trim(),
      state: f.state,
      country: "India",
      pincode: f.pincode.trim(),
      isDefault: initial?.isDefault || false,
    });
  };

  const field = (k, placeholder, extra = {}) => (
    <PfField
      value={f[k]}
      onChange={set(k)}
      placeholder={placeholder}
      error={errors[k]}
      {...extra}
    />
  );

  const select = (value, onChange, options, label) => (
    <div className="pf-field">
      <div className="addr__select">
        <select
          className="pf-input"
          value={value}
          onChange={onChange}
          aria-label={label}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDownIcon size={16} strokeWidth={2} aria-hidden="true" />
      </div>
    </div>
  );

  return (
    <div
      className="modal"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <form className="addr__popup" onSubmit={submit} noValidate>
        <h2 className="addr__popup-title">
          {isEdit ? "Edit Delivery Address" : "Add Delivery Address"}
        </h2>
        <div className="addr__popup-fields">
          <div className="addr__form-row">
            {field("first", "First name")}
            {field("last", "Last name (optional)")}
          </div>
          {field("line", "Address")}
          {field("apt", "Apartment, suite, etc. (optional)")}
          <div className="addr__form-row">
            {field("city", "City")}
            {select(f.state, set("state"), STATES, "State")}
            {field("pincode", "PIN code", {
              inputMode: "numeric",
              maxLength: 6,
              onChange: setDigits("pincode", 6),
            })}
          </div>
          {select("India", () => {}, ["India"], "Country")}
          {field("phone", "Phone Number", {
            type: "tel",
            inputMode: "numeric",
            maxLength: 10,
            onChange: setDigits("phone", 10),
          })}
        </div>
        <div className="addr__form-actions">
          <button
            type="button"
            className="addr__btn addr__btn--light"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="addr__btn addr__btn--dark">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

// Saved Address (Figma: Profile / Saved Address, phone 3338:10650) + add / edit / delete
export default function AddressesPage() {
  const [list, setList] = useState(getAddresses);
  const [editing, setEditing] = useState(null); // null | 'new' | address id
  const [deleting, setDeleting] = useState(null); // id of the address waiting for delete confirmation
  const [makingDefault, setMakingDefault] = useState(null); // id waiting for "change default" confirmation
  // always keep exactly one default while the list isn't empty
  const commit = (next) => {
    const fixed =
      next.length && !next.some((a) => a.isDefault)
        ? next.map((a, i) => (i === 0 ? { ...a, isDefault: true } : a))
        : next;
    setList(fixed);
    saveAddresses(fixed);
  };

  const save = (data) => {
    const item = {
      ...data,
      id: editing === "new" ? `a${Date.now()}` : editing,
    };
    let next =
      editing === "new"
        ? [...list, item]
        : list.map((a) => (a.id === editing ? item : a));
    if (item.isDefault)
      next = next.map((a) => ({ ...a, isDefault: a.id === item.id }));
    commit(next);
    setEditing(null);
  };
  const makeDefault = (id) =>
    commit(list.map((a) => ({ ...a, isDefault: a.id === id })));

  const remove = (id) => {
    commit(list.filter((a) => a.id !== id));
    if (editing === id) setEditing(null);
  };

  return (
    <>
      <div className="addr">
        {list.length === 0 ? (
          <>
            {/* phones only: back arrow + title for the empty state */}
            <MobileHead title="Saved Address" />

            <div className="login-guard">
              <p>No saved addresses yet.</p>
              <button
                type="button"
                className="btn-dark"
                onClick={() => setEditing("new")}
              >
                Add New Address
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="page-head">
              {/* phones only (hidden on desktop via CSS) */}
              <BackLink className="addr__back" />
              <h1 className="account__title">Saved Address</h1>
              <button
                type="button"
                className="addr__add"
                onClick={() => setEditing("new")}
              >
                <span className="addr__add-full">Add New Address</span>
                <span className="addr__add-short">+ New Address</span>
              </button>
            </div>

            <div className="addr__list">
              {list.map((a) => (
                <article
                  className={`addr__card${a.isDefault ? " is-default" : " is-selectable"}`}
                  key={a.id}
                  role={a.isDefault ? undefined : "button"}
                  tabIndex={a.isDefault ? undefined : 0}
                  onClick={
                    a.isDefault ? undefined : () => setMakingDefault(a.id)
                  }
                  onKeyDown={
                    a.isDefault
                      ? undefined
                      : (e) => {
                          if (
                            e.target === e.currentTarget &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.preventDefault();
                            setMakingDefault(a.id);
                          }
                        }
                  }
                >
                  <div className="addr__row">
                    <p className="addr__name">{a.name}</p>
                    {a.isDefault && (
                      <span className="addr__badge">
                        <span>Default</span>
                      </span>
                    )}
                  </div>
                  <p className="addr__text">
                    {formatAddress(a)}
                    <br />
                    +91 {a.phone}
                  </p>
                  <div
                    className="addr__actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button type="button" onClick={() => setEditing(a.id)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => setDeleting(a.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {editing !== null && (
        <AddressForm
          initial={
            editing === "new" ? null : list.find((a) => a.id === editing)
          }
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}

      {makingDefault !== null && (
        <ChangeDefaultPopup
          onCancel={() => setMakingDefault(null)}
          onConfirm={() => {
            makeDefault(makingDefault);
            setMakingDefault(null);
          }}
        />
      )}

      {deleting !== null && (
        <DeleteAddressPopup
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            remove(deleting);
            setDeleting(null);
          }}
        />
      )}
    </>
  );
}
