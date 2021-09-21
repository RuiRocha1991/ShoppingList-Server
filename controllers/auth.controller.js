

exports.getUserOnSuccessSignIn = async (req, res) =>
{
  try{
    const {googleId, displayName, _id, image} = req.user;
    res.status(200).json({user: {googleId, displayName, _id, image}});
  } catch(e){
    res.status(500).send({
      message:'Error request',
      error: e
    });
  }
}