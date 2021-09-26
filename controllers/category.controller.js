const Category = require('../models/Category');

exports.getCategories = (req, res) => {
  res.status(200).json({message: "Welcome guys GET"})
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