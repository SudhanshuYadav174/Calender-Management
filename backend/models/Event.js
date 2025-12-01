const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  minutesBefore: { type: Number, required: true },
  notified: { type: Boolean, default: false }
});

const EventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String },
  color: { type: String, default: '#3b82f6' },
  reminders: [ReminderSchema]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
