import { useState } from 'react';
import AuthShell from './auth/AuthShell.jsx';
import LoginForm from './auth/LoginForm.jsx';
import OtpForm from './auth/OtpForm.jsx';
import RegisterForm from './auth/RegisterForm.jsx';
import { usePhone } from '../hooks/useMediaQuery.js';
import useEscapeKey from '../hooks/useEscapeKey.js';
import useScrollLock from '../hooks/useScrollLock.js';
import { login } from '../lib/auth.js';

/**
 * One popup, three screens (all from the Figma designs):
 *   'login'    -> enter mobile number
 *   'otp'      -> enter the 6-digit code sent to that number
 *   'register' -> create account (after it, the same OTP screen verifies the phone)
 */
const LABELS = { login: 'Login', otp: 'Verify OTP', register: 'Create account' };

export default function LoginModal({ onClose, onSuccess }) {
  const isPhone = usePhone(); // phones get the bottom-sheet wording from the design
  const [view, setView] = useState('login');
  const [mobile, setMobile] = useState('');
  const [profile, setProfile] = useState(null); // name + email, only when coming from "Create Account"

  // Esc closes, page behind doesn't scroll
  useEscapeKey(onClose);
  useScrollLock();

  // Login screen -> OTP
  const sendOtp = (number) => {
    // TODO: call your "send OTP" API here (e.g. api.sendOtp(number))
    setMobile(number);
    setProfile(null);
    setView('otp');
  };

  // Create-account screen -> OTP
  const register = (form) => {
    // TODO: call your register API here with the form values
    setMobile(form.phone);
    setProfile({ name: form.name, email: form.email });
    setView('otp');
  };

  // OTP screen -> back to the login screen.
  // After "Create Account" the number belongs to the new account, so the login field starts empty;
  // after a normal login attempt it stays filled so a typo can be fixed.
  const backToLogin = () => {
    if (profile) { setMobile(''); setProfile(null); }
    setView('login');
  };

  // OTP screen -> signed in
  const verifyOtp = () => {
    // TODO: verify the code with your API. Front-end demo: any 6-digit code signs you in.
    login({ identifier: mobile, ...(profile || {}) });
    onClose();
    onSuccess?.();
  };

  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__dialog" role="dialog" aria-modal="true" aria-label={LABELS[view]}>
        <AuthShell onClose={onClose} label={LABELS[view]}>
          {view === 'login' && (
            <LoginForm isPhone={isPhone} initialMobile={mobile} onSendOtp={sendOtp} onCreateAccount={() => setView('register')} />
          )}
          {view === 'otp' && (
            <OtpForm isPhone={isPhone} mobile={mobile} onVerify={verifyOtp} onBack={backToLogin} />
          )}
          {view === 'register' && (
            <RegisterForm onSubmit={register} onLogin={() => setView('login')} />
          )}
        </AuthShell>
      </div>
    </div>
  );
}
