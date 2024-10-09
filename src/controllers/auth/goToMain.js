module.exports = (req, res) => {
  req.session.alert = undefined;
  res.redirect("/");
};