const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'team lead', 'team member'], required: true },
  workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }]
});

module.exports = mongoose.model('User', userSchema);
