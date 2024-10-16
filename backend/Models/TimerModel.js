const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timerLogSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date }
});
  
module.exports = mongoose.model('TimerLog', timerLogSchema);
