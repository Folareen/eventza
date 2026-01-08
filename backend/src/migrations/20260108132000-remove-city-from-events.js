'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('events', ['city']);
        await queryInterface.removeColumn('events', 'city');
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('events', 'city', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        });
        await queryInterface.addIndex('events', ['city']);
    }
};
