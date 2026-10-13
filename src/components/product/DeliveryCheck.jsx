import { useState } from 'react';
import { api } from '../../api/client.js';
import { WalletIcon, TruckDeliveryIcon } from '../Icons.jsx';

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
              <p><WalletIcon size={16} /> {info.cashOnDelivery ? 'Cash on delivery is available' : 'Cash on delivery is not available'}</p>
            )}
            <p><TruckDeliveryIcon size={16} /> Estimated Delivery by {info.estimatedLabel}{info.approximate ? ' (approx.)' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}
