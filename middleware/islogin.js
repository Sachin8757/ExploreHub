const isLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/listing/login");
  }
  next();
};

module.exports = isLogin;