require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Event = require('./models/Event');
const bcrypt = require('bcryptjs');

async function run() {
  await connectDB();
  await User.deleteMany({});
  await Event.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash('password123', salt);

  const user = new User({ name: 'Demo User', email: 'demo@example.com', password: hashed });
  await user.save();

  const sampleEvents = [
    {
      user: user._id,
      title: 'Team Standup',
      description: 'Daily sync',
      date: new Date().toISOString().slice(0,10),
      startTime: '09:00',
      endTime: '09:15',
      location: 'Zoom',
      color: '#f97316',
      reminders: [{ minutesBefore: 10 }, { minutesBefore: 60 }]
    },
    {
      user: user._id,
      title: 'Project Planning',
      description: 'Weekly planning session',
      date: new Date(Date.now()+24*3600*1000).toISOString().slice(0,10),
      startTime: '14:00',
      endTime: '15:00',
      location: 'Office',
      color: '#10b981',
      reminders: [{ minutesBefore: 1440 }]
    }
  ];

  await Event.insertMany(sampleEvents);
  console.log('Seed data created. Demo user: demo@example.com / password123');
  mongoose.connection.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
