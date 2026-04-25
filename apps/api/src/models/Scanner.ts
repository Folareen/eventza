import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/database';
import Event from './Event';
import type { Association, BelongsToManySetAssociationsMixin } from 'sequelize';

class Scanner extends Model<InferAttributes<Scanner>, InferCreationAttributes<Scanner>> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare password: string;
    declare userId: number;

    declare setEvents: BelongsToManySetAssociationsMixin<Event, number>;
    declare events?: Event[];
    static associations: {
        events: Association<Scanner, Event>;
    };
}

Scanner.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'scanners',
    sequelize,
    indexes: [
        { unique: true, fields: ['username'] },
        { fields: ['userId'] },
    ],
});

export default Scanner;
