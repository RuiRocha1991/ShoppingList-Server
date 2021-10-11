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
      options: { sort: { rankWhenSelected: 1 } },
      populate: {
        path: 'item',
        select: '_id name defaultQuantity unitMeasurement',
      }
    }
  })
  .populate({
    path: 'unselectedItems',
    select:' _id item rankWhenSelected rankWhenUnselected',
    options: { sort: { rankWhenUnselected: 1 } },
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

exports.getShoppingListById = async (id) => {
  return ShoppingList.findById(id)
  .populate({
    path: 'selectedItems',
    select: 'ItemOnList quantity isCollected',
    populate: {
      path: 'ItemOnList',
      select: '_id item rankWhenSelected rankWhenUnselected',
      sort: {'rankWhenSelected': 1},
      populate: {
        path: 'item',
        select: '_id name defaultQuantity unitMeasurement category',
      }
    }
  })
  .populate({
    path: 'unselectedItems',
    select: '_id item rankWhenSelected rankWhenUnselected',
    sort: {'rankWhenUnselected': 1},
    populate: {
      path: 'item',
      select: '_id name defaultQuantity unitMeasurement category',
    }
  }).lean();
}

exports.udpateShoppingList = async (shoppingList) => {
  await ShoppingList.findOneAndUpdate({_id: shoppingList._id}, shoppingList, {
    new: true,
    runValidators: true
  })
}

exports.deleteShoppingList = async (shoppingListID) => {
  await ShoppingList.remove({_id: shoppingListID});
}