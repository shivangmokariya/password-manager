import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function OTPDisplay() {
  const { uniqueId } = useParams();
  const [credential, setCredential] = useState(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState({});
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    fetch(`http://localhost:5000/api/credentials/${uniqueId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setCredential(data);
      })
      .catch(() => setError('Network error'));
  }, [uniqueId]);

  const fetchOtp = (twofaKey) => {
    fetch('http://localhost:5000/api/totp/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ twofaKey })
    })
      .then(res => res.json())
      .then(data => {
        if (data.otp) {
          setOtp(data.otp);
        } else if (data.error) {
          setOtp(`Error: ${data.error}`);
        }
      })
      .catch(() => setOtp('Network error while fetching OTP'));
  };

  useEffect(() => {
    if (!credential || !credential.twofaKey) return;

    fetchOtp(credential.twofaKey);
    setTimer(30);
    const otpInterval = setInterval(() => {
      fetchOtp(credential.twofaKey);
      setTimer(30);
    }, 30000); // refresh every 30 seconds

    return () => clearInterval(otpInterval);
  }, [credential]);

  useEffect(() => {
    if (!credential || !credential.twofaKey) return;
    if (timer === 0) return;
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer, credential]);

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 1200);
  };

  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  if (!credential) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4">
      <div className="bg-[#1e1e2f] border border-gray-700 shadow-[0_0_25px_rgba(0,0,0,0.25)] rounded-3xl px-10 py-12 max-w-xl w-full mx-auto space-y-8 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-8 tracking-tight drop-shadow">Credential Details</h1>
        <CopyRow
          label="Email/Username:"
          value={credential.emailOrUsername}
          copied={copied.emailOrUsername}
          onCopy={() => handleCopy('emailOrUsername', credential.emailOrUsername)}
        />
        {/* <CopyRow
          label="Unique Link:"
          value={credential.uniqueId}
          copied={copied.uniqueId}
          onCopy={() => handleCopy('uniqueId', credential.uniqueId)}
        /> */}
        <CopyRow
          label="Password (debug):"
          value={credential.password}
          copied={copied.password}
          onCopy={() => handleCopy('password', credential.password)}
          mono
        />
        <CopyRow
          label="Current OTP:"
          value={otp}
          copied={copied.otp}
          onCopy={() => handleCopy('otp', otp)}
          mono
          large
          addon={<span className="text-blue-300 text-lg font-mono bg-blue-900/40 px-3 py-1 rounded-xl shadow-inner ml-2">{timer}s</span>}
        />
      </div>
    </div>
  );
}

// Reusable row with copy button and optional addon (e.g., timer)
const CopyRow = ({ label, value, copied, onCopy, mono, large, addon }) => (
  <div className="flex items-center gap-2 mb-2 w-full">
    <strong className="text-white min-w-fit">{label}</strong>
    <span className={`flex-1 ${mono ? 'font-mono break-all text-blue-200' : 'text-blue-100'} ${large ? 'text-2xl font-bold' : ''}`}>{value}</span>
    <div className="flex items-center gap-2">
      <button
        onClick={onCopy}
        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        title="Copy"
        type="button"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
        {copied ? 'Copied!' : 'Copy'}
      </button>
      {addon}
    </div>
  </div>
);

export default OTPDisplay;
