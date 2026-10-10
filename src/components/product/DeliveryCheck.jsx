import { useState } from 'react';
import { api } from '../../api/client.js';
import { createIcon } from '../Icons.jsx';

const WalletIcon = createIcon(<><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14v12H5a2 2 0 0 1-2-2V5" /><circle cx="16" cy="14" r="1" /></>);
const TruckIcon = createIcon(<><path d="M2 5h12v11H2zM14 9h4l4 4v3h-8z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>);

// used only when the backend can't be reached
const localEstimate = () => {
  const d = new Date(); d.setDate(d.getDate() + 5);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export default function DeliveryCheck() {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | ok | error
  const [info, setInfo] = useState(null);

  const check = async () => {
    if (!/^\d{6}$/.test(pin)) { setStatus('error'); return; }
    setStatus('loading');
    try {
      const r = await api.checkPincode(pin);
      setInfo(r);
      setStatus('ok');
    } catch (e) {
      if (e.unavailable) { setInfo({ estimatedLabel: localEstimate(), approximate: true }); setStatus('ok'); }
      else setStatus('error');
    }
  };

  return (
    <div className="pd-section pd-section--tight">
      <p className="pd-title-16">Delivery Details</p>
      <div className="delivery">
        <div className="pincode">
          <input
            value={pin}
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter the pincode"
            onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setStatus('idle'); }}
            onKeyDown={(e) => e.key === 'Enter' && check()}
          />
          <button onClick={check} disabled={status === 'loading'}>Check</button>
        </div>

        {status === 'error' && <p className="delivery__error">Please enter a valid 6-digit pincode</p>}
        {status === 'ok' && info && (
          <div className="delivery__info">
            {typeof info.cashOnDelivery === 'boolean' && (
              <p><WalletIcon /> {info.cashOnDelivery ? 'Cash on delivery is available' : 'Cash on delivery is not available'}</p>
            )}
            <p><TruckIcon /> Estimated Delivery by {info.estimatedLabel}{info.approximate ? ' (approx.)' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}
