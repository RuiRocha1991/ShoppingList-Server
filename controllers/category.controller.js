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
    res.status(201).json({message: "Successfully created category"});
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({ success: false, message: 'Category already exist!' });
    }
    return res.status(500).send(err);
  }
}