import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../config/database';

export enum OtpType {
    PASSWORD_RESET = 'password-reset',
    EMAIL_VERIFICATION = 'email-verification',
    PASSWORDLESS_LOGIN = 'passwordless-login',
    TWO_FACTOR_AUTH = 'two-factor-auth'
}

export enum OtpStatus {
    ACTIVE = 'active',
    VERIFIED = 'verified',
    EXPIRED = 'expired',
    INVALIDATED = 'invalidated'
}

class Otp extends Model<InferAttributes<Otp>, InferCreationAttributes<Otp>> {
    declare id: CreationOptional<number>;
    declare userId: number;
    declare otp: string;
    declare type: OtpType;
    declare expiresAt: Date;
    declare status: CreationOptional<OtpStatus>;
}

Otp.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM(...Object.values(OtpType)),
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(...Object.values(OtpStatus)),
        defaultValue: OtpStatus.ACTIVE,
        allowNull: false,
    },
}, {
    tableName: 'otps',
    sequelize,
});

export default Otp;
