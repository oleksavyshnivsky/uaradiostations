// var audio = new Audio()
// audio.src = 'https://cast.radiogroup.com.ua/retro'
// audio.play()

// ————————————————————————————————————————————————————————————————————————————————
// chrome.runtime.onInstalled.addListener(function() {
// 	// Статус:
// 	// 	1 — виконувати завдання
// 	// 	0 — ні
// 	chrome.storage.local.set({status: 0}, function() {
// 		console.log('Статус активності записаний')
// 	})
// })

let audio = new Audio()
let status = 0
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (!request.url) {
		sendResponse({url: audio.src, status: status})
		return
	}

	if (audio.src !== request.url)
		status = 1
	else
		status = 1 - status

	audio.src = request.url

	if (status)
		audio.play()
	else
		audio.pause()

	sendResponse({status: status})
})
