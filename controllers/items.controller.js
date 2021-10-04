const itemRepository = require('../repository/item.repository');
const categoryRepository = require('../repository/category.repository');

exports.addItem = async (req, res) => {
  try {
    const category = await  categoryRepository.getCategoryById(req.params.categoryId);
    if(!category.user._id.equals(res.locals.user._id)) {
      return res.status(403).send({success: false, message: 'Resource not available!', token: res.locals.token });
    }
    req.body.user = res.locals.user._id;
    req.body.category = category._id;
    const item = await itemRepository.createItem(req.body);
    category.items.push(item);
    await categoryRepository.updateCategory(category._id, category);
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
   const values = await getValuesAndValidate(req.params.itemId, req.params.categoryId, res.locals.user._id);
   if (!values.success) {
     return res.status(values.code).send({success: values.success, message: values.message, token: res.locals.token });
   }
   const item = values.item;
    let updatedItem = {
      ...item,
      name: req.body.name,
      category: values.category._id,
      defaultQuantity: req.body.defaultQuantity,
      unitMeasurement: req.body.unitMeasurement,
      updatedAt: Date.now()
    }
    await itemRepository.updateItem(item._id, updatedItem);
    res.status(200).json({message: "Item updated successfully", token: res.locals.token});

  } catch (err) {
    console.log(err);
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({ success: false, message: 'Item name already exist!', token: res.locals.token });
    }
    return res.status(500).send({err, token: res.locals.token});
  }
}

exports.deleteItem = async (req, res) => {
  try {
    const values = await getValuesAndValidate(req.params.itemId, req.params.categoryId, res.locals.user._id);
    if (!values.success) {
      return res.status(values.code).send({success: values.success, message: values.message, token: res.locals.token });
    }
    await itemRepository.deleteItem(values.item._id);
    const items = values.category.items.filter(item => !item._id.equals(values.item._id));
    values.category.items = items;
    await categoryRepository.updateCategory(values.category._id, values.category);
    res.status(200).json({message: "Item deleted successfully", token: res.locals.token});

  } catch (err) {
    console.error(err);
    return res.status(500).send({err, token: res.locals.token});
  }
}

const getValuesAndValidate = async (itemId, categoryId, userId) => {
  const item = await itemRepository.getItemById(itemId);
  const category = await categoryRepository.getCategoryById(categoryId);

  if (!item || !category) {
    return {
      success: false,
      code: 404,
      message: 'Resource not found!'
    }
  }

  if (!item.user.equals(userId) || !category.user._id.equals(userId)) {
    return {
      success: false,
      code: 403,
      message: 'Resource is not available!'
    }
  }
  const items = category.items.filter(value => value._id.equals(item._id));
  if (items.length === 0) {
    return {
      success: false,
      code: 404,
      message: 'Item not available in this category'
    }
  }
  return {
    success: true,
    item: item,
    category: category
  }
}