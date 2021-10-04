const Item = require('../models/Item');

exports.getAllItemsByUserId = (userId) => {
  return Item.find({user: userId})
  .populate('category', "_id name description")
  .sort({name: 'asc'})
  .lean();
}

exports.getAllItemsByUserIdPaginated = (userId, page, rowsPerPage) => {
  var options = {
    select: '_id name category defaultQuantity unitMeasurement',
    sort: {name: 'asc'},
    populate: {
      path: 'category',
      select: '_id name description'
    },
    lean: true,
    page: page,
    limit: rowsPerPage
  };
  return Item.paginate({user: userId},options,(err, result) => {
    if(err) {
      return err;
    }
    return result;
  })
}
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