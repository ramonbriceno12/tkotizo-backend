const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your database configuration

class Provider extends Model {}

Provider.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true, // Optional, depending on your requirements
      validate: {
        is: /^[+]?[\d\s\-()]+$/i, // Basic phone number validation
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
    modelName: 'Provider',
    tableName: 'providers',
    timestamps: false, // Disable automatic Sequelize timestamps since custom fields are used
    underscored: true, // Use snake_case in database columns
  }
);

module.exports = Provider;
