import { useRef, useState } from 'react';
import GoogleIcon from '../GoogleIcon.jsx';
import AppleIcon from '../AppleIcon.jsx';
import TextField from './TextField.jsx';
import AuthHeading from './AuthHeading.jsx';
import { validateMobile } from '../../lib/auth.js';

export default function LoginForm({ isPhone, initialMobile = '', onSendOtp, onCreateAccount }) {
  const [mobile, setMobile] = useState(initialMobile);
  const [error, setError] = useState('');
  const ref = useRef(null);

  const submit = (e) => {
    e.preventDefault();
    const err = validateMobile(mobile);
    setError(err);
    if (err) { ref.current?.focus(); return; }
    onSendOtp(mobile);
  };

  return (
    <form className="login__form" onSubmit={submit} noValidate>
      <div className="login__top">
        <div className="login__head">
          <div className="login__intro">
            <AuthHeading isPhone={isPhone} />
            <p>Welcome back! Please enter your details</p>
          </div>
          <TextField
            ref={ref}
            label="Mobile number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="Enter your mobile number"
            value={mobile}
            error={error}
            onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); if (error) setError(''); }}
          />
        </div>
        <p className="login__new">
          New User?{' '}
          <button type="button" className="login__create" onClick={onCreateAccount}>Create Account</button>
        </p>
      </div>

      <div className="login__actions">
        <button type="submit" className="login__btn login__btn--dark">Login</button>
        <p className="login__or">Or</p>
        <button type="button" className="login__btn login__btn--outline"><GoogleIcon /> Sign in with Google</button>
        <button type="button" className="login__btn login__btn--outline"><AppleIcon /> Sign in with Apple</button>
      </div>
    </form>
  );
}
