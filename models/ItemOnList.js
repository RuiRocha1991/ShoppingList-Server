const mongoose = require('mongoose');

const ItemOnListSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  rankWhenSelected: {
    type: Number,
    required: true,
  },
  rankWhenUnselected: {
    type: Number,
    required: true,
  },
  quantity:{
    type: Number,
    default: 0
  },
  isCollected: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('ItemOnList', ItemOnListSchema);