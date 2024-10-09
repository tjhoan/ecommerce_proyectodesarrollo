const { Schema, model } = require('mongoose');

const loginCustomerSchema = new Schema({
  first_name: { type: String, required: true },
  email: { type: String, required: true },
  cedula: { type: Number, required: true, unique: true },
  created_at: { type: Date, default: Date.now }
}, { collection: 'login_Customer' });

const loginCustomer = model('login_Customer', loginCustomerSchema);

module.exports = loginCustomer;
