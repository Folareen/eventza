import { Router } from "express";
import { getUserEvent } from "../controllers/event/getUserEvent";
import { getUserEvents } from "../controllers/event/getUserEvents";
import { getUserEventOrder } from "../controllers/order/getUserEventOrder";
import { getUserEventOrders } from "../controllers/order/getUserEventOrders";
import { getUserEventTicket } from "../controllers/ticket/getUserEventTicket";
import { getUserEventTickets } from "../controllers/ticket/getUserEventTickets";
import { getCurrentUser } from "../controllers/user/getCurrentUser";
import { logout } from "../controllers/user/logout";
import { requestEmailVerification } from "../controllers/user/requestEmailVerification";
import { verifyEmail } from "../controllers/user/verifyEmail";
import { authenticateUser } from "../middleware/authenticate/user";
import { otpRequestLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { verifyEmailSchema } from "../validators/auth";

const router = Router();

router.post("/logout", authenticateUser, logout);
router.get("/me", authenticateUser, getCurrentUser);
router.get("/me/events", authenticateUser, getUserEvents);
router.get("/me/events/:eventId", authenticateUser, getUserEvent);
router.get("/me/events/:eventId/tickets", authenticateUser, getUserEventTickets);
router.get("/me/events/:eventId/tickets/:ticketId", authenticateUser, getUserEventTicket);
router.get("/me/events/:eventId/orders", authenticateUser, getUserEventOrders);
router.get("/me/events/:eventId/orders/:orderId", authenticateUser, getUserEventOrder);
router.post("/me/request-email-verification", authenticateUser, otpRequestLimiter, requestEmailVerification);
router.post("/me/verify-email", authenticateUser, validate(verifyEmailSchema, 'body'), verifyEmail);

export default router;