const Admin = require("../../models/admin");

module.exports = async (req, res) => {
  try {
    const esTexto = /^[A-Za-z\sáéíóúÁÉÍÓÚñÑ]+$/;

    const data = req.body;
    
    const { admin_name, admin_password } = data;

    // Validaciones
    if (!admin_name || !esTexto.test(admin_name.trim())) {
      req.session.alert = "El campo nombre debe ser texto y no puede estar vacío";
      return res.redirect("/");
    }

    if (!admin_password || admin_password.trim() === "") {
      req.session.alert = "El campo contraseña debe ser texto y no puede estar vacío";
      return res.redirect("/");
    }

    const admin = await Admin.find({
      name: data.admin_name,
      password: data.admin_password,
    });

    if (!admin.length) {
      req.session.alert = "Los datos ingresados no son correctos";
      return res.redirect("/");
    } else {
      console.log("El admin ha ingresado correctamente");
      req.session.alert = undefined;
      return res.redirect("/admin");
    }
  } catch (error) {
    console.error(error);
    req.session.alert = "Ocurrió un error inesperado";
    return res.redirect("/");
  }
};
