const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CredentialSchema = new mongoose.Schema({
  emailOrUsername: { type: String, required: true },
  password: { type: String, required: true },
  twofaKey: { type: String, required: true },
  uniqueId: { type: String, required: true, unique: true },
  expiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Credential', CredentialSchema); 