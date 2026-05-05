'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('events', 'state', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        });
        await queryInterface.addColumn('events', 'country', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('events', 'state');
        await queryInterface.removeColumn('events', 'country');
    },
};
