// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const sequelize = require('./config/database');
const userRoutes = require('./routes/usersRoutes');
const purchaseOrdersRoutes = require('./routes/purchaseOrdersRoutes');
const invoicesRoutes = require('./routes/invoicesRoutes');
const providersRoutes = require('./routes/providersRoutes');
const providerEstimatesRoutes = require('./routes/providerEstimatesRoutes');
const authRoutes = require('./routes/authRoutes');
const commissionRoutes = require('./routes/commissionsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only your frontend origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions)); // Use CORS with the configured options


// Routes
app.use('/api/users', userRoutes);
app.use('/api/purchase-orders', purchaseOrdersRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/provider-estimates', providerEstimatesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/commissions', commissionRoutes);


// Test the database connection and sync models
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    return sequelize.sync(); // Sync all defined models to the DB.
  })
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
