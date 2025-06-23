const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  userId: String,
  type: String,
  content: String,
  status: { type: String, default: 'pending' },
  reviewedBy: String,
  reviewComment: String,
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
});

module.exports = mongoose.models.Request || mongoose.model('Request', RequestSchema);
