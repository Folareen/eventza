import { Router } from 'express';
import { checkInOrder } from '../controllers/event/checkInOrder';
import { createEvent } from '../controllers/event/createEvent';
import { deleteEvent } from '../controllers/event/deleteEvent';
import { getAllEvents } from '../controllers/event/getAllEvents';
import { getEvent } from '../controllers/event/getEvent';
import { updateEvent } from '../controllers/event/updateEvent';
import { authenticateScanner } from '../middleware/authenticate/scanner';
import { authenticateUser } from '../middleware/authenticate/user';
import { validate } from '../middleware/validate';
import { createEventSchema, deleteEventSchema, eventListQuerySchema, getEventSchema, updateEventSchema } from '../validators/event';
import ticketRouter from './ticket';

const router = Router();

router.get('/', validate(eventListQuerySchema, 'query'), getAllEvents);
router.get('/:eventId', validate(getEventSchema, 'params'), getEvent);
router.post('/', authenticateUser, validate(createEventSchema, 'body'), createEvent);
router.put('/:eventId', authenticateUser, validate(updateEventSchema, 'body'), updateEvent);
router.delete('/:eventId', authenticateUser, validate(deleteEventSchema, 'params'), deleteEvent);

router.post('/:eventId/checkin', authenticateScanner, checkInOrder);
router.use('/:eventId/tickets', ticketRouter);

export default router;
