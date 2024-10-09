const { Schema, model } = require('mongoose')

const adminSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }
}, { collection: 'admin' })

const Admin = model('admin', adminSchema)

module.exports = Admin