const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  deadline: { type: String }
});

module.exports = mongoose.model('Task', taskSchema);
