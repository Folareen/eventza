import { Router } from 'express';
import { authenticateUser } from '../middleware/authenticate/user';
import { validate } from '../middleware/validate';
import { createTicket } from '../controllers/ticket/createTicket';
import { updateTicket } from '../controllers/ticket/updateTicket';
import { getEventTickets } from '../controllers/ticket/getEventTickets';
import { deleteTicket } from '../controllers/ticket/deleteTicket';
import { createTicketSchema, updateTicketSchema, deleteTicketSchema, getEventTicketsSchema } from '../validators/ticket';

const router = Router({ mergeParams: true });

router.get('/', validate(getEventTicketsSchema), getEventTickets);
router.post('/', authenticateUser, validate(createTicketSchema), createTicket);
router.put('/:ticketId', authenticateUser, validate(updateTicketSchema), updateTicket);
router.delete('/:ticketId', authenticateUser, validate(deleteTicketSchema), deleteTicket);

export default router;
