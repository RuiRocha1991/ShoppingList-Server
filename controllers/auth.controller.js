

exports.getUserOnSuccessSignIn = async (req, res) => {
  try{
    const {displayName, image} = req.user;
    console.log(req.user);
    console.log(req.cookie);
    console.log(req.cookies);
    res.status(200).json({user: {displayName, image}});
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