import { Router } from "express";
import { requestEmailVerification } from "../controllers/auth/requestEmailVerification";
import { verifyEmail } from "../controllers/auth/verifyEmail";
import { getUserEvents } from "../controllers/event/getUserEvents";
import { getCurrentUser } from "../controllers/user/getCurrentUser";
import { authenticate } from "../middleware/authenticate";
import { otpRequestLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { verifyEmailSchema } from "../validators/auth";

const router = Router();

router.get("/me", authenticate, getCurrentUser);
router.get("/me/events", authenticate, getUserEvents);
router.post("/me/request-email-verification", authenticate, otpRequestLimiter, requestEmailVerification);
router.post("/me/verify-email", authenticate, validate(verifyEmailSchema), verifyEmail);

export default router;