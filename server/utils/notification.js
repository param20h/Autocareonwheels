const sendPushNotification = async ({ token, title, body, data = {} }) => {
	const fcmServerKey = process.env.FCM_SERVER_KEY;
	if (!fcmServerKey) {
		return {
			success: false,
			skipped: true,
			reason: 'FCM_SERVER_KEY not configured',
			payload: { token, title, body, data },
		};
	}

	// Placeholder transport for now. Keep a predictable API and logging.
	console.log('Push notification requested', {
		token: token ? `${String(token).slice(0, 8)}...` : null,
		title,
		body,
		data,
	});

	return {
		success: true,
		provider: 'fcm',
		queued: true,
	};
};

module.exports = {
	sendPushNotification,
};
