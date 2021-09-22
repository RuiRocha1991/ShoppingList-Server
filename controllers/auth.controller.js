

exports.getUserOnSuccessSignIn = async (req, res) =>
{
  try{
    const {displayName, image} = req.user;
    res.status(200).json({user: {displayName, image}});
  } catch(e){
    res.status(500).send({
      message:'Error request',
      error: e
    });
  }
}