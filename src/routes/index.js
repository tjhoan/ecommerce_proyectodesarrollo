const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

// Importar controladores
const loginFormCustomer = require("../controllers/auth/loginFormCustomer");
const loginFormAdmin = require("../controllers/auth/loginFormAdmin");
const destroySession = require("../controllers/auth/destroySession");
const goToMain = require("../controllers/auth/goToMain");

const addCart = require("../controllers/cart/addCart");
const deleteProductCart = require("../controllers/cart/deleteProductCart");

const { formulario, paymentForm, formularioError } = require("../controllers/payment/paymentForm");
const procesoPago = require("../controllers/payment/procesoPago");
const generatePDF = require("../controllers/pdf/generatePDF");
const factura = require("../controllers/pdf/factura");

const getProductsByCategory = require("../controllers/product-category/getProductsByCategory");
const { details, detailsProduct } = require("../controllers/product-category/details-detailsProduct");
const deleteProduct = require("../controllers/product-category/deleteProduct");
const saveProduct = require("../controllers/product-category/saveProduct");
const saveCategory = require("../controllers/product-category/saveCategory");
const deleteCategory = require("../controllers/product-category/deleteCategory");

const { admin, saveAdmin } = require("../controllers/admin-saveAdmin");
const main = require("../controllers/main");
const { index, contact } = require("../controllers/index-contact");

// Rutas GET para productos y categorías
router.get("/category/:category/:customerId?", getProductsByCategory);
router.get("/detalles/:id", detailsProduct);

// Rutas GET para eliminar productos y categorías
router.get("/admin/product/delete/:id", deleteProduct);
router.get("/admin/category/delete/:id", deleteCategory);

// Rutas GET para el carrito de compras
router.get("/addCart/:id", addCart);
router.get("/delete/productCart/:productId", deleteProductCart);

// Rutas GET para la sesión y la navegación principal
router.get("/go-to-main", goToMain);
router.get("/logout", destroySession);

// Rutas GET para formularios y procesos relacionados
router.get("/formulario/:customerId", formulario);
router.get("/formulario/", formularioError);
router.get("/procesoPago/:customerId", procesoPago);

// Rutas GET para la generación de PDFs y facturas
router.get("/generate-invoice-pdf/:customerId", generatePDF);
router.get("/factura/:customerId", factura);

// Rutas POST para formularios de login y guardado
router.post("/form-login-cliente", loginFormCustomer);
router.post("/form-login-admin", loginFormAdmin);
router.post("/saveProduct", upload.array("images", 5), saveProduct);
router.post("/saveAdmin", saveAdmin); // Usar saveAdmin para la ruta de creación de admin
router.post("/saveCategory", saveCategory);
router.post("/paymentForm", paymentForm); // Usar paymentForm para la ruta del formulario de pago

// Rutas GET para vistas principales y administrativas
router.get("/", main);
router.get("/admin", admin);
router.get("/details", details);
router.get("/index", index);
router.get("/contacto", contact)

module.exports = router;