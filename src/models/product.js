const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  name: { type: String, required: true},
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  brand: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
  description: { type: String, required: true },
  imagePaths: [{ type: Schema.Types.ObjectId, ref: 'image' }], 
}, { collection: 'product' });

const Product = model('product', productSchema);

module.exports = Product;
