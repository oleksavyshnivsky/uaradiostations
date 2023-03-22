// ————————————————————————————————————————————————————————————————————————————————
// 
// ————————————————————————————————————————————————————————————————————————————————
const audio = new Audio()

// ————————————————————————————————————————————————————————————————————————————————
// Listen for messages from the extension
// ————————————————————————————————————————————————————————————————————————————————
chrome.runtime.onMessage.addListener((msg, options, callback) => {
	// if ('common' in msg) return false
	// else 
	if ('play' in msg) playAudio(msg.play)
	else if ('pause' in msg) pauseAudio()
	else if ('getstatus' in msg) {
		callback({
			url: audio.src,
			status: !audio.paused 
		})
	}
})

// Play sound with access to DOM APIs
function playAudio({ source, volume }) {
	if (!audio.paused) audio.pause() 
	audio.src = source
	audio.volume = volume
	audio.play()
}

// ————————————————————————————————————————————————————————————————————————————————
// Audio.play може ще не завершити завантаження
// ————————————————————————————————————————————————————————————————————————————————
function pauseAudio() {
	audio.pause()
}

// ————————————————————————————————————————————————————————————————————————————————
// send a message every 20 sec to service worker
// ————————————————————————————————————————————————————————————————————————————————
setInterval(() => {
	chrome.runtime.sendMessage({ keepAlive: true })
}, 20000)
