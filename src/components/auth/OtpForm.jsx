import { useEffect, useRef, useState } from 'react';
import TextField from './TextField.jsx';
import AuthHeading from './AuthHeading.jsx';
import { OTP_SECONDS, validateOtp } from '../../lib/auth.js';

const mmss = (s) => `00:${String(s).padStart(2, '0')}`;

export default function OtpForm({ isPhone, mobile, onVerify, onBack }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(OTP_SECONDS);
  const [resent, setResent] = useState(false);
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  // 00:59 countdown; "Resend OTP" works once it reaches zero
  useEffect(() => {
    if (seconds <= 0) return undefined;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const resend = () => {
    if (seconds > 0) return;
    // TODO: call your "send OTP" API again here
    setSeconds(OTP_SECONDS);
    setResent(true);
    setOtp('');
    setError('');
  };

  const submit = (e) => {
    e.preventDefault();
    const err = validateOtp(otp);
    setError(err);
    if (err) { ref.current?.focus(); return; }
    onVerify(otp);
  };

  return (
    <form className="login__form" onSubmit={submit} noValidate>
      <div className="login__top">
        <div className="login__head login__head--otp">
          <div className="login__intro">
            <AuthHeading isPhone={isPhone} />
            <p>{resent ? 'We have sent a new 6 Digit OTP to' : 'We have sent 6 Digit OTP to'} +91 {mobile}</p>
          </div>
          <TextField
            ref={ref}
            label="OTP"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            error={error}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); if (error) setError(''); }}
          />
        </div>
        <p className="login__new">
          Don’t Receive the code?{' '}
          <button type="button" className="login__create" onClick={resend} disabled={seconds > 0}>Resend OTP</button>
          {seconds > 0 && <span className="login__timer"> ({mmss(seconds)})</span>}
        </p>
      </div>

      <div className="login__actions">
        <button type="submit" className="login__btn login__btn--dark">Verify OTP</button>
        <button type="button" className="login__btn login__btn--ghost" onClick={onBack}>Back to Login</button>
      </div>
    </form>
  );
}
