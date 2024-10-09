const { ObjectId } = require("mongoose").Types;
const Cart = require("../../models/cart");

module.exports = async (req, res) => {
  const customerId = req.params.customerId;
  console.log("ID del cliente en proceso de pago: ", customerId);
  try {
    const cart = await Cart.findOne({ customer: new ObjectId(customerId) }).populate("products.product");

    const products = cart.products
      .filter((item) => item.product !== null)
      .map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }));

    console.log("Productos en cancelacion de compra: ", JSON.stringify(products, null, 2));

    const totalAmount = products.reduce((acc, item) => acc + item.subtotal, 0);

    res.render("procesoPago", { customerId, products, totalAmount });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).send("Error al obtener el carrito");
  }
};