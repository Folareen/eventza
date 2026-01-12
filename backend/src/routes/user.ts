import { Router } from "express";
import { requestEmailVerification } from "../controllers/auth/requestEmailVerification";
import { verifyEmail } from "../controllers/auth/verifyEmail";
import { getUserEvents } from "../controllers/event/getUserEvents";
import { getUserEvent } from "../controllers/event/getUserEvent";
import { getUserEventTickets } from "../controllers/ticket/getUserEventTickets";
import { getUserEventTicket } from "../controllers/ticket/getUserEventTicket";
import { getUserEventOrders } from "../controllers/order/getUserEventOrders";
import { getUserEventOrder } from "../controllers/order/getUserEventOrder";
import { getCurrentUser } from "../controllers/user/getCurrentUser";
import { authenticateUser } from "../middleware/authenticate/user";
import { otpRequestLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { verifyEmailSchema } from "../validators/auth";
import { createScanner } from '../controllers/scanner/createScanner';
import { updateScanner } from '../controllers/scanner/updateScanner';
import { deleteScanner } from '../controllers/scanner/deleteScanner';
import { listScanners } from '../controllers/scanner/getScanners';
import { createScannerSchema, updateScannerSchema } from '../validators/scanner';

const router = Router();

router.get("/me", authenticateUser, getCurrentUser);
router.post("/me/scanners", authenticateUser, validate(createScannerSchema), createScanner);
router.get("/me/scanners", authenticateUser, listScanners);
router.put("/me/scanners/:scannerId", authenticateUser, validate(updateScannerSchema), updateScanner);
router.delete("/me/scanners/:scannerId", authenticateUser, deleteScanner);
router.get("/me/events", authenticateUser, getUserEvents);
router.get("/me/events/:eventId", authenticateUser, getUserEvent);
router.get("/me/events/:eventId/tickets", authenticateUser, getUserEventTickets);
router.get("/me/events/:eventId/tickets/:ticketId", authenticateUser, getUserEventTicket);
router.get("/me/events/:eventId/orders", authenticateUser, getUserEventOrders);
router.get("/me/events/:eventId/orders/:orderId", authenticateUser, getUserEventOrder);
router.post("/me/request-email-verification", authenticateUser, otpRequestLimiter, requestEmailVerification);
router.post("/me/verify-email", authenticateUser, validate(verifyEmailSchema), verifyEmail);

export default router;