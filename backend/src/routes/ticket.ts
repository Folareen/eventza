import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createTicket } from '../controllers/ticket/createTicket';
import { updateTicket } from '../controllers/ticket/updateTicket';
import { getEventTickets } from '../controllers/ticket/getEventTickets';
import { deleteTicket } from '../controllers/ticket/deleteTicket';
import { createTicketSchema, updateTicketSchema, deleteTicketSchema, getEventTicketsSchema } from '../validators/ticket';

const router = Router({ mergeParams: true });

router.get('/', validate(getEventTicketsSchema), getEventTickets);
router.post('/', authenticate, validate(createTicketSchema), createTicket);
router.put('/:ticketId', authenticate, validate(updateTicketSchema), updateTicket);
router.delete('/:ticketId', authenticate, validate(deleteTicketSchema), deleteTicket);

export default router;
