import { Router } from 'express';
import { createTicket } from '../controllers/ticket/createTicket';
import { deleteTicket } from '../controllers/ticket/deleteTicket';
import { getEventTickets } from '../controllers/ticket/getEventTickets';
import { updateTicket } from '../controllers/ticket/updateTicket';
import { authenticateUser } from '../middleware/authenticate/user';
import { validate } from '../middleware/validate';
import { createTicketSchema, deleteTicketSchema, getEventTicketsSchema, updateTicketSchema } from '../validators/ticket';
import { createOrder } from '../controllers/order/createOrder';
import { createOrderSchema } from '../validators/order';

const router = Router({ mergeParams: true });

router.get('/', validate(getEventTicketsSchema, 'params'), getEventTickets);
router.post(
    '/',
    authenticateUser,
    validate(createTicketSchema.shape.params, 'params'),
    validate(createTicketSchema.shape.body, 'body'),
    createTicket
);
router.put('/:ticketId',
    authenticateUser,
    validate(updateTicketSchema.shape.params, 'params'),
    validate(updateTicketSchema.shape.body, 'body'),
    updateTicket
);
router.delete('/:ticketId', authenticateUser, validate(deleteTicketSchema, 'params'), deleteTicket);

router.post('/:ticketId/order',
    validate(createOrderSchema.shape.params, 'params'),
    validate(createOrderSchema.shape.body, 'body'),
    createOrder
);


export default router;
