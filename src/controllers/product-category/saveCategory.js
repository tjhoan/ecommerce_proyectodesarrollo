const Category = require("../../models/category");

module.exports = async (req, res) => {
  try {
    const { name, subcategories } = req.body;

    // Permite solo letras para `name` (sin espacios ni comas)
    const esNombreValido = /^[A-Za-záéíóúÁÉÍÓÚñÑ]+$/;  
    // Permite letras, espacios y comas para `subcategories`
    const esListaSubcategorias = /^[A-Za-z\sáéíóúÁÉÍÓÚñÑ]+(,[A-Za-z\sáéíóúÁÉÍÓÚñÑ]+)*$/;

    if (!name || !esNombreValido.test(name.trim())) {
      req.session.alert = "El nombre de la categoría debe contener solo letras y no puede estar vacío ni tener espacios o comas.";
      return res.redirect("/admin");
    }

    if (!subcategories || !esListaSubcategorias.test(subcategories.trim())) {
      req.session.alert = "Las subcategorías deben ser una lista de texto separada por comas y no debe contener numeros.";
      return res.redirect("/admin");
    }

    // Convertir subcategorías en un array de subcategorías, eliminando espacios en blanco
    const subcategoriesArray = subcategories.split(",").map((item) => item.trim());

    for (const subcategory of subcategoriesArray) {
      // Buscar si la categoría con la subcategoría ya existe
      const existingCategory = await Category.findOne({
        name: name.trim(),
        subcategories: subcategory
      });

      if (existingCategory) {
        req.session.alert = `La categoría ${name.trim()} con subcategoría ${subcategory} ya existe.`;
        continue;  // Continúa con la siguiente subcategoría
      }

      // Crear una nueva categoría para cada subcategoría
      const newCategory = new Category({
        name: name.trim(),
        subcategories: subcategory,
      });

      await newCategory.save();
      console.log("Categoría creada:", newCategory);
    }

    delete req.session.alert;
    res.redirect("/admin");
  } catch (err) {
    console.error("Error al crear o mostrar la categoría:", err);
    req.session.alert = "Error al crear o mostrar la categoría";
    res.redirect("/admin");
  }
};