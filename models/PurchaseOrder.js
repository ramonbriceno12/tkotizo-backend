const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class PurchaseOrder extends Model {}

PurchaseOrder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    file_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'pending',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      allowNull: false,
    },
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'PurchaseOrder',
    tableName: 'purchase_orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = PurchaseOrder;
