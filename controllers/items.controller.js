const itemRepository = require('../repository/item.repository');

exports.getItemsByUserId = async (req, res) => {
  try {
    // const items = await itemRepository.getAllItemsByUserId(res.locals.user._id);
    const items = [{_id: 123, name:"test1"},{_id: 456, name:"test2"}]
    res.status(200).json({items: items, token: res.locals.token});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Error getting all your categories', err, token: res.locals.token});
  }
}