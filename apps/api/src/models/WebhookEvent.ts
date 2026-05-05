import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/database';

class WebhookEvent extends Model<InferAttributes<WebhookEvent>, InferCreationAttributes<WebhookEvent>> {
    declare id: CreationOptional<number>;
    declare stripeEventId: string;
    declare type: string;
    declare processed: boolean;
    declare createdAt: CreationOptional<Date>;
}

WebhookEvent.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        stripeEventId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        processed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'webhook_events',
        sequelize,
        timestamps: false,
    }
);

export default WebhookEvent;
