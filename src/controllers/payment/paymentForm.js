const Customer = require("../../models/customer");
const Payment = require("../../models/payment");
const LoginCustomer = require("../../models/loginCustomer");

// Controlador para renderizar el formulario de pago
const formulario = (req, res) => {
  res.render("formulario", { customerId: req.params.customerId });
};

const formularioError = (req, res) => {
  const customerId = req.session.customerId;

  if (!customerId) {
    console.log("cliente no logueado");
    req.session.alert = "cliente no logueado";
    return res.redirect("/");
  }
};

// Controlador para procesar el formulario de pago
const paymentForm = async (req, res) => {
  const data = req.body;
  const esTexto = /^[A-Za-z\sáéíóúÁÉÍÓÚñÑ]+$/;

  // Funciones de validación auxiliares
  const validateNumericField = (value, fieldName, minLength) => {
    if (isNaN(value)) {
      return { valid: false, message: `El ${fieldName} debe ser numérico` };
    } else if (value.toString().length < minLength) {
      return { valid: false, message: `El ${fieldName} debe tener al menos ${minLength} dígitos` };
    } else if (value.trim() === "") {
      return { valid: false, message: `El ${fieldName} no puede estar vacío` };
    }
    return { valid: true };
  };

  const validateTextField = (value, fieldName, regex) => {
    if (typeof value !== "string" || !regex.test(value)) {
      return { valid: false, message: `El ${fieldName} debe ser texto y no contener números` };
    } else if (value.trim() === "") {
      return { valid: false, message: `El ${fieldName} no puede estar vacío` };
    }
    return { valid: true };
  };

  // Reglas de validación por campo
  const validationRules = {
    first_name: (value) => validateTextField(value, "primer nombre", esTexto),
    last_name: (value) => validateTextField(value, "apellido", esTexto),
    email: (value) => validateTextField(value, "email", /^[^\s@]+@[^\s@]*[^\d\s@]\.[^\s@]+$/),
    country: (value) => validateTextField(value, "país", esTexto),
    city: (value) => validateTextField(value, "ciudad", esTexto),
    neighborhood: (value) => validateTextField(value, "barrio", esTexto),
    banc: (value) => validateTextField(value, "banco", esTexto),
    payment_type: (value) => validateTextField(value, "tipo de pago", esTexto),
    cedula: (value) => validateNumericField(value, "cédula", 6),
    phone: (value) => validateNumericField(value, "teléfono", 7),
    postal_code: (value) => validateNumericField(value, "código postal", 4),
    account_number: (value) => validateNumericField(value, "número de cuenta", 10),
    second_name: (value) => {
      if (typeof value !== "string" || (value !== "" && !esTexto.test(value))) {
        return { valid: false, message: "El segundo nombre debe ser texto" };
      }
      return { valid: true };
    },
    genre: (value) => {
      if (typeof value !== "string" || (value !== "" && !esTexto.test(value))) {
        return { valid: false, message: "El género debe ser texto" };
      } else if (value.trim() === "") {
        return { valid: false, message: "El género no puede estar vacío" };
      } else if (value !== "Masculino" && value !== "Femenino" && value !== "otros") {
        return { valid: false, message: "El género debe ser Masculino, Femenino u otros" };
      }
      return { valid: true };
    },
    shipping_address: (value) => {
      if (typeof value !== "string" || value.trim() === "") {
        return { valid: false, message: "La dirección de envío no puede estar vacía" };
      }
      return { valid: true };
    },
    geo_location: (value) => {
      if (value.trim() === "") {
        return { valid: false, message: "La geolocalización no puede estar vacía" };
      }
      return { valid: true };
    },
  };

  // Función para validar los datos del pago
  const validatePaymentData = (data) => {
    for (const [key, value] of Object.entries(data)) {
      if (key === "customer_id") {
        continue; // Saltar la validación para customerId
      }

      if (validationRules[key]) {
        const validationResult = validationRules[key](value);
        if (!validationResult.valid) {
          return { valid: false, message: validationResult.message };
        }
      } else {
        return { valid: false, message: `Campo ${key} no reconocido` };
      }
    }
    return { valid: true }; // Si todos los campos son válidos, permite continuar con el guardado
  };

  // Validar los datos del pago
  const validation = validatePaymentData(data);
  if (!validation.valid) {
    // Si la validación falla, renderizar la vista del formulario con la alert correspondiente
    return res.render("formulario", {
      alert: validation.message,
      customerId: data.customer_id,
    });
  } else {
    // Verificar si el cliente ya existe
    let customer = await Customer.findOne({ cedula: data.cedula });

    if (!customer) {
      const address = `${data.shipping_address}, ${data.neighborhood}, ${data.city}, ${data.country}`;
      customer = new Customer({
        login_customer_id: data.customer_id,
        first_name: data.first_name,
        second_name: data.second_name,
        last_name: data.last_name,
        email: data.email,
        cedula: data.cedula,
        address: address,
        phone: data.phone,
        genre: data.genre,
      });

      // verificar que los datos ingresador en el payment sean los mismo que los del login

      let loginCustomer = await LoginCustomer.findById(data.customer_id);
      if (loginCustomer.cedula !== Number(data.cedula) || loginCustomer.email !== data.email) {
        return res.render("formulario", {
          alert: "Los datos ingresados no coinciden con los datos de registro",
          customerId: data.customer_id,
        });
      } else {
        try {
          await customer.save();
          console.log("Datos del cliente guardados:", customer);
        } catch (error) {
          console.error("Error guardando los datos del cliente:", error);
          return res.status(500).send("Error guardando los datos del cliente");
        }
      }
    }

    // Crear una nueva instancia del modelo Payment y guardar los datos
    const paymentData = new Payment({
      customer_id: customer.login_customer_id,
      geo_location: data.geo_location,
      postal_code: data.postal_code,
      banc: data.banc,
      payment_type: data.payment_type,
      account_number: data.account_number,
    });

    try {
      await paymentData.save();
      console.log("Datos de pago guardados:", paymentData);
    } catch (error) {
      let errorMessage = "Error al guardar los datos";
      if (error.code === 11000) {
        // Error de clave duplicada
        if (error.keyValue.cedula) {
          errorMessage = `La cédula ${error.keyValue.cedula} ya está registrada.`;
        } else if (error.keyValue.email) {
          errorMessage = `El email ${error.keyValue.email} ya está registrado.`;
        }
      }
      res.render("formulario", {
        alert: errorMessage,
        customerId: data.customer_id,
      });
    }
    res.redirect(`/procesoPago/${customer.login_customer_id}`);
  }
};

module.exports = {
  formulario,
  paymentForm,
  formularioError
};
