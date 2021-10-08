const ItemOnList = require('../models/ItemOnList');

exports.createItemOnList = async (itemOnList) => {
  const item = await ItemOnList.create(itemOnList);
  return item
}

exports.deleteItemsOnList = async (itemsOnList) => {
  await ItemOnList.deleteMany({ item: { $in: itemsOnList } });
}