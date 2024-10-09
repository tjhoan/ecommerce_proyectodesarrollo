const { Schema, model } = require('mongoose')

const cartSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'login_Customer', required: true },
  products: {
    type: [{
      product: { type: Schema.Types.ObjectId, ref: 'product', required: true },
      quantity: { type: Number, required: true, default: 1 }
    }], required: true
  },
  created_at: { type: Date, default: Date.now }
}, { collection: 'cart' });

const Cart = model('cart', cartSchema)

module.exports = Cart
