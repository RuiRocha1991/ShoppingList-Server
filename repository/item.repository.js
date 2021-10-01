const Item = require('../models/Item');

exports.getAllItemsByUserId = (userId) => {
  return Item.find({user: userId})
  .populate('category', "_id name description")
  .sort({name: 'asc'})
  .lean();
}

exports.createItem = async (item) => {
  await Item.create(item);
}

exports.getItemById = async (itemId) => {
  return Item.findById(itemId)
  .lean();
}

exports.updateItem = async (itemId, updatedItem) => {
  await Item.findOneAndUpdate({_id: itemId}, updatedItem, {
    new: true,
    runValidators: true
  });
}