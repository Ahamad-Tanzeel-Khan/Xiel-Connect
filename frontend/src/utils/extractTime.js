export function extractTime(dateString) {
	const lastMsgTime = new Date(dateString).toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute:'2-digit'
    })

	return lastMsgTime
}