import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Email sending failed');
    }
};

export const sendOtpEmail = async (email: string, otp: string, type: string, expiryMinutes: number): Promise<void> => {
    const subjects: { [key: string]: string } = {
        'password-reset': 'Password Reset OTP',
        'email-verification': 'Verify Your Email',
        'passwordless-login': 'Your Login OTP',
        'two-factor-auth': 'Two-Factor Authentication Code',
    };

    await sendEmail({
        to: email,
        subject: subjects[type] || 'Your OTP Code',
        text: `Your OTP is: ${otp}. This code will expire in ${expiryMinutes} minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 10px;">
                <h2 style="color: #333;">${subjects[type] || 'Your OTP Code'}</h2>
                <p style="font-size: 16px; color: #555;">
                    Your verification code is below. This code will expire in ${expiryMinutes} minutes.
                </p>
                <div style="background-color: #fff; padding: 20px; border-radius: 5px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <p style="font-size: 28px; font-weight: bold; text-align: center; margin: 0; letter-spacing: 8px; color: #4CAF50;">
                        ${otp}
                    </p>
                </div>
                <p style="font-size: 14px; color: #999; text-align: center;">
                    If you didn't request this code, please ignore this email.
                </p>
            </div>
        `,
    });
};

export const sendWelcomeEmail = async (email: string, otp: string, expiryMinutes: number): Promise<void> => {
    await sendEmail({
        to: email,
        subject: 'Welcome to Eventza! Verify Your Email',
        text: `Welcome to Eventza! Your verification OTP is: ${otp}. This code will expire in ${expiryMinutes} minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 10px;">
                <h1 style="color: #333;">Welcome to Eventza! 🎉</h1>
                <p style="font-size: 16px; color: #555;">
                    Thank you for joining Eventza. We're excited to have you on board!
                </p>
                <p style="font-size: 16px; color: #555;">
                    To get started, please verify your email address using the code below. This code will expire in ${expiryMinutes} minutes.
                </p>
                <div style="background-color: #fff; padding: 20px; border-radius: 5px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <p style="font-size: 28px; font-weight: bold; text-align: center; margin: 0; letter-spacing: 8px; color: #4CAF50;">
                        ${otp}
                    </p>
                </div>
                <p style="font-size: 14px; color: #999; text-align: center;">
                    If you didn't request this code, please ignore this email.
                </p>
                <p style="font-size: 14px; color: #555; text-align: center; margin-top: 20px;">Happy event planning! 🎊</p>
            </div>
        `,
    });
};
