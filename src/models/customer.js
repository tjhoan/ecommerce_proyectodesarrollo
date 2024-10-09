const { Schema, model } = require('mongoose')

const customerSchema = new Schema({
  login_customer_id: { type: Schema.Types.ObjectId, ref: 'login_Customer', required: true },
  first_name: { type: String, required: true },
  second_name: { type: String },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  cedula: { type: Number, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: Number, required: true },
  genre: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
}, { collection: 'customer' });

const Customers = model('customer', customerSchema)

module.exports = Customers
