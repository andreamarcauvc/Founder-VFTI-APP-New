const mongoose = require('mongoose');

const FounderEntrySchema = new mongoose.Schema({
  founderName: String,
  startupName: String,
  email: String,
  founderType: String,
  traitDescriptions: String,
  suggestion: String,
  timestamp: Date,
});

module.exports = mongoose.model('FounderEntry', FounderEntrySchema);
