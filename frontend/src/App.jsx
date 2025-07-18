import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

function App() {
  const [form, setForm] = useState({
    emailOrUsername: '',
    password: '',
    twofaKey: '',
    expiry: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Credential saved! View it at: ' + window.location.origin + '/view/' + data.uniqueId);
        setForm({ emailOrUsername: '', password: '', twofaKey: '', expiry: '' });
      } else {
        setError(data.error || 'Error saving credential');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e1e2f] border border-gray-700 shadow-[0_0_25px_rgba(0,0,0,0.25)] rounded-3xl px-10 py-12 w-full max-w-xl space-y-8 flex flex-col items-center"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-8 tracking-tight drop-shadow">
          Add Credential
        </h1>

        <div className="w-full space-y-6">
          <InputField
            name="emailOrUsername"
            type="text"
            value={form.emailOrUsername}
            placeholder="Email or Username"
            icon="user"
            onChange={handleChange}
          />
          <InputField
            name="password"
            type="password"
            value={form.password}
            placeholder="Password"
            icon="lock"
            onChange={handleChange}
          />
          <InputField
            name="twofaKey"
            type="text"
            value={form.twofaKey}
            placeholder="2FA Key (Base32)"
            icon="shield-halved"
            onChange={handleChange}
          />
          <InputField
            name="expiry"
            type="datetime-local"
            value={form.expiry}
            placeholder="Expiry (optional)"
            icon="calendar-days"
            onChange={handleChange}
          />
        </div>

        {form.twofaKey && (
          <div className="flex flex-col items-center gap-2 mt-6">
            <p className="text-blue-300 font-medium">Scan with Authenticator App:</p>
            <div className="bg-white p-2 rounded-md shadow-md">
              <QRCodeSVG
                value={`otpauth://totp/SecurePass:${form.emailOrUsername || 'user'}?secret=${form.twofaKey}&issuer=SecurePass`}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 mt-6 rounded-2xl text-xl font-bold shadow-lg hover:scale-105 transition-all"
        >
          Save
        </button>

        {success && <div className="text-green-400 mt-4 text-center font-semibold">{success}</div>}
        {error && <div className="text-red-400 mt-4 text-center font-semibold">{error}</div>}
      </form>
    </div>
  );
}

// Reusable Input Field
const InputField = ({ name, type, value, placeholder, icon, onChange }) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-400">
      <i className={`fas fa-${icon} text-lg`}></i>
    </span>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-600 bg-[#2a2a3d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      required={type !== 'datetime-local'}
    />
  </div>
);

export default App;
