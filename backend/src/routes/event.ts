import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';

import { createEvent } from '../controllers/event/createEvent';
import { deleteEvent } from '../controllers/event/deleteEvent';
import { getAllEvents } from '../controllers/event/getAllEvents';
import { getEvent } from '../controllers/event/getEvent';
import { updateEvent } from '../controllers/event/updateEvent';
import { createEventSchema, deleteEventSchema, getEventSchema, updateEventSchema } from '../validators/event';
import ticketRouter from './ticket';

const router = Router();


router.get('/', getAllEvents);
router.get('/:eventId', validate(getEventSchema), getEvent);
router.post('/', authenticate, validate(createEventSchema), createEvent);
router.put('/:eventId', authenticate, validate(updateEventSchema), updateEvent);
router.delete('/:eventId', authenticate, validate(deleteEventSchema), deleteEvent);

router.use('/:eventId/tickets', ticketRouter);

export default router;
