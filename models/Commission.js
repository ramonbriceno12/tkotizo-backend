// models/Commission.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Commission extends Model {}

Commission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchase_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'purchase_orders',
        key: 'id',
      },
    },
    commission_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Commission',
    tableName: 'commissions',
    timestamps: false,
  }
);

module.exports = Commission;
