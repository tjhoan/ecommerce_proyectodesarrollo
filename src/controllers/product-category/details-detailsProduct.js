const Product = require("../../models/product");

// Controlador para renderizar la vista de detalles
const details = (req, res) => {
  res.render("detalles");
};

// Controlador para obtener los detalles de un producto
const detailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("imagePaths");

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("detalles", {
      product,
    });
  } catch (error) {
    console.error("Error en detalles del producto:", error);
    return res.status(500).send(error.message);
  }
};

module.exports = {
  details,
  detailsProduct,
};