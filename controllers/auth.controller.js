

exports.getUserOnSuccessSignIn = async (req, res) => {
  try{
    console.log(req.headers);
    const {displayName, image, _id} = req.user;
    res.status(200).json({user: {displayName, image, id:_id}});
  } catch(e){
    res.status(500).send({
      message:'Error request',
      error: e
    });
  }
}

exports.logout = async (req, res) => {
  req.logout();
  res.status(200).json({success: "logout"});
}