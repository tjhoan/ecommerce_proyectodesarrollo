const fs = require("fs");
const path = require("path");
const Image = require("../../models/image");
const Product = require("../../models/product");

module.exports = async (req, res) => {
  try {
    const productId = req.params.id;

    // Encuentra el producto por su ID y popular las rutas de las imágenes
    const product = await Product.findById(productId).populate("imagePaths");

    if (!product) {
      req.session.alert = "Producto no encontrado";
      return res.redirect("/admin");
    }

    // Elimina las imágenes en la carpeta `public/img` y en la base de datos
    for (const imageId of product.imagePaths) {
      const image = await Image.findById(imageId);

      if (image) {
        const imagePath = path.join(__dirname, "..", "..", image.path);

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }

        await Image.deleteOne({ _id: imageId });
      }
    }

    // Elimina el producto
    await Product.deleteOne({ _id: productId });

    console.log("Producto eliminado:", product);
    return res.redirect("/admin");
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    req.session.alert = "Error al eliminar el producto";
    return res.status(500).send(error.message);
  }
};