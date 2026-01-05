import { Router } from "express";
import { login } from "../controllers/auth/login";
import { logout } from "../controllers/auth/logout";
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
    logoutSchema,
    refreshTokenSchema,
    registerSchema,
    requestPasswordlessLoginSchema,
    requestPasswordResetSchema,
    resetPasswordSchema,
    verifyPasswordlessLoginSchema,
} from "../validators/auth";

const router = Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", validate(logoutSchema), logout);
router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);
router.post("/request-password-reset", otpRequestLimiter, validate(requestPasswordResetSchema), requestPasswordReset);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/request-passwordless-login", otpRequestLimiter, validate(requestPasswordlessLoginSchema), requestPasswordlessLogin);
router.post("/verify-passwordless-login", loginLimiter, validate(verifyPasswordlessLoginSchema), verifyPasswordlessLogin);

export default router;
