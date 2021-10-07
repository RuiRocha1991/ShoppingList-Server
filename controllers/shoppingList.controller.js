const shoppingListRepository = require('../repository/shoppingList.repository');
const categoryRepository = require('../repository/category.repository');
const itemRepository = require('../repository/item.repository');
const itemOnListRepository = require('../repository/itemOnList.repository');

exports.getShoppingList = async (req, res) => {
  try {
    const shoppingList = await shoppingListRepository.getAllShoppingLists(res.locals.user._id);
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
    const categories = await categoryRepository.getCategoryByArrayIds(req.body.categories, res.locals.user._id);
    let itemsIds = [];
    for (let index in categories) {
      itemsIds = itemsIds.concat(categories[index].items);
    }
    const items = await itemRepository.getItemsByArrayIds(itemsIds, res.locals.user._id);
    req.body.unselectedItem = await Promise.all(items.map(async (item, index) => {
      const itemOnList = {
        item,
        rankWhenSelected:index,
        rankWhenUnselected: index
      }
      const newItemOnList = await itemOnListRepository.createItemOnList(itemOnList);
      return newItemOnList._id
    }))
    req.body.categories = categories.map(category => category._id);
    await shoppingListRepository.createShoppingList(req.body);
    res.status(200).json({message: "List created successfully", token: res.locals.token});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error getting all your categories', err, token: res.locals.token});
  }
}