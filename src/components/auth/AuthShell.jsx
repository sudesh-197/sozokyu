import { Link } from 'react-router-dom';
import { loginImage } from '../../data/home.js';
import { responsive } from '../../lib/images.js';
import { usePhone } from '../../hooks/useMediaQuery.js';

// Frame shared by the Login, OTP and Create-Account popups: Close pill, photo + logo on the left, form on the right.
export default function AuthShell({ onClose, label, children }) {
  const isPhone = usePhone(); // the photo is hidden on phones, so don't download it
  return (
    <div className="login" role="document" aria-label={label}>
      <button type="button" className="login__close" onClick={onClose} aria-label="Close and continue to the website">
        Close
      </button>
      <div className="login__inner">
        <div className="login__image">
          {!isPhone && <img {...responsive(loginImage, '445px')} alt="" decoding="async" />}
          <Link to="/" className="login__brand" onClick={onClose}>SOZOKYU</Link>
        </div>
        {children}
      </div>
    </div>
  );
}
