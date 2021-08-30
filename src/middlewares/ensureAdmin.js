const User = require("../models/User");

module.exports = async function(request, response, next) {
  const id = request.userId;

  const user = await User.findOne({
    where: {
      id
    }
  });
  
  if(!user) {
    return response.status(400).json({ error: "User does not exist" });
  }
  
  if(!user.isAdmin) {
    return response.status(400).json({ error: "User is not admin" });
  }
  

  next();
}