const userRepository = require('../repository/user.repository');

exports.getAuthenticatedUser = async (id) => {
  try {
    /*
    I should have all logic to encode de token
     */
    return await userRepository.getUserById(id);
  } catch (err) {
    return null;
  }
}

exports.getUserOnSuccessSignIn = async (req, res) => {
  try{
    const {displayName, image, _id} = req.user;
    /*
    I should all logic to encode the token
     */
    res.status(200).json({user: {displayName, image}, token:_id});
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