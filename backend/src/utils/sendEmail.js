const nodemailer = require('nodemailer');

/**
 * Send an email (mocked in development, or actual SMTP if configured)
 * @param {Object} options - Email options (email, subject, message, html)
 */
const sendEmail = async (options) => {
    // If SMTP credentials are configured in environment variables, use them
    const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD;

    if (hasSmtpConfig) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from: `${process.env.FROM_NAME || 'Amazon Orders Team'} <${process.env.FROM_EMAIL || 'noreply@amazonorders.com'}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return info;
    } else {
        // Fallback for development/testing: mock email sending and log to console
        console.log('---------------- MOCK EMAIL SENT ----------------');
        console.log(`To:      ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body:    ${options.message}`);
        if (options.html) {
            console.log(`HTML:    Available (omitted from log for brevity)`);
        }
        console.log('-------------------------------------------------');

        return {
            mocked: true,
            to: options.email,
            subject: options.subject,
            message: options.message
        };
    }
};

module.exports = sendEmail;
