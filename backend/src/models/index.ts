import Event from './Event';
import Otp from './Otp';
import User from './User';
import Ticket from './Ticket';
import Order from './Order';

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

Ticket.hasMany(Order, {
    foreignKey: 'ticketId',
    as: 'orders',
});

Order.belongsTo(Ticket, {
    foreignKey: 'ticketId',
    as: 'ticket',
});

export { Event, Otp, User, Ticket, Order };

