import Event from './Event';
import Otp from './Otp';
import User from './User';
import Ticket from './Ticket';
import Order from './Order';
import Scanner from './Scanner';

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

User.hasMany(Scanner, {
    foreignKey: 'userId',
    as: 'scanners'
});
Scanner.belongsTo(User, {
    foreignKey: 'userId',
    as: 'owner'
});

Scanner.belongsToMany(Event, {
    through: 'EventScanners',
    foreignKey: 'scannerId',
    otherKey: 'eventId',
    as: 'events'
});
Event.belongsToMany(Scanner, {
    through: 'EventScanners',
    foreignKey: 'eventId',
    otherKey: 'scannerId',
    as: 'scanners'
});

export { Event, Otp, User, Ticket, Order, Scanner };

