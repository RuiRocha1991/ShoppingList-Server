const mongoose = require('mongoose');

const ShoppingListSchema = new mongoose.Schema({
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  selectedItems:[
    {
      itemOnList: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemOnList'
      },
      quantity: {
        type: Number,
        required: true
      },
      isCollected: {
        type: Boolean,
        default: false
      }
    }
  ],
  unselectedItems:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemOnList'
    }
  ],
});

ShoppingListSchema.index({ name: 1, owner: 1 }, { unique: true })

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);