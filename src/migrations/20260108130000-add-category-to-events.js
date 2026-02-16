'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('events', 'category', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        });
        await queryInterface.addIndex('events', ['category']);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('events', ['category']);
        await queryInterface.removeColumn('events', 'category');
    }
};
