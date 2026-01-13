import { Router } from 'express';
import { validate } from '../middleware/validate';
import { scannerLogin } from '../controllers/scanner/scannerLogin';
import { getScannerEvents } from '../controllers/scanner/getScannerEvents';
import { checkInTicket } from '../controllers/scanner/checkInTicket';
import { scannerLoginSchema } from '../validators/scanner';

const router = Router();

router.post('/login', validate(scannerLoginSchema, 'body'), scannerLogin);

router.get('/:scannerId/events', getScannerEvents);
router.post('/:eventId/checkin', checkInTicket);

export default router;
