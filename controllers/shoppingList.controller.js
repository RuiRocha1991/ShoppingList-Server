const shoppingListRepository = require('../repository/shoppingList.repository');

exports.getShoppingList = async (req, res) => {
  try {
    const shoppingList = await shoppingListRepository.getAllShoppingLists(res.locals.user._id);
    res.status(200).json({shoppingLists: shoppingList, token: res.locals.token});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error getting all your categories', err, token: res.locals.token});
  }
}