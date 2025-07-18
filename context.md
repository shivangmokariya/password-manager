## App Name: SecurePass

### Description:
SecurePass is a secure credential storage web app. It allows users to save credentials (email, username, password) and a TOTP-based 2FA key. Each entry can be accessed via a unique link, which displays the data and a real-time 2FA OTP (regenerated every 30s). Built with React, Node.js, MongoDB, and TailwindCSS.

---

### Tech Stack:
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Auth & Security**:
  - 2FA via TOTP using `speakeasy` or `otplib`
  - Encrypted credentials using `bcrypt` or `crypto`
  - Short unique URLs using UUID or NanoID

---

### Core Features:
1. Add credential set (email/username, password, 2FA key)
2. Generate OTP every 30 seconds from the 2FA key
3. Create a unique link per credential en
