import { Router } from "express";
import { login } from "../controllers/auth/login";
import { requestPasswordlessLogin } from "../controllers/auth/passwordlessLogin";
import { refreshToken } from "../controllers/auth/refreshToken";
import { register } from "../controllers/auth/register";
import { requestPasswordReset } from "../controllers/auth/requestPasswordReset";
import { resetPassword } from "../controllers/auth/resetPassword";
import { verifyPasswordlessLogin } from "../controllers/auth/verifyPasswordlessLogin";
import { loginLimiter, otpRequestLimiter, registerLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import {
    loginSchema,
    refreshTokenSchema,
    registerSchema,
    requestPasswordlessLoginSchema,
    requestPasswordResetSchema,
    resetPasswordSchema,
    verifyPasswordlessLoginSchema
} from "../validators/auth";

const router = Router();

router.post("/register", registerLimiter, validate(registerSchema, 'body'), register);
router.post("/login", loginLimiter, validate(loginSchema, 'body'), login);
router.post("/refresh-token", validate(refreshTokenSchema, 'body'), refreshToken);
router.post("/request-password-reset", otpRequestLimiter, validate(requestPasswordResetSchema, 'body'), requestPasswordReset);
router.post("/reset-password", validate(resetPasswordSchema, 'body'), resetPassword);
router.post("/request-passwordless-login", otpRequestLimiter, validate(requestPasswordlessLoginSchema, 'body'), requestPasswordlessLogin);
router.post("/verify-passwordless-login", loginLimiter, validate(verifyPasswordlessLoginSchema, 'body'), verifyPasswordlessLogin);

export default router;
