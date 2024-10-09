const mongoose = require('mongoose')
const Admin = require('./models/admin');

// Conexion a la base de datos
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/project') // Cambiar 'project' por el nombre de la base de datos
  .then(() => {
    console.log('DB is connected');
    initializeAdmin(); // Inicializar admin user con un valor predeterminado
  })
  .catch(err => console.error(err));

// Inicializar el usuario admin con un valor predeterminado
async function initializeAdmin() {
  try {
    const existingAdmin = await Admin.findOne({ name: 'admin' });
    if (!existingAdmin) {
      const newAdmin = new Admin({ name: 'admin', password: '123' });
      await newAdmin.save();
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
}