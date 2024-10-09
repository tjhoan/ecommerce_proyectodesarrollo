const { ObjectId } = require("mongoose").Types;
const buildPDF = require("../../config/pdfkit");
const Customer = require("../../models/customer");
const Cart = require("../../models/cart");
const Product = require("../../models/product");
const Payment = require("../../models/payment"); 

module.exports = async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const customer = await Customer.findOne({ login_customer_id: customerId }).exec();
    const cart = await Cart.findOne({ customer: customerId }).populate("products.product").exec();

    if (!customer || !cart) {
      return res.status(404).send("Datos no encontrados");
    }

    // Buscar el pago asociado al cliente
    const payment = await Payment.findOne({ customer_id: new ObjectId(customerId) }).exec();

    console.log("Customer ID:", customerId);
    console.log("Payment:", payment);

    // Actualizar cantidades de productos y eliminar productos si es necesario
    for (const cartProduct of cart.products) {
      const product = await Product.findById(cartProduct.product._id).exec();
      if (product) {
        if (product.quantity >= cartProduct.quantity) {
          product.quantity -= cartProduct.quantity;
          await product.save();
        } else {
          req.session.alert = `No hay suficiente cantidad de ${product.name} en stock.`;
        }
      }
    }

    // Eliminar el carrito del cliente después de la compra
    await Cart.deleteOne({ customer: customerId });

    // Calcular el amount basado en los productos en el carrito
    const amount = cart.products.reduce((sum, cartProduct) => {
      const price = parseFloat(cartProduct.product.price) || 0;
      const quantity = parseInt(cartProduct.quantity, 10) || 0;
      return sum + (price * quantity);
    }, 0);

    if (payment.payment_type === "bancolombiaALaMano") {
      payment.payment_type = "Bancolombia a la Mano";
    }

    // Preparar los datos de la factura
    const invoice = {
      purchaseDate: new Date().toLocaleDateString(),
      customer: customer.toObject(),
      cart: cart.toObject(),
      payment: {
        method: payment ? payment.payment_type : "Método de Pago No Especificado",
        account_number: payment ? payment.account_number.toString() : "Número de Cuenta No Especificado",
        amount: amount.toFixed(2)
      }
    };

    // Imprimir datos para depuración
    console.log("Invoice Data:", JSON.stringify(invoice, null, 2));

    res.setHeader("Content-disposition", "attachment; filename=facturaUrbanStreet.pdf");
    res.setHeader("Content-type", "application/pdf");

    buildPDF(
      (chunk) => res.write(chunk),
      () => res.end(),
      invoice
    );
  } catch (error) {
    console.error("Error al procesar la compra y generar la factura:", error);
    res.status(500).send("Error al procesar la compra y generar la factura");
  }
};