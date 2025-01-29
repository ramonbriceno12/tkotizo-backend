const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your database configuration

class ProviderEstimate extends Model {}

ProviderEstimate.init(
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
        model: 'purchase_orders', // Table name
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'providers', // Table name
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    estimate_file_url: {
      type: DataTypes.TEXT,
      allowNull: true, // Can be null until the provider submits the estimate
    },
    estimated_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // Can be null until the provider submits the estimate
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending', // Default status
      validate: {
        isIn: [['pending', 'submitted', 'reviewed', 'accepted', 'rejected']],
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'ProviderEstimate',
    tableName: 'provider_estimates',
    timestamps: false, // Disable automatic Sequelize timestamps since custom fields are used
    underscored: true, // Use snake_case in database columns
  }
);

module.exports = ProviderEstimate;
