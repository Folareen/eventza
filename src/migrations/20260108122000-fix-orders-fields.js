'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('orders', 'userId');
        await queryInterface.removeColumn('orders', 'eventId');
        await queryInterface.removeColumn('orders', 'quantity');
        await queryInterface.removeColumn('orders', 'totalPrice');
        await queryInterface.addColumn('orders', 'name', {
            type: Sequelize.STRING,
            allowNull: false,
        });
        await queryInterface.addColumn('orders', 'email', {
            type: Sequelize.STRING,
            allowNull: false,
        });
        await queryInterface.addColumn('orders', 'amount', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        });
        await queryInterface.addColumn('orders', 'code', {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('orders', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: false,
        });
        await queryInterface.addColumn('orders', 'eventId', {
            type: Sequelize.INTEGER,
            allowNull: false,
        });
        await queryInterface.addColumn('orders', 'quantity', {
            type: Sequelize.INTEGER,
            allowNull: false,
        });
        await queryInterface.addColumn('orders', 'totalPrice', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        });
        await queryInterface.removeColumn('orders', 'name');
        await queryInterface.removeColumn('orders', 'email');
        await queryInterface.removeColumn('orders', 'amount');
        await queryInterface.removeColumn('orders', 'code');
    },
};
