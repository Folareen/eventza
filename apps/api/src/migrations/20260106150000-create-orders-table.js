'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('orders', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            ticketId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'tickets', key: 'id' },
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            ticketId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'tickets', key: 'id' },
                onDelete: 'CASCADE',
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            status: {
                type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
                allowNull: false,
                defaultValue: 'pending',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('orders');
    },
};
