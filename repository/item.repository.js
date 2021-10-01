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