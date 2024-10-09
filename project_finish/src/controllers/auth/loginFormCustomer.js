const LoginCustomer = require("../../models/loginCustomer");

module.exports = async (req, res) => {
  req.session.alert = undefined;
  try {
    const data = req.body;
    console.log("data: " + JSON.stringify(data, null, 2));
    console.log(typeof data);
    
    const esTexto = /^[A-Za-z\sáéíóúÁÉÍÓÚñÑ]+$/;
    const esNumero = /^[0-9]+$/;
    const esEmail = /^[^\s@]+@[^\s@]*[^\d\s@]\.[^\s@]+$/;
    
    // Validaciones
    if (!data.cedula_customer || !esNumero.test(data.cedula_customer.trim())) {
      req.session.alert = "El campo cédula debe ser un número y no puede estar vacío";
      return res.redirect("/");
    }
    
    if (!data.first_name || !esTexto.test(data.first_name.trim())) {
      req.session.alert = "El campo nombre debe ser texto y no puede estar vacío";
      return res.redirect("/");
    }
    
    if (!data.email_customer || !esEmail.test(data.email_customer.trim())) {
      req.session.alert = "El campo email no puede estar vacío y debe tener un formato válido";
      return res.redirect("/");
    }

    let loginCustomer = await LoginCustomer.findOne({
      first_name: data.first_name,
      email: data.email_customer,
      cedula: data.cedula_customer,
    });

    if (!loginCustomer) {
      loginCustomer = new LoginCustomer({
        first_name: data.first_name,
        email: data.email_customer,
        cedula: data.cedula_customer,
      });
      await loginCustomer.save();
      console.log("Nuevo cliente creado");
    }

    req.session.customerId = loginCustomer._id.toString();
    req.session.customerName = loginCustomer.first_name;
    console.log("El cliente ha ingresado correctamente");

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    req.session.alert = "Ocurrió un error inesperado";
    return res.redirect("/");
  }
};