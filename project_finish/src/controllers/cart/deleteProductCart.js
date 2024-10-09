const Cart = require("../../models/cart");

module.exports = async (req, res) => {
  const productId = req.params.productId;
  const customerId = req.session.customerId;

  try {
    let cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
      req.session.alert = "Carrito no encontrado";
      return res.redirect("/");
    }

    // Filtrar el producto que se desea eliminar del carrito
    cart.products = cart.products.filter((item) => !item.product.equals(productId));

    // Guardar el carrito actualizado
    await cart.save();

    res.redirect("/");
  } catch (error) {
    console.error("Error eliminando el producto del carrito:", error);
    req.session.alert = "Error eliminando el producto del carrito";
    res.redirect("/");
  }
};