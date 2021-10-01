const mongoose = require('mongoose');

const ItemScheme = new mongoose.Schema({
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
  category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required:true
  },
  defaultQuantity: {
    type: Number,
    required: true
  },
  unitMeasurement:{
    type: String,
    required: true,
    enum: ["kilogramas", "gramas", "metros", "unidades", "litros"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  updatedAt:{
    type: Date,
    default: Date.now
  }
});

ItemScheme.index({ name: 1, user: 1 }, { unique: true })

module.exports = mongoose.model('Item', ItemScheme);