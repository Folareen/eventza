import { Router } from 'express';
import { checkInTicket } from '../controllers/scanner/checkInTicket';
import { createScanner } from '../controllers/scanner/createScanner';
import { deleteScanner } from '../controllers/scanner/deleteScanner';
import { getScannerEvents } from '../controllers/scanner/getScannerEvents';
import { scannerLogin } from '../controllers/scanner/scannerLogin';
import { updateScanner } from '../controllers/scanner/updateScanner';
import { authenticateScanner } from '../middleware/authenticate/scanner';
import { authenticateUser } from '../middleware/authenticate/user';
import { validate } from '../middleware/validate';
import { createScannerSchema, scannerLoginSchema, updateScannerSchema } from '../validators/scanner';

const router = Router();

router.post('/login', validate(scannerLoginSchema, 'body'), scannerLogin);

router.post('/scanners', authenticateUser, validate(createScannerSchema, 'body'), createScanner);
router.put("/me/scanners/:scannerId", authenticateUser, validate(updateScannerSchema, 'body'), updateScanner);
router.delete("/me/scanners/:scannerId", authenticateUser, deleteScanner);

router.get('/:scannerId/events', authenticateScanner, getScannerEvents);
router.post('/:eventId/checkin', authenticateScanner, checkInTicket);

export default router;
