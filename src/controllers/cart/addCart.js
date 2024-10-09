const { ObjectId } = require("mongoose").Types;
const Product = require("../../models/product");
const Cart = require("../../models/cart");

module.exports = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    const customerId = req.session.customerId;

    // Si el producto no existe, redirigir a la página principal
    if (!product) {
      req.session.alert = "Producto no encontrado";
      return res.redirect("/");
    }

    // Si el cliente no está logueado, redirigir a la página principal
    if (!customerId) {
      console.log("cliente no logueado");
      req.session.alert = "cliente no logueado";
      return res.redirect("/");
    }

    let cart = await Cart.findOne({ customer: new ObjectId(customerId) }); // Buscar el carrito del cliente

    if (!cart) { // Si el cliente no tiene un carrito, crear uno
      cart = new Cart({
        customer: new ObjectId(customerId),
        products: [],
      });
    }

    const existingProductIndex = cart.products.findIndex((p) => p.product.equals(new ObjectId(productId))); // Buscar el producto en el carrito

    // Calcular la cantidad total de productos en el carrito más el que se va a agregar
    const totalQuantityInCart = existingProductIndex > -1 ? cart.products[existingProductIndex].quantity + 1 : 1;

    // Si la cantidad total supera la cantidad disponible, mostrar alerta
    if (totalQuantityInCart > product.quantity) {
      req.session.alert = `No hay suficiente cantidad del producto ${product.name} disponible.`;
      return res.redirect("/");
    }

    // Si el producto ya está en el carrito, incrementar la cantidad
    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({
        product: new ObjectId(productId),
        quantity: 1,
      });
    }

    await cart.save();

    console.log("Producto añadido al carrito: ", product.name);
    res.redirect("/");
  } catch (error) {
    console.error("Error agregando el producto al carrito: ", error);
    req.session.alert = "Error agregando el producto al carrito";
    res.redirect("/");
  }
};