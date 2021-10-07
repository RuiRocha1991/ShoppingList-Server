const categoryRepository = require('../repository/category.repository');
const itemRepository = require('../repository/item.repository');

exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryRepository.getAllCategories(res.locals.user._id);
    res.status(200).json({categories: categories, token: res.locals.token});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error getting all your categories', err, token: res.locals.token});
  }
}

exports.getCategoriesToShoppingList = async (req, res) => {
  try {
    const categories = await categoryRepository.getAllCategoriesToShoppingList(res.locals.user._id);
    res.status(200).json({categories: categories, token: res.locals.token});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error getting all your categories', err, token: res.locals.token});
  }
}

exports.addCategory = async (req, res) => {
  try {
    req.body.user = res.locals.user._id;
    req.body.items = [];
    await categoryRepository.createCategory(req.body);
    res.status(201).json({message: "Category created successfully", token: res.locals.token});
  } catch (err) {
    console.log(err);
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({ success: false, message: 'Category already exist!' , token: res.locals.token});
    }
    return res.status(500).send({err, token: res.locals.token});
  }
}

exports.editCategory = async (req, res) => {
  try {
    const category = await categoryRepository.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).send({success: false, message: 'Category not found!', token: res.locals.token });
    }

    if (!category.user._id.equals(res.locals.user._id)) {
      return res.status(401).send({success: false, message: 'Resource is not available', token: res.locals.token });
    } else {
      let updatedCategory = {
        ...category,
        name: req.body.name,
        description: req.body.description
      }
      await categoryRepository.updateCategory(req.params.id, updatedCategory);
      res.status(200).json({message: "Category updated successfully", token: res.locals.token});
    }
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({ success: false, message: 'Category already exist!', token: res.locals.token });
    }
    return res.status(500).send({err, token: res.locals.token});
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const category = await categoryRepository.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).send({success: false, message: 'Category not found!', token: res.locals.token });
    }

    if (!category.user._id.equals(res.locals.user._id)) {
      return res.status(401).send({success: false, message: 'Resource is not available', token: res.locals.token });
    } else {
      await itemRepository.deleteItemOnCategory(req.params.id);
      await categoryRepository.deleteCategory(req.params.id);
      res.status(200).json({message: "Category deleted successfully", token: res.locals.token});
    }
  } catch (err) {
    return res.status(500).send({err, token: res.locals.token});
  }
}