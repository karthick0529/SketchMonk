const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignee: {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
  },
  date: { type: String, required: true },
  tag: { type: String, required: true },
});

module.exports = mongoose.model('Task', taskSchema);
