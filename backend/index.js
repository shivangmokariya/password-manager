require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Credential = require('./models/Credential');
const { v4: uuidv4 } = require('uuid');
const speakeasy = require('speakeasy');
const crypto = require('crypto');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // 32 chars
const IV_LENGTH = 16;

function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  console.log(decrypted.toString(),"<<<decrypted.toString()")
  return decrypted.toString();
}

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://akashvekariya010:ljed3sGHZU7T0mpi@cluster0.qn2fyjc.mongodb.net/securepass';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('SecurePass Backend Running');
});

app.post('/api/credentials', async (req, res) => {
  try {
    const { emailOrUsername, password, twofaKey, expiry } = req.body;
    if (!emailOrUsername || !password || !twofaKey) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const uniqueId = uuidv4();
    // Store the 2FA key as plain base32
    const credential = new Credential({
      emailOrUsername,
      password,
      twofaKey, // store as is
      uniqueId,
      expiry: expiry ? new Date(expiry) : undefined
    });
    await credential.save();
    res.status(201).json({ message: 'Credential saved', uniqueId });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.get('/api/credentials/:uniqueId', async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const credential = await Credential.findOne({ uniqueId });
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    if (credential.expiry && new Date() > credential.expiry) {
      return res.status(410).json({ error: 'Credential link expired' });
    }
    // Use the 2FA key as is
    res.json({
      emailOrUsername: credential.emailOrUsername,
      password: credential.password, // hashed
      twofaKey: credential.twofaKey,
      uniqueId: credential.uniqueId,
      createdAt: credential.createdAt,
      expiry: credential.expiry
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.get('/api/credentials/:uniqueId/totp', async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const credential = await Credential.findOne({ uniqueId });
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    // Use the 2FA key as is for TOTP
    // Example (uncomment and implement if needed):
    // const token = speakeasy.totp({
    //   secret: credential.twofaKey,
    //   encoding: 'base32'
    // });
    // res.json({ token });
    return res.status(501).json({ error: 'TOTP generation not implemented in this endpoint.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.post('/api/totp/generate', (req, res) => {
  try {
    const { twofaKey } = req.body;

    if (!twofaKey) {
      return res.status(400).json({ error: '2FA key (base32) is required.' });
    }

    const token = speakeasy.totp({
      secret: twofaKey,
      encoding: 'base32'
    });

    res.status(200).json({ otp: token });
  } catch (err) {
    res.status(500).json({ error: 'Error generating OTP', details: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 