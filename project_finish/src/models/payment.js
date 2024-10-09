const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  customer_id: { type: Schema.Types.ObjectId, ref: 'customer', required: true },
  geo_location: { type: String, required: true },
  postal_code: { type: Number, required: true },
  banc: { type: String, required: true },
  payment_type: { type: String, required: true },
  account_number: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
}, { collection: 'payment' });

module.exports = mongoose.model('payment', PaymentSchema);
