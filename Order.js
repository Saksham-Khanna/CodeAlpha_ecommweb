const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Order = sequelize.define('Orders', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    netprice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('completed', 'pending', 'cancelled'),
        allowNull: false
    }
}, {
    timestamps: false
});

// Define association
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order; 