import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createEvent } from '../controllers/event/createEvent';
import { deleteEvent } from '../controllers/event/deleteEvent';
import { getAllEvents } from '../controllers/event/getAllEvents';
import { getEvent } from '../controllers/event/getEvent';
import { updateEvent } from '../controllers/event/updateEvent';
import { createEventSchema, deleteEventSchema, getEventSchema, updateEventSchema } from '../validators/event';

const router = Router();

router.get('/', getAllEvents);
router.get('/:id', validate(getEventSchema), getEvent);

router.post('/', authenticate, validate(createEventSchema), createEvent);
router.put('/:id', authenticate, validate(updateEventSchema), updateEvent);
router.delete('/:id', authenticate, validate(deleteEventSchema), deleteEvent);

export default router;
