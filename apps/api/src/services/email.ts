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

export interface TicketEmailData {
    to: string;
    recipientName: string;
    eventTitle: string;
    eventDate: string;
    eventVenue: string;
    ticketName: string;
    orderCode: string;
    qrCodeBuffer: Buffer;
}

export const sendTicketEmail = async (data: TicketEmailData): Promise<void> => {
    const { to, recipientName, eventTitle, eventDate, eventVenue, ticketName, orderCode, qrCodeBuffer } = data;

    await transporter.sendMail({
        to,
        subject: `Your ticket for ${eventTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px 24px; text-align: center;">
                    <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: -0.5px;">eventza</h1>
                    <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Your ticket is confirmed</p>
                </div>
                <div style="padding: 32px 24px; background: #fff;">
                    <p style="font-size: 16px; color: #374151; margin: 0 0 4px;">Hi ${recipientName},</p>
                    <p style="font-size: 15px; color: #6b7280; margin: 0 0 24px;">Here is your ticket for <strong style="color: #111827;">${eventTitle}</strong>.</p>

                    <div style="background: #f3f4f6; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; font-size: 13px; color: #6b7280; width: 110px;">Event</td>
                                <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #111827;">${eventTitle}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; font-size: 13px; color: #6b7280;">Date</td>
                                <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #111827;">${eventDate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; font-size: 13px; color: #6b7280;">Venue</td>
                                <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #111827;">${eventVenue}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; font-size: 13px; color: #6b7280;">Ticket</td>
                                <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #111827;">${ticketName}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center; margin-bottom: 24px;">
                        <p style="font-size: 13px; color: #6b7280; margin: 0 0 16px;">Scan this QR code at the entrance</p>
                        <img src="cid:ticket-qr@eventza" alt="Ticket QR Code" style="width: 200px; height: 200px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; background: #fff;" />
                    </div>

                    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center;">
                        <p style="font-size: 12px; color: #9ca3af; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 1px;">Manual entry code</p>
                        <p style="font-size: 18px; font-family: monospace; font-weight: 700; color: #111827; letter-spacing: 4px; margin: 0;">${orderCode}</p>
                        <p style="font-size: 11px; color: #9ca3af; margin: 8px 0 0;">Show this code if the QR scan fails</p>
                    </div>
                </div>
                <div style="padding: 16px 24px; text-align: center; background: #f9fafb; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 12px; color: #9ca3af; margin: 0;">This ticket was issued by eventza. Do not share with others.</p>
                </div>
            </div>
        `,
        attachments: [
            {
                filename: `ticket-${orderCode}.png`,
                content: qrCodeBuffer,
                cid: 'ticket-qr@eventza',
            },
        ],
    });
};
