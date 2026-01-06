import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/database';

class Ticket extends Model<InferAttributes<Ticket>, InferCreationAttributes<Ticket>> {
    declare id: CreationOptional<number>;
    declare eventId: number;
    declare name: string;
    declare description: CreationOptional<string | null>;
    declare price: number;
    declare quantityAvailable: number;
    declare quantitySold: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Ticket.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'events',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    quantityAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantitySold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'tickets',
    sequelize,
});

export default Ticket;
