const nodemailer = require('nodemailer');

const createTransporter = () => {
	const host = process.env.SMTP_HOST;
	const port = Number.parseInt(process.env.SMTP_PORT || '587', 10);
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;

	if (!host || !user || !pass) {
		return null;
	}

	return nodemailer.createTransport({
		host,
		port,
		secure: port === 465,
		auth: { user, pass },
	});
};

const sendEmail = async ({ to, subject, html, text, attachments }) => {
	const transporter = createTransporter();
	if (!transporter) {
		throw new Error('SMTP is not configured');
	}

	const from = process.env.SMTP_FROM || process.env.SMTP_USER;
	return transporter.sendMail({
		from,
		to,
		subject,
		html,
		text,
		attachments,
	});
};

module.exports = {
	createTransporter,
	sendEmail,
};
