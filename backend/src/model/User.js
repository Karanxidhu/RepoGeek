const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  provider : String,
  name: String,
  email: String,
  googleId: String,
  githubId: String,
  accessToken: String,
  githubUsername: String
})

const User = mongoose.model('User', UserSchema);
module.exports = User;