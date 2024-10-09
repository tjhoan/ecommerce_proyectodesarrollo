const { ObjectId } = require("mongoose").Types;
const Category = require("../../models/category");
const Product = require("../../models/product");
const Cart = require("../../models/cart");

const getCategoryUrl = (categoryName, subcategory, customerId) => {
  return `/category/${categoryName}-${subcategory}?customerId=${customerId}`;
};

module.exports = async (req, res) => {
  const [categoryName, subcategory] = req.params.category.split("-");
  const customerId = req.params.customerId || req.session.customerId;

  let productCart = [];

  try {
    // Buscar la categoría por nombre y subcategoría
    const category = await Category.findOne({
      name: categoryName,
      subcategories: subcategory,
    });

    if (!category) {
      return res.status(404).send("Categoría no encontrada");
    }

    // Obtener el ObjectId de la categoría encontrada
    const categoryId = category._id;

    // Buscar productos por el ObjectId de la categoría
    const productShow = await Product.find({
      category: categoryId,
    }).populate("imagePaths"); // Asegúrate de que `imagePaths` esté poblado

    let cart = [];
    if (customerId) {
      cart = await Cart.findOne({ customer: customerId }).populate("products.product");

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
          const productDetails = await Product.findById(product.product);
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

    const categories = await Category.find();
    // Crear un objeto para agrupar subcategorías por nombre de categoría
    const groupedCategories = {};
    categories.forEach((category) => {
      if (!groupedCategories[category.name]) {
        groupedCategories[category.name] = [];
      }
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

    console.log("FUNCIONA");
    console.log(categoryData, categoryUrls);

    res.render("main", {
      customerId,
      customerName: req.session.customerName || "No hay cliente logueado",
      productShow,
      productCart,
      categories: categoryData,
      categoryUrls,
      alert,
    });
  } catch (error) {
    console.error("Error en controlador de categoría:", error);
    res.status(500).send(error.message);
  }
};