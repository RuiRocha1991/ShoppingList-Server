const ShoppingList = require('../models/ShoppingList');

exports.getAllShoppingLists = (userId) => {
  return ShoppingList.find({owner: userId})
  .populate('owner')
  .populate('categories', '_id name', null, { sort: { 'name': 1 } })
  .populate({
    path: 'selectedItems',
    select:' ItemOnList quantity isCollected',
    populate: {
      path: 'ItemOnList',
      select: '_id item rankWhenSelected rankWhenUnselected',
      sort: { 'rankWhenSelected': 1 },
      populate: {
        path: 'item',
        select: '_id name defaultQuantity unitMeasurement',
      }
    }
  })
  .populate({
    path: 'unselectedItem',
    select:' _id item rankWhenSelected rankWhenUnselected',
    sort: { 'rankWhenUnselected': 1 },
    populate: {
      path: 'item',
      select: '_id name defaultQuantity unitMeasurement',
    }
  })
  .sort({name: 'asc'})
  .lean();
}

exports.createShoppingList = async (shoppingList) => {
  return await ShoppingList.create(shoppingList);
}