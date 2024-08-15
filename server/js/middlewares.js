const db = require("./db");

module.exports = {
  isUser(req, res, next) {
    if(req?.session?.user?.id) {
      const user = db.ref.users[req.session.user.id];
      if(user) return next();
      return res.json({code:401,msg:'Silakan login terlebih dahulu - CXG8001'});
    }
    return res.json({code:403,msg:'Silakan login terlebih dahulu - CXG8002'});
  }
}