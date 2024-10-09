module.exports = (req, res) => {
  console.log("El cliente ha cerrado sesion");
  req.session.destroy((err) => {
    if (err) {
      console.error("Hubo un error cerrando sesion:", err);
      return res.status(500).send("Error cerrando sesion");
    }
    res.redirect("/");
  });
};