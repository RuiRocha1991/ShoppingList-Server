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
  }
});

module.exports = mongoose.model('ItemOnList', ItemOnListSchema);