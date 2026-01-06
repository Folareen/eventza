import Event from './Event';
import Otp from './Otp';
import User from './User';
import Ticket from './Ticket';

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

Event.hasMany(Ticket, {
    foreignKey: 'eventId',
    as: 'tickets',
});

Ticket.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'event',
});

export { Event, Otp, User, Ticket };

