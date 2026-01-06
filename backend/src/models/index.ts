import Event from './Event';
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

User.hasMany(Event, {
    foreignKey: 'organizerId',
    as: 'events',
});

Event.belongsTo(User, {
    foreignKey: 'organizerId',
    as: 'organizer',
});

export { Event, Otp, User };

