'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addIndex('users', ['email']);
        await queryInterface.addIndex('otps', ['userId']);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('users', ['email']);
        await queryInterface.removeIndex('otps', ['userId']);
    },
};
