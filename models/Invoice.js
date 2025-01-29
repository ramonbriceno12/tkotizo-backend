const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Invoice extends Model {}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchase_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'unpaid', // Default status
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Invoice;
