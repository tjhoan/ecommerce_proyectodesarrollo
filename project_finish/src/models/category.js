const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  subcategories: { type: String, required: true }
}, { collection: 'category' });

const Category = mongoose.model('category', categorySchema);

module.exports = Category;
