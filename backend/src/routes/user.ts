import { Router } from "express";
import { requestEmailVerification } from "../controllers/auth/requestEmailVerification";
import { verifyEmail } from "../controllers/auth/verifyEmail";
import { getCurrentUser } from "../controllers/user/getCurrentUser";
import { authenticate } from "../middleware/authenticate";
import { otpRequestLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { verifyEmailSchema } from "../validators/auth";

const router = Router();

router.get("/", authenticate, getCurrentUser);
router.post("/request-email-verification", authenticate, otpRequestLimiter, requestEmailVerification);
router.post("/verify-email", authenticate, validate(verifyEmailSchema), verifyEmail);

export default router;