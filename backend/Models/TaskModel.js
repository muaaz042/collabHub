const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  deadline: { type: Date },
  timerLogs: [{ startTime: Date, endTime: Date }]
});

module.exports = mongoose.model('Task', taskSchema);
