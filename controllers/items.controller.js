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

exports.editItem = async (req, res) => {
  try {
    const item = await itemRepository.getItemById(req.params.id);
    if (!item) {
      return res.status(404).send({success: false, message: 'Category not found!', token: res.locals.token });
    }

    if (!item.user.equals(res.locals.user._id)) {
      return res.status(401).send({success: false, message: 'Resource is not available', token: res.locals.token });
    } else {
      let updatedItem = {
        ...item,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        defaultQuantity: req.body.defaultQuantity,
        unitMeasurement: req.body.unitMeasurement,
        updatedAt: Date.now()
      }
      await itemRepository.updateItem(req.params.id, updatedItem);
      res.status(200).json({message: "Item updated successfully", token: res.locals.token});
    }
  } catch (err) {
    console.log(err);
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({ success: false, message: 'Item name already exist!', token: res.locals.token });
    }
    return res.status(500).send({err, token: res.locals.token});
  }
}