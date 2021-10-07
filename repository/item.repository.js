const Item = require('../models/Item');

exports.createItem = async (item) => {
  return await Item.create(item);
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

exports.deleteItem = async (itemId) => {
  await Item.remove({_id: itemId});
}

exports.deleteItemOnCategory = async (categoryId) => {
  await Item.remove({category: categoryId});
}

exports.getItemsByArrayIds = (itemsIds, userId) => {
  return Item.find({ '_id': { $in: itemsIds}, 'user':  { $in: userId }}).lean();
}