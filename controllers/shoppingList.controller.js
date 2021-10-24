const shoppingListRepository = require('../repository/shoppingList.repository');
const categoryRepository = require('../repository/category.repository');
const itemRepository = require('../repository/item.repository');
const itemOnListRepository = require('../repository/itemOnList.repository');

exports.getShoppingList = async (req, res) => {
  try {
    const shoppingList = await shoppingListRepository.getAllShoppingLists(res.locals.user._id);

    for (const shoppingListKey in shoppingList) {
      const unselectedList = shoppingList[shoppingListKey].unselectedItems.map(item => ({...item, quantity: item.item.defaultQuantity}));
      shoppingList[shoppingListKey] = {
        ...shoppingList[shoppingListKey],
        unselectedItems: unselectedList,
      }
    }
    res.status(200).json({shoppingLists: shoppingList, token: res.locals.token});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error getting all your categories', err, token: res.locals.token});
  }
}

exports.addShoppingList = async (req, res) => {
  try {
    req.body.owner = res.locals.user._id;
    req.body.selectedItems = [];
    const {categories, newsItems} = await addItemsOnShoppingList(req.body.categories, res.locals.user._id);
    req.body.unselectedItems = newsItems;
    req.body.categories = categories.map(category => category._id);
    await shoppingListRepository.createShoppingList(req.body);
    res.status(200).json({message: "List created successfully", token: res.locals.token});
  } catch (err) {
    console.error(err);
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({ success: false, message: 'Shopping List name already exist!', token: res.locals.token });
    }
    res.status(500).json({message: 'Error getting all your categories', err, token: res.locals.token});
  }
}

exports.editShoppingList = async (req, res) => {
  try {
    let shoppingList = await shoppingListRepository.getShoppingListById(req.params.id);
    const oldCategories = await categoryRepository.getCategoryByArrayIds(shoppingList.categories, res.locals.user._id);
    const newCategories = await categoryRepository.getCategoryByArrayIds(req.body.categories, res.locals.user._id);
    if (!shoppingList || !oldCategories|| !newCategories) {
      return res.status(404).send({success: false, message: 'Resource not found', token: res.locals.token });
    }

    const categoriesAdded = await filterCategories(newCategories, oldCategories);
    const categoriesRemoved = await filterCategories(oldCategories, newCategories);

    const removedItemsOnUnselectedList = shoppingList.unselectedItems.filter( itemOnList => categoriesRemoved.find(category => category.equals(itemOnList.item.category)) !== undefined);
    const removedItemsOnSelectedList = shoppingList.selectedItems.filter( onList =>  categoriesRemoved.find(category => category.equals(onList.item.category)) !== undefined);
    const removedItems = removedItemsOnUnselectedList.concat(removedItemsOnSelectedList);
    await itemOnListRepository.deleteItemsOnList(removedItems.map(itemOnList => itemOnList._id));

    const {newsItems} = await addItemsOnShoppingList(categoriesAdded, res.locals.user._id);

    shoppingList.unselectedItems = shoppingList.unselectedItems.filter( itemOnList => categoriesRemoved.find(category => category.equals(itemOnList.item.category)) === undefined).concat(newsItems);
    shoppingList.selectedItems = shoppingList.selectedItems.filter( onList =>  categoriesRemoved.find(category => category.equals(onList.item.category)) === undefined);
    shoppingList.categories = newCategories;
    shoppingList = {
      ...shoppingList,
      name: req.body.name,
      description: req.body.description
    }

    await shoppingListRepository.udpateShoppingList(shoppingList);

    res.status(200).json({message: "List edited successfully", token: res.locals.token});
  } catch (err) {
    console.error(err);
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({ success: false, message: 'Shopping List name already exist!', token: res.locals.token });
    }
    res.status(500).json({message: 'Error getting all your categories', err, token: res.locals.token});
  }
}

exports.deleteShoppingList = async (req, res) => {
  try {
    let shoppingList = await shoppingListRepository.getShoppingListById(req.params.id);
    if (!shoppingList) {
      return res.status(404).send({success: false, message: 'Resource not found', token: res.locals.token });
    }

    if(!shoppingList.owner._id.equals(res.locals.user._id)) {
      return res.status(403).send({success: false, message: 'Resource not available!', token: res.locals.token });
    }

    const itemsToRemove = shoppingList.selectedItems.map(item => item._id).concat(shoppingList.unselectedItems.map(item => item._id));

    await itemOnListRepository.deleteItemsOnList(itemsToRemove);

    await shoppingListRepository.deleteShoppingList(shoppingList._id);

    res.status(200).json({message: "List created successfully", token: res.locals.token});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error getting all your categories', err, token: res.locals.token});
  }
}

exports.saveShoppingList = async (req, res) => {
  try {
    let shoppingList = await shoppingListRepository.getShoppingListById(req.params.id);
    if (!shoppingList) {
      return res.status(404).send({success: false, message: 'Resource not found', token: res.locals.token });
    }

    if(!shoppingList.owner._id.equals(res.locals.user._id)) {
      return res.status(403).send({success: false, message: 'Resource not available!', token: res.locals.token });
    }
    const selectedItems = req.body.selectedItems;
    shoppingList = {
      ...shoppingList,
      selectedItems:selectedItems.map(item => ({_id: item._id})),
      unselectedItems: req.body.unselectedItems
    }
    for (let i in selectedItems) {
      await itemOnListRepository.update(selectedItems[i]);
    }

    await shoppingListRepository.udpateShoppingList(shoppingList);
    res.status(200).json({message: "List updated successfully", token: res.locals.token});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error getting all your categories', err, token: res.locals.token});
  }

}

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const addItemsOnShoppingList = async (categoriesIds, userId) => {
  const categories = await categoryRepository.getCategoryByArrayIds(categoriesIds, userId);
  let itemsIds = [];
  for (let index in categories) {
    itemsIds = itemsIds.concat(categories[index].items);
  }
  const items = await itemRepository.getItemsByArrayIds(itemsIds, userId);
  const newsItems = await Promise.all(items.map(async (item, index) => {
    const itemOnList = {
      item,
      rankWhenSelected:randomIntFromInterval(index * 100, index * 100 + 100),
      rankWhenUnselected: randomIntFromInterval(index * 100, index * 100 + 100)
    }
    const newItemOnList = await itemOnListRepository.createItemOnList(itemOnList);
    return newItemOnList._id;
  }))
  return {newsItems, categories}
}

const filterCategories = async (target, list) => {
  return await target
  .filter((cat) =>
      list
      .find((cat2) => cat2._id.equals(cat._id)) === undefined)
  .map(cat => cat._id);
}

