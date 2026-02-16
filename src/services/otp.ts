import Otp, { OtpStatus, OtpType } from '../models/Otp';
import { calculateOtpExpiry, generateOtp, isOtpExpired } from '../utils/otp';

export const createOtp = async (
    userId: number,
    type: OtpType,
    expiryMinutes: number = 10
): Promise<string> => {
    const otp = generateOtp();
    const expiresAt = calculateOtpExpiry(expiryMinutes);

    await Otp.create({
        userId,
        otp,
        type,
        expiresAt,
    });

    return otp;
};

export const verifyOtp = async (
    userId: number,
    otp: string,
    type: OtpType
): Promise<{ valid: boolean }> => {
    const otpRecord = await Otp.findOne({
        where: {
            userId,
            otp,
            type,
            status: OtpStatus.ACTIVE,
        },
    });

    if (!otpRecord) {
        return { valid: false };
    }

    if (isOtpExpired(otpRecord.expiresAt)) {
        await otpRecord.update({ status: OtpStatus.EXPIRED });
        return { valid: false };
    }

    await otpRecord.update({ status: OtpStatus.VERIFIED });

    return { valid: true };
};

export const invalidateOtps = async (userId: number, type: OtpType): Promise<void> => {
    await Otp.update(
        { status: OtpStatus.INVALIDATED },
        {
            where: {
                userId,
                type,
                status: OtpStatus.ACTIVE,
            },
        }
    );
};
