import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal.jsx';
import { getUser, hasSeenPrompt, markPromptSeen } from '../lib/auth.js';

const LoginModalContext = createContext({ openLogin: () => {} });
export const useLoginModal = () => useContext(LoginModalContext);

export function LoginModalProvider({ children }) {
  // open automatically on the very first visit (until closed / logged in once)
  const [open, setOpen] = useState(() => !hasSeenPrompt() && !getUser());

  const navigate = useNavigate();
  const after = useRef(null); // where to go once the person has logged in (e.g. their profile)

  // openLogin({ redirectTo: '/account/profile' }) -> after a successful login the person lands there
  const openLogin = useCallback((opts) => { after.current = opts?.redirectTo || null; setOpen(true); }, []);
  const onSuccess = useCallback(() => { if (after.current) navigate(after.current); after.current = null; }, [navigate]);
  const closeLogin = useCallback(() => { markPromptSeen(); setOpen(false); }, []);

  return (
    <LoginModalContext.Provider value={{ openLogin }}>
      {children}
      {open && <LoginModal onClose={closeLogin} onSuccess={onSuccess} />}
    </LoginModalContext.Provider>
  );
}
