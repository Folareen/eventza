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
import { authenticate } from "../middleware/authenticate";
import { otpRequestLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { verifyEmailSchema } from "../validators/auth";

const router = Router();

router.get("/me", authenticate, getCurrentUser);
router.get("/me/events", authenticate, getUserEvents);
router.get("/me/events/:eventId", authenticate, getUserEvent);
router.get("/me/events/:eventId/tickets", authenticate, getUserEventTickets);
router.get("/me/events/:eventId/tickets/:ticketId", authenticate, getUserEventTicket);
router.get("/me/events/:eventId/orders", authenticate, getUserEventOrders);
router.get("/me/events/:eventId/orders/:orderId", authenticate, getUserEventOrder);
router.post("/me/request-email-verification", authenticate, otpRequestLimiter, requestEmailVerification);
router.post("/me/verify-email", authenticate, validate(verifyEmailSchema), verifyEmail);

export default router;