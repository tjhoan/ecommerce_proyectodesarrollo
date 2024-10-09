const Category = require("../../models/category");

module.exports = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      console.log("Categoría no encontrada");
      return res.status(404).send("Categoría no encontrada");
    }

    await Category.findByIdAndDelete(categoryId);
    console.log("Categoría eliminada: ", category);

    res.redirect("/admin");
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    res.status(500).send("Error al eliminar la categoría");
  }
};