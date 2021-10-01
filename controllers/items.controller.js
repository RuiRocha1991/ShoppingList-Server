const itemRepository = require('../repository/item.repository');
const categoryRepository = require('../repository/category.repository');

exports.getItemsByUserId = async (req, res) => {
  try {
    const items = await itemRepository.getAllItemsByUserId(res.locals.user._id);
    const categories = await categoryRepository.getAllCategoriesWithFilterProperties(res.locals.user._id, '_id name');
    res.status(200).json({items, token: res.locals.token, categories});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error getting all your items', err, token: res.locals.token});
  }
}

exports.addItem = async (req, res) => {
  try {
    req.body.user = res.locals.user._id;
    await itemRepository.createItem(req.body);
    res.status(201).json({message: "Item created successfully", token: res.locals.token});
  } catch (err) {
    console.log(err);
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({ success: false, message: 'Item already exist!' , token: res.locals.token});
    }
    return res.status(500).send({err, token: res.locals.token});
  }
}