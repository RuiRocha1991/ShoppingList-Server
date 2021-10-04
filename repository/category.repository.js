const Category = require('../models/Category');

exports.getAllCategories = (userId) => {
  return Category.find({user: userId})
  .populate('user')
  .populate('items', '_id name defaultQuantity unitMeasurement', null, { sort: { 'name': 1 } })
  .sort({name: 'asc'})
  .lean();
}

exports.getAllCategoriesWithFilterProperties = (userId, fields) => {
  return Category.find({user: userId}, fields)
  .sort({name: 'asc'})
  .lean();
}


exports.createCategory = async (category) => {
  await Category.create(category);
}

exports.getCategoryById = async (categoryId) => {
  return Category.findById(categoryId)
  .populate('user')
  .lean();
}

exports.updateCategory = async (categoryId, updatedCategory) => {
  updatedCategory.updatedAt = Date.now();
  await Category.findOneAndUpdate({_id: categoryId}, updatedCategory, {
    new: true,
    runValidators: true
  });
}

exports.deleteCategory = async (categoryId) => {
  await Category.remove({_id: categoryId});
}