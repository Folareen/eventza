import Otp from './Otp';
import User from './User';

User.hasMany(Otp, {
    foreignKey: 'userId',
    as: 'otps',
});

Otp.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

export { Otp, User };

