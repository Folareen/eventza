import { OtpType } from '../models/Otp';

export const OTP_EXPIRY_MINUTES = {
    [OtpType.PASSWORD_RESET]: 5,
    [OtpType.EMAIL_VERIFICATION]: 60,
    [OtpType.PASSWORDLESS_LOGIN]: 5,
    [OtpType.TWO_FACTOR_AUTH]: 2,
} as const;

export const OTP_LENGTH = 6;
