exports.isAdmin = (req, res, next) => {
  console.log(req.decoded);
  // if (req.decoded.user.isAdmin == true) return console.log('Admin Here');

  // res
  //   .status(401)
  //   .json({success: false, message: 'Not Authorized for this action'});
};
