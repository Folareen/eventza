import { z } from 'zod';

export const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
    lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(100, "Password is too long"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});

export const logoutSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});

export const requestPasswordResetSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long").max(100, "Password is too long"),
});

export const requestPasswordlessLoginSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const verifyPasswordlessLoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export const verifyEmailSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
});
