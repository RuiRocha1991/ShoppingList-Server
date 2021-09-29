const User = require('../models/User');

exports.getUserById = async (id) => {
  try {
    return await User.findById(id).lean();
  } catch (err) {
    return null;
  }
}