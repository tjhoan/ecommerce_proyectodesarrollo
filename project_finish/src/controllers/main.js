const { ObjectId } = require("mongoose").Types;
const Category = require("../models/category");
const Product = require("../models/product");
const Cart = require("../models/cart");

const getRandomProducts = (products, count) => {
  const shuffled = products.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getCategoryUrl = (categoryName, subcategory, customerId) => {
  return `/category/${categoryName}-${subcategory}?customerId=${customerId}`;
};

module.exports = async (req, res) => {
  const customerId = req.session.customerId || null;
  let productCart = [];

  try {
    // Obtener productos destacados
    const productShow = await Product.find().populate("imagePaths");

    if (customerId) {
      let cart = await Cart.findOne({ customer: customerId }).populate({
        path: "products.product",
        populate: { path: "imagePaths" }
      });

      if (!cart) {
        // Crear un nuevo carrito si no existe uno para el cliente
        const customerObjectId = new ObjectId(customerId);
        cart = await Cart.create({
          customer: customerObjectId,
          products: [],
        });
      }

      productCart = await Promise.all(
        cart.products.map(async (product) => {
          const productDetails = await Product.findById(product.product).populate("imagePaths");
          if (productDetails) {
            return {
              details: productDetails,
              quantity: product.quantity,
            };
          }
          return null;
        })
      );
      productCart = productCart.filter((product) => product !== null);
    }

    const alert = req.session.alert;
    req.session.alert = undefined;

    // Obtener todas las categorías
    const categories = await Category.find();

    // Crear un objeto para agrupar subcategorías por nombre de categoría
    const groupedCategories = {};
    categories.forEach((category) => {
      if (!groupedCategories[category.name]) {
        groupedCategories[category.name] = [];
      }
      // Añadir la subcategoría si no está ya en el array
      if (!groupedCategories[category.name].includes(category.subcategories)) {
        groupedCategories[category.name].push(category.subcategories);
      }
    });

    // Mapear las categorías para generar los URLs dinámicamente
    const categoryUrls = {};
    Object.keys(groupedCategories).forEach((categoryName) => {
      groupedCategories[categoryName].forEach((subcategory) => {
        const key = `${categoryName}-${subcategory}`;
        categoryUrls[key] = getCategoryUrl(categoryName, subcategory, customerId);
      });
    });

    // Convertir el objeto en un array de objetos para la vista
    const categoryData = Object.keys(groupedCategories).map((name) => ({
      name,
      subcategories: groupedCategories[name],
    }));

    // Seleccionar 9 productos aleatoriamente
    const uniqueProductShow = Array.from(new Set(productShow.map((p) => p._id))).map((id) => {
      return productShow.find((p) => p._id.toString() === id.toString());
    });

    const randomProducts = getRandomProducts(uniqueProductShow, 9);

    res.render("main", {
      customerId,
      customerName: req.session.customerName || "No hay cliente logueado",
      productShow: randomProducts,
      productCart,
      categories: categoryData,
      categoryUrls,
      alert,
    });
  } catch (error) {
    console.error("Error en el controlador:", error);
    res.status(500).send(error.message);
  }
};