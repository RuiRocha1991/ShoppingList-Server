const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  }]
});

CategorySchema.index({ name: 1, user: 1 }, { unique: true })

module.exports = mongoose.model('Category', CategorySchema);