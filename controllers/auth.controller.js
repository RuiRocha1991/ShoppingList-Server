const userRepository = require('../repository/user.repository');
const jwt = require("jsonwebtoken");

exports.getAuthenticatedUser = async (id) => {
  try {
    return await userRepository.getUserById(id);
  } catch (err) {
    return null;
  }
}

exports.getUserOnSuccessSignIn = async (req, res) => {
  try{
    const {name, image, _id, email} = req.user;
    const token = jwt.sign({_id}, process.env.SECRET_KEY, { expiresIn: '1d' });
    res.status(200).json({user: {name, image, id: _id, email}, token});
  } catch(e){
    console.error(e);
    res.status(500).send({
      message:'Error request',
      error: e
    });
  }
}

exports.logout = async (req, res) => {
  try {
    req.logout();
  } catch (e) {
    res.status(200).json({success: "logout"});
  }
  res.status(200).json({success: "logout"});
}