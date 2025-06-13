const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Define associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });

module.exports = {
    User,
    Product,
    Order,
    OrderItem
}; 