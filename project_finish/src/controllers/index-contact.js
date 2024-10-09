const index = (req, res) => {
  res.render("index");
}

const contact = (req, res) => {
  res.render("contacto");
}

module.exports = { index, contact };