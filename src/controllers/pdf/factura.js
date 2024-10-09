const Customer = require("../../models/customer");
const Cart = require("../../models/cart");
const Payment = require("../../models/payment");

module.exports = async (req, res) => {
  const customerId = req.params.customerId;
  const paymentMethod = req.query.method;
  
  if (!paymentMethod) {
    return res.status(400).send("Método de pago no especificado");
  }

  try {
    const customer = await Customer.findOne({ login_customer_id: customerId });
    const cart = await Cart.findOne({ customer: customerId }).populate("products.product");
    const payment = await Payment.findOne({ customer_id: customerId });
    
    res.render("factura", {
      customer: customer.toObject(),
      cart,
      payment,
      paymentMethod
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los datos de la factura");
  }
};