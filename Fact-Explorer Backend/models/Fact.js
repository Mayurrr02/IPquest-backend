const mongoose = require('mongoose');

const FactSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ipr_type: { 
    type: String, 
    required: true, 
    enum: ['Patent', 'Copyright', 'Trademark', 'Design', 'Trade Secret'] 
  },
  domain: { type: String, required: true },
  year: { type: Number, required: true },
  source: { type: String }
});

module.exports = mongoose.model('Fact', FactSchema);