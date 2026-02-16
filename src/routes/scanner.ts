import { Router } from 'express';
import { checkInTicket } from '../controllers/scanner/checkInTicket';
import { createScanner } from '../controllers/scanner/createScanner';
import { deleteScanner } from '../controllers/scanner/deleteScanner';
import { scannerLogin } from '../controllers/scanner/scannerLogin';
import { updateScanner } from '../controllers/scanner/updateScanner';
import { authenticateScanner } from '../middleware/authenticate/scanner';
import { authenticateUser } from '../middleware/authenticate/user';
import { validate } from '../middleware/validate';
import { checkInTicketSchema, createScannerSchema, scannerLoginSchema, updateScannerSchema } from '../validators/scanner';
import { getScanners } from '../controllers/scanner/getScanners';
import { getCurrentScanner } from '../controllers/scanner/getCurrentScanner';

const router = Router();

router.post('/login', validate(scannerLoginSchema, 'body'), scannerLogin);

router.get('/me', authenticateScanner, getCurrentScanner);

router.route('/').get(authenticateUser, getScanners).post(authenticateUser, validate(createScannerSchema, 'body'), createScanner);
router.route('/:scannerId').patch(authenticateUser, validate(updateScannerSchema.shape.params, 'params'), validate(updateScannerSchema.shape.body, 'body'), updateScanner).delete(authenticateUser, deleteScanner)

router.post('/:eventId/checkin', authenticateScanner, validate(checkInTicketSchema.shape.params, 'params'), validate(checkInTicketSchema.shape.body, 'body'), checkInTicket);

export default router;
