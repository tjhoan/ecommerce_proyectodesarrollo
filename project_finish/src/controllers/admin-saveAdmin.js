const Category = require("../models/category");
const Product = require("../models/product");
const Admin = require("../models/admin");

// Controlador para renderizar el panel de administración
const admin = async (req, res) => {
  try {
    const products = await Product.find().populate("imagePaths").populate("category");
    const categories = await Category.find();

    res.render("dashboard", {
      products,
      categories,
      alert: req.session.alert,
    });

    delete req.session.alert;
  } catch (error) {
    console.error("Error al obtener productos o categorías:", error);
    res.status(500).send(error.message);
  }
};

// Controlador para guardar un nuevo administrador
const saveAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;
    
    if (!name || name.trim() === "") {
      req.session.alert = "El nombre del admin no puede estar vacío";
    } else if (!password || password.trim() === "") {
      req.session.alert = "La contraseña del admin no puede estar vacía";
    } else if (password.length <= 6) {
      req.session.alert = "La contraseña debe tener al menos 6 caracteres";
    }

    const newAdmin = new Admin({
      name,
      password,
    });

    await newAdmin.save();
    console.log("Admin creado:", newAdmin);

    res.redirect("/admin");
  } catch (err) {
    console.error("Error al crear admin:", err);
    res.status(500).send("Error al crear admin");
  }
};

module.exports = {
  admin,
  saveAdmin,
};
