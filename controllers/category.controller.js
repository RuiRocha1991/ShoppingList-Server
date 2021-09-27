const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.id
    const categories = await Category.find({user: userId})
    .populate('user')
    .sort({name: 'asc'})
    .lean();
    res.status(200).json({categories});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error getting all your categories', err});
  }
}

exports.addCategory = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Category.create(req.body);
    res.status(201).json({message: "Category created successfully"});
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({ success: false, message: 'Category already exist!' });
    }
    return res.status(500).send(err);
  }
}

exports.editCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean()
    if (!category) {
      return res.status(404).send({success: false, message: 'Category not found!' });
    }

    if (category.user != req.user.id) {
      return res.status(401).send({success: false, message: 'Resource is not available' });
    } else {
      let updatedCategory = {
        ...category,
        name: req.body.name,
        description: req.body.description
      }
      await Category.findOneAndUpdate({_id: req.params.id}, updatedCategory, {
        new: true,
        runValidators: true
      });
      res.status(200).json({message: "Category updated successfully"});
    }
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({ success: false, message: 'Category already exist!' });
    }
    return res.status(500).send(err);
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean()
    if (!category) {
      return res.status(404).send({success: false, message: 'Category not found!' });
    }

    if (category.user != req.user.id) {
      return res.status(401).send({success: false, message: 'Resource is not available' });
    } else {
      await Category.remove({_id: req.params.id})
      res.status(200).json({message: "Category deleted successfully"});
    }
  } catch (err) {
    return res.status(500).send(err);
  }
}