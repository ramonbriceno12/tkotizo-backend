const sequelize = require('../config/database');

//Imports models
const User = require('./User');
const PurchaseOrder = require('./PurchaseOrder');
const Commission = require('./Commission');
const Invoice = require('./Invoice');
const Provider = require('./Provider');
const ProviderEstimate = require('./ProviderEstimate');

// Define associations
User.hasMany(PurchaseOrder, { foreignKey: 'user_id', as: 'purchaseOrders' });
PurchaseOrder.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

PurchaseOrder.hasMany(Commission, { foreignKey: 'purchase_order_id', as: 'commissions' });
Commission.belongsTo(PurchaseOrder, { foreignKey: 'purchase_order_id', as: 'purchaseOrder' });

PurchaseOrder.hasOne(Invoice, { foreignKey: 'purchase_order_id', as: 'invoice' });
Invoice.belongsTo(PurchaseOrder, { foreignKey: 'purchase_order_id', as: 'purchaseOrder' });

PurchaseOrder.belongsTo(Provider, { foreignKey: 'provider_id', as: 'provider' });
Provider.hasMany(PurchaseOrder, { foreignKey: 'provider_id', as: 'purchaseOrders' });

PurchaseOrder.hasMany(ProviderEstimate, { foreignKey: 'purchase_order_id', as: 'providerEstimates' });
ProviderEstimate.belongsTo(PurchaseOrder, { foreignKey: 'purchase_order_id', as: 'purchaseOrder' });

Provider.hasMany(ProviderEstimate, { foreignKey: 'provider_id', as: 'providerEstimates' });
ProviderEstimate.belongsTo(Provider, { foreignKey: 'provider_id', as: 'provider' });

module.exports = {
  sequelize,
  User,
  PurchaseOrder,
  Commission,
  Invoice,
  Provider, // Include Provider in the exports
  ProviderEstimate, // Include ProviderEstimate in the exports
};
