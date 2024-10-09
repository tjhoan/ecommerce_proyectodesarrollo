const PDFDocument = require("pdfkit");

const buildPDF = (dataCallback, endCallback, invoice) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  // Función auxiliar para validar números
  const validateNumber = (value, fallback = 0) => {
    const num = parseFloat(value);
    return isNaN(num) ? fallback : num;
  };

  // Información del almacén
  doc
    .fontSize(12)
    .text("Datos Almacén", { align: "center" })
    .fontSize(10)
    .text("Carrera 23 # 14-55 / La Unión, Valle del Cauca", { align: "center" })
    .text("urban.street@gmail.com", { align: "center" })
    .text("3298784556", { align: "center" })
    .text("NIT 4587963", { align: "center" })
    .moveDown()
    .moveDown();

  // Separador
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(2);

  // Título de la factura
  doc.fontSize(20).text("Urban Street", { align: "center" }).moveDown();

  // Información del cliente
  doc
    .fontSize(12)
    .text("Datos Cliente:", { align: "left" })
    .fontSize(10)
    .text(`Nombre del cliente: ${invoice.customer.first_name} ${invoice.customer.second_name || ""} ${invoice.customer.last_name}`, { align: "left" })
    .text(`Dirección: ${invoice.customer.address}`, { align: "left" })
    .text(`Correo electrónico: ${invoice.customer.email}`, { align: "left" })
    .text(`C.C ${invoice.customer.cedula}`, { align: "left" })
    .moveDown()
    .moveDown();

  // Información del pago
  const paymentAmount = validateNumber(invoice.payment.amount);

  doc
    .fontSize(12)
    .text("Método de pago:", { align: "left" })
    .fontSize(10)
    .text(`Método de pago: ${invoice.payment.method}`, { align: "left" })
    .text(`Total pagado: $${paymentAmount.toFixed(2)}`, { align: "left" })
    .moveDown()
    .moveDown();

  // Tabla de productos comprados
  doc.fontSize(14).text("Productos Comprados:", { align: "left" }).moveDown();

  const tableTop = doc.y;
  const itemNameX = 100;
  const itemPriceX = 300;
  const itemQuantityX = 400;
  const itemTotalX = 500;

  doc
    .fontSize(10)
    .text("No.", 50, tableTop, { width: 40, align: "center" })
    .text("Nombre", itemNameX, tableTop)
    .text("Precio", itemPriceX, tableTop)
    .text("Cantidad", itemQuantityX, tableTop)
    .text("Total", itemTotalX, tableTop)
    .moveDown();

  let position = tableTop + 20;

  let totalAmount = 0;
  invoice.cart.products.forEach((product, index) => {
    const price = validateNumber(product.product.price);
    const quantity = validateNumber(product.quantity, 1);

    const productTotal = price * quantity;
    totalAmount += productTotal;

    doc
      .fontSize(10)
      .text((index + 1).toString(), 50, position, { width: 40, align: "center" })
      .text(product.product.name, itemNameX, position)
      .text(`$${price.toFixed(2)}`, itemPriceX, position)
      .text(quantity.toString(), itemQuantityX, position)
      .text(`$${productTotal.toFixed(2)}`, itemTotalX, position);

    position += 20;
  });

  // Calcular IVA y total a pagar
  const iva = 0.2 * totalAmount;
  const totalToPay = totalAmount + iva;

  doc
    .moveDown(2)
    .text("Subtotal:", 50)
    .text(`$${totalAmount.toFixed(2)}`, 500, doc.y, { width: 100, align: "right" })
    .moveDown()
    .text("IVA (20%):", 50)
    .text(`$${iva.toFixed(2)}`, 500, doc.y, { width: 100, align: "right" })
    .moveDown()
    .text("Total a Pagar:", 50)
    .text(`$${totalToPay.toFixed(2)}`, 500, doc.y, { width: 100, align: "right" })
    .moveDown()
    .moveDown();

  // Nota importante
  const rightColumnWidth = 250; 
  doc
    .fontSize(10)
    .text("Nota Importante:", 550 - rightColumnWidth, doc.y, { width: rightColumnWidth, align: "right" })
    .moveDown()
    .text("Esta factura es muy importante en el momento de reclamar su pedido", 550 - rightColumnWidth, doc.y, { width: rightColumnWidth, align: "right" })
    .text("o requerir un reclamo, asegúrese de guardarla. ¡Gracias por su compra!", 550 - rightColumnWidth, doc.y, { width: rightColumnWidth, align: "right" });

  doc.end();
};

module.exports = buildPDF;
