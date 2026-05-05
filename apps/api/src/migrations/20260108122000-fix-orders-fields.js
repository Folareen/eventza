'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // No-op: orders table already has the correct schema from create-orders-table migration
    },
    down: async (queryInterface, Sequelize) => {
        // No-op
    },
};
